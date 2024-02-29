import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class KavehnegarModule {
  static forRoot(): DynamicModule {
    return {
      module: KavehnegarModule,
    };
  }
}
