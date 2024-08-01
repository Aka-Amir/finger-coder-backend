import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { usersEvent } from 'src/@events/users/users.event';
import { UsersEventMessage } from 'src/@events/users/users.message-type';
import { IEventListener } from 'src/core/types/interfaces/events/event-listener.interface';
import { EventMessageType } from 'src/core/types/interfaces/events/event-message.type';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService
  implements IEventListener<UsersEventMessage>, OnModuleInit
{
  constructor(
    @InjectRepository(Profile) private readonly repo: Repository<Profile>,
  ) {}

  onModuleInit() {
    usersEvent.listen(this);
  }

  async onEventRaised(data: EventMessageType<UsersEventMessage>) {
    await this.repo.save({
      auth: data.authId,
    });
  }

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
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
