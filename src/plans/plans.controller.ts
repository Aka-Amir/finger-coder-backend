import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../core/auth';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { AccessGuard } from 'src/core/guards/access.guard';

@Controller('plans')
@Access(TokenType.access)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(AuthGuard, AccessGuard)
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AccessGuard)
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AccessGuard)
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
