import { Module } from '@nestjs/common';
import { SponsersService } from './sponsers.service';
import { SponsersController } from './sponsers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponser } from './entities/sponser.entity';
import { AuthModule } from '../core/auth';

@Module({
  imports: [TypeOrmModule.forFeature([Sponser]), AuthModule],
  controllers: [SponsersController],
  providers: [SponsersService],
})
export class SponsersModule {}
