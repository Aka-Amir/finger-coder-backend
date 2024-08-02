import { Module } from '@nestjs/common';
import { KavehnegarModule } from 'src/core/sdk/kavehnegar/kavehnegar.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { TokensModule } from 'src/core/services/tokens';

@Module({
  imports: [KavehnegarModule.forFeature(), TokensModule],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
