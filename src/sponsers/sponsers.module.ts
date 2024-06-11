import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponser } from './entities/sponser.entity';
import { SponsersController } from './sponsers.controller';
import { SponsersService } from './sponsers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sponser])],
  controllers: [SponsersController],
  providers: [SponsersService],
})
export class SponsersModule {}
