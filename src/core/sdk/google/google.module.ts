import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { GoogleSDKService } from './google.service';

@Module({
  imports: [HttpModule.register({})],
  providers: [GoogleSDKService],
  exports: [GoogleSDKService],
})
export class GoogleSDKModule {}
