import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppConfigService } from './common/services/configuration.service';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger(bootstrap.name);

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(AppConfigService);

  app.disable('x-powered-by');

  if (configService.isProduction()) {
    app.enableCors();
    app.use(helmet());
    app.use(compression());
  }

  const API_PREFIX = '/api';
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' }).setGlobalPrefix(API_PREFIX);

  // Configure Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest-Auth Api')
    .setDescription(
      'API for user authentication and authorization, including registration, login, and protected routes',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_PREFIX + '/:version/docs', app, document);

  const PORT = configService.port();
  await app.listen(PORT);
  logger.log(`Listening at Port ${PORT}`);
}
bootstrap();
