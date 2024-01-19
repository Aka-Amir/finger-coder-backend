import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/core/auth';
import { Team } from './entities/team.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), AuthModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
