import { Global, Module } from '@nestjs/common';
import { TokensModule } from '../services/tokens';
import { AccessGuard } from './access.guard';
import { AuthGuard } from './auth.guard';

@Global()
@Module({
  imports: [TokensModule],
  providers: [AccessGuard, AuthGuard],
  exports: [AccessGuard, AuthGuard],
})
export class GuardsModule {}
