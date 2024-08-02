import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createHash } from 'crypto';

import { AppModule } from './app.module';
import { AuthGuard } from './core/guards/auth.guard';
import { DatabaseInterceptor } from './core/interceptors/database.interceptor';
import { AdminsService } from './users/admins/admins.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new DatabaseInterceptor());
  app.useGlobalGuards(app.get(AuthGuard));
  const adminService = app.get<AdminsService>(AdminsService);
  const admins = await adminService.findAll();
  if (!admins.length) {
    const adminID = await adminService.create(
      {
        email: 'khaliliamir565@gmail.com',
        password: createHash('MD5').update('amirkhalili047').digest('hex'),
        username: 'amir',
      },
      true,
    );

    Logger.verbose(`Admin created with ID: ${adminID}`, 'Fingercoder');
  }
  await app.listen(3200);
}
bootstrap();
