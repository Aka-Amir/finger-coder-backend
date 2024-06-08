import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../core/auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KavehnegarModule } from 'src/core/sdk/kavehnegar/kavehnegar.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    TypeOrmModule.forFeature([User]),
    KavehnegarModule.forFeature(),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
