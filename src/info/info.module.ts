import { Module } from '@nestjs/common';
import { TeamModule } from './team/team.module';
import { PlansModule } from './plans/plans.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [TeamModule, PlansModule, MediaModule],
})
export class InfoModule {}
