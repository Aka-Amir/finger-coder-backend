import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const { id } = await this.adminRepo.save({
      email: createAdminDto.email,
      password: createAdminDto.password,
      username: createAdminDto.username,
    });

    return id;
  }

  findAll() {
    return this.adminRepo.find({});
  }

  findOne(id: string) {
    return this.adminRepo.findOne({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });
  }

  update(id: string, updateAdminDto: UpdateAdminDto) {
    return this.adminRepo.update(id, updateAdminDto);
  }

  remove(id: string) {
    return this.adminRepo.delete(id);
  }
}
