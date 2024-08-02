import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserEvent } from '../@events/create-user.event';
import { UsersEventModule } from '../@events/users-events.module';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(
    @InjectRepository(Profile) private readonly repo: Repository<Profile>,
    @Inject(UsersEventModule.events.createUser)
    private createUserEvent: CreateUserEvent,
  ) {}

  onModuleInit() {
    this.createUserEvent.listen({
      onEventRaised: (data) => this.create(data.authId),
    });
  }

  async create(authId: string) {
    return await this.repo.save({
      auth: authId,
    });
  }

  findOrCreateProfileId(authId: string) {
    const record = this.repo.findOne({
      where: {
        auth: {
          id: authId,
        },
      },
    });

    if (!record) {
      return this.create(authId);
    }

    return record;
  }

  findAll() {
    return `This action returns all profile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
