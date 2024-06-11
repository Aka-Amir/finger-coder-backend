import { Global, Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: 'dummy',
      global: true,
    }),
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
