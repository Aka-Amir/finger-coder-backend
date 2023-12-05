import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: 'root',
      database: 'db_fingercoder',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class DbModule {}
