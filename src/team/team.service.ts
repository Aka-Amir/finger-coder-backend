import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly repo: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    return await this.repo.save(createTeamDto);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return this.repo.update(id, updateTeamDto);
  }

  remove(id: number) {
    return this.repo
      .delete(id)
      .then((response) => ({ affected: response.affected }));
  }
}
