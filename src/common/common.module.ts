import { Global, Module } from '@nestjs/common';
import { HashService } from './services/hash.service';
import { AppConfigService } from './services/configuration.service';

@Global()
@Module({
  providers: [HashService, AppConfigService],
  exports: [HashService, AppConfigService],
})
export class CommonModule {}
