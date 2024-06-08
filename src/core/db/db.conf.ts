import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: process.env.NODE_ENV === 'DEV' ? 'mariadb' : 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'root',
  database: process.env.DB_NAME || 'db_fingercoder',
  autoLoadEntities: true,
  synchronize: true,
};
