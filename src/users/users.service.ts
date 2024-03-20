import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FindType } from './types/find.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: Omit<CreateUserDto, 'code'>) {
    const user = await this.usersRepo.save({
      ...createUserDto,
      joinedAt: new Date(),
    });
    return user;
  }

  findAll(findData: FindType) {
    const query = [];

    if (findData.fullName) {
      query.push({ firstName: Like(`${findData.fullName}%`) });
      query.push({ lastName: Like(`${findData.fullName}%`) });
    }

    if (findData.phoneNumber) {
      query.push({ phoneNumber: Like(`${findData.phoneNumber}%`) });
    }

    return this.usersRepo.find({
      where: query,
    });
  }

  findByPhoneNumber(phoneNumber: string) {
    return this.usersRepo.findOne({
      where: { phoneNumber },
    });
  }

  findOne(id: number) {
    return this.usersRepo.findOne({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.usersRepo.delete(id);
  }
}
