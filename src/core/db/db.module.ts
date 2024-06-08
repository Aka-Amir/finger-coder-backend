import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './db.conf';
@Global()
@Module({
  imports: [TypeOrmModule.forRoot(DatabaseConfig)],
})
export class DbModule {}
