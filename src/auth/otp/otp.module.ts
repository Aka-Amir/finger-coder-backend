import { Module } from '@nestjs/common';
import { KavehnegarModule } from 'src/core/sdk/kavehnegar/kavehnegar.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [KavehnegarModule.forFeature()],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
