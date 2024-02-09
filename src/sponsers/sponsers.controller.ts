import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { SponsersService } from './sponsers.service';
import { CreateSponserDto } from './dto/create-sponser.dto';
import { UpdateSponserDto } from './dto/update-sponser.dto';
import { AuthGuard } from '../core/auth';

@Controller('sponsers')
export class SponsersController {
  constructor(private readonly sponsersService: SponsersService) {}

  @Post()
  create(@Body() createSponserDto: CreateSponserDto) {
    if (
      (createSponserDto.sponsershipPriceIRT || 0) < 1_000_000 &&
      !createSponserDto.selectedPlan
    )
      throw new BadRequestException('no plan selected');

    return this.sponsersService.create(createSponserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return this.sponsersService.findAll(+from || 0, +to || 10);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.sponsersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateSponserDto: UpdateSponserDto) {
    return this.sponsersService.update(id, updateSponserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.sponsersService.remove(id);
  }
}
