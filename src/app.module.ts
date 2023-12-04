import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [CoreModule, AdminsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
