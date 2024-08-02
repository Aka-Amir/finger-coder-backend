import { Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan) private readonly planRepo: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto) {
    const response = await this.planRepo.save({
      planLogo: createPlanDto.planLogo,
      planName: createPlanDto.planName,
      priceIRT: createPlanDto.priceIRT,
      planDescription: createPlanDto.planDescription,
    });

    return {
      planID: response.id,
    };
  }

  async findAll() {
    const [plans, count] = await this.planRepo.findAndCount();
    return { plans, count };
  }

  async findOne(id: string) {
    return this.planRepo.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const response = await this.planRepo.update(id, updatePlanDto);
    return {
      affected: response.affected,
    };
  }

  async remove(id: string) {
    const response = await this.planRepo.delete(id);

    return {
      affected: response.affected,
    };
  }
}
