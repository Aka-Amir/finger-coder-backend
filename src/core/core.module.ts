import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';

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
