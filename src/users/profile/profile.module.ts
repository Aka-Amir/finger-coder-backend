import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UsersEventModule } from '../@events/users-events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UsersEventModule.forFeature()],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
