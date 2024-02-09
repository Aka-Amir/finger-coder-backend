import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { AuthModule } from '../core/auth';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), AuthModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
