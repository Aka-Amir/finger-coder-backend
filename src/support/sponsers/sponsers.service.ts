import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSponserDto } from './dto/create-sponser.dto';
import { UpdateSponserDto } from './dto/update-sponser.dto';
import { Sponser } from './entities/sponser.entity';
import { AcceptanceStatus } from './types/acceptance-status.enum';

@Injectable()
export class SponsersService {
  constructor(
    @InjectRepository(Sponser)
    private readonly sponsersRepo: Repository<Sponser>,
  ) {}

  async create(createSponserDto: CreateSponserDto) {
    const record = await this.sponsersRepo.save({
      acceptanceStatus: AcceptanceStatus.WAITING,
      sponserEmail: createSponserDto.sponserEmail,
      clientName: createSponserDto.clientName,
      sponseringReason: createSponserDto.sponseringReason,
      sponsershipPriceIRT: createSponserDto.sponsershipPriceIRT,
      selectedPlan: createSponserDto.selectedPlan,
    });

    return {
      id: record.id,
    };
  }

  async findAll(from: number, to: number) {
    const [sponsers, count] = await this.sponsersRepo.findAndCount({
      skip: from,
      take: to - from,
    });

    return {
      count,
      sponsers,
      from,
      to,
    };
  }

  findOne(id: string) {
    return this.sponsersRepo.findOne({
      where: {
        id,
      },
      relations: {
        selectedPlan: true,
      },
    });
  }

  async update(id: string, updateSponserDto: UpdateSponserDto) {
    const response = await this.sponsersRepo.update(id, updateSponserDto);
    return {
      affected: response.affected,
    };
  }

  remove(id: string) {
    return this.sponsersRepo.delete(id);
  }
}
