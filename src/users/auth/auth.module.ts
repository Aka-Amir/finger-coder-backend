import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './@shared/entities/auth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpModule } from './otp/otp.module';
import { GithubModule } from './github/github.module';
import { OAuthID } from './@shared/entities/oauth-id.entity';
import { GoogleModule } from './google/google.module';
import { UsersEventModule } from '../@events/users-events.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, OAuthID]),
    GithubModule,
    OtpModule,
    GoogleModule,
    UsersEventModule.forFeature(),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
