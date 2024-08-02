import { Module } from '@nestjs/common';
import { SponsersModule } from './sponsers/sponsers.module';

@Module({
  imports: [SponsersModule],
})
export class SupportModule {}
