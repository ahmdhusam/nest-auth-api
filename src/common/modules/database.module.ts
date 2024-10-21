import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from '../services/configuration.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory(configService: AppConfigService) {
        return {
          uri: configService.mongodbUri(),
        };
      },
    }),
  ],
})
export class DatabaseModule {}
