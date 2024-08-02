import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { AdminsModule } from './admins/admins.module';

@Module({
  imports: [AuthModule, ProfileModule, AdminsModule],
  providers: [],
})
export class UsersModule {}
