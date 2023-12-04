import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AdminsModule } from './admins/admins.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [CoreModule, AdminsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
