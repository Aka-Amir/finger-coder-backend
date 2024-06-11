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
import { Access } from 'src/core/decorators/access.decorator';
import { Public } from 'src/core/decorators/public.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlansService } from './plans.service';

@Controller('plans')
@Access(TokenType.access)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(AccessGuard)
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessGuard)
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
