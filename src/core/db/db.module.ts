import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { DatabaseConfig } from './db.conf';
@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const { DatabaseConfig } = await import('./db.conf');
        console.log(DatabaseConfig);
        return DatabaseConfig;
      },
    }),
  ],
})
export class DbModule {}
