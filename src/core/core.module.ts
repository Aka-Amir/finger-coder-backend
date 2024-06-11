import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { DbModule } from './db/db.module';
import { AccessGuard } from './guards/access.guard';
import { GuardsModule } from './guards/guards.module';

@Global()
@Module({
  imports: [GuardsModule, DbModule],
  providers: [
    {
      provide: 'STATIC_PATH',
      useValue: join(__dirname, '..', 'public/'),
    },
    AccessGuard,
  ],
  exports: ['STATIC_PATH'],
})
export class CoreModule {}
