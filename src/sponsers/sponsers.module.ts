import { Module } from '@nestjs/common';
import { SponsersService } from './sponsers.service';
import { SponsersController } from './sponsers.controller';

@Module({
  controllers: [SponsersController],
  providers: [SponsersService]
})
export class SponsersModule {}
