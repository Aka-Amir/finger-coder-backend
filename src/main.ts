import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AdminsService } from './admins/admins.service';
import { createHash } from 'crypto';
import { DatabaseInterceptor } from './core/interceptors/database.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new DatabaseInterceptor());
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
  await app.listen(3000);
}
bootstrap();
