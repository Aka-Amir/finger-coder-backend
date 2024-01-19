import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { AuthModule } from '../core/auth';

@Module({
  imports: [AuthModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
