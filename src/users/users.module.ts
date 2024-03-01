import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../core/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KavehnegarModule } from 'src/core/sdk/kavehnegar/kavehnegar.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),
    KavehnegarModule.forFeature(),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
