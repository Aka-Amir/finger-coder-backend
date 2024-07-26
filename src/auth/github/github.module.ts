import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubModule as GithubSDKModule } from '../../core/sdk/github/github.module';
import { TokensModule } from 'src/core/services/tokens';
import { GithubAuthGuard } from './github-auth.guard';
@Module({
  imports: [
    TokensModule,
    GithubSDKModule.register(() => ({
      client: {
        id: process.env.GITHUB_CLIENT_ID,
        secret: process.env.GITHUB_CLIENT_SECRET,
      },
    })),
  ],
  controllers: [GithubController],
  providers: [GithubService, GithubAuthGuard],
})
export class GithubModule {}
