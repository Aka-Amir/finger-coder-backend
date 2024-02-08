import { Injectable } from '@nestjs/common';
import { CreateSponserDto } from './dto/create-sponser.dto';
import { UpdateSponserDto } from './dto/update-sponser.dto';

@Injectable()
export class SponsersService {
  create(createSponserDto: CreateSponserDto) {
    return 'This action adds a new sponser';
  }

  findAll() {
    return `This action returns all sponsers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sponser`;
  }

  update(id: number, updateSponserDto: UpdateSponserDto) {
    return `This action updates a #${id} sponser`;
  }

  remove(id: number) {
    return `This action removes a #${id} sponser`;
  }
}
