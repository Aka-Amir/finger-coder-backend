import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(createUserDto: Omit<CreateUserDto, 'code'>) {
    const user = await this.usersRepo.save(createUserDto);
    return user;
  }

  findAll() {
    return this.usersRepo.find();
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
