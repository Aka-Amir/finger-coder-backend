import { Global, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { join } from 'path';

@Global()
@Module({
  imports: [AuthModule, DbModule],
  providers: [
    {
      provide: 'STATIC_PATH',
      useValue: join(__dirname, '..', 'public/'),
    },
  ],
  exports: ['STATIC_PATH'],
})
export class CoreModule {}
