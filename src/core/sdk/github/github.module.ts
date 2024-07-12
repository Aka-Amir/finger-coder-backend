import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubSdkModuleOptions } from './types/module-registration.type';

@Module({})
export class GithubModule {
  static register(
    options: GithubSdkModuleOptions | (() => GithubSdkModuleOptions),
  ): DynamicModule {
    const optionsProvider = {
      provide: 'GIT_OPT',
      useFactory: async () => {
        if (typeof options === 'object') {
          return options;
        }
        return options();
      },
    };
    return {
      module: GithubModule,
      imports: [HttpModule.register({})],
      providers: [GithubService, optionsProvider],
      exports: [GithubService, optionsProvider],
    };
  }
}
