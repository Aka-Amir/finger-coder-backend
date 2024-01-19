import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { EventsModule } from './events/events.module';
import { TeamModule } from './team/team.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [CoreModule, AdminsModule, UsersModule, EventsModule, TeamModule, MediaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
