import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { GoogleController } from './google.controller';
import { GoogleSDKModule } from 'src/core/sdk/google/google.module';

@Module({
  imports: [GoogleSDKModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}
