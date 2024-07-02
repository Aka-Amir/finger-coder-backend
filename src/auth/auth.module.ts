import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensModule } from 'src/core/services/tokens';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { KavehnegarModule } from 'src/core/sdk/kavehnegar/kavehnegar.module';
import { CoreAuthentication } from './services/core-auth.service';
import { GithubAuthentication } from './services/github-auth.service';
import { GoogleAuthentication } from './services/google-auth.service';

@Module({
  imports: [
    TokensModule,
    TypeOrmModule.forFeature([Auth]),
    KavehnegarModule.forFeature(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    CoreAuthentication,
    GithubAuthentication,
    GoogleAuthentication,
  ],
})
export class AuthModule {}
