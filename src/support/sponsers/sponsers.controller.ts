import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Public } from 'src/core/decorators/public.decorator';
import { CreateSponserDto } from './dto/create-sponser.dto';
import { UpdateSponserDto } from './dto/update-sponser.dto';
import { SponsersService } from './sponsers.service';

@Controller('sponsers')
export class SponsersController {
  constructor(private readonly sponsersService: SponsersService) {}

  @Post()
  @Public()
  create(@Body() createSponserDto: CreateSponserDto) {
    if (
      (createSponserDto.sponsershipPriceIRT || 0) < 1_000_000 &&
      !createSponserDto.selectedPlan
    )
      throw new BadRequestException('no plan selected');

    return this.sponsersService.create(createSponserDto);
  }

  @Get()
  findAll(@Query('from') from?: string, @Query('to') to?: string) {
    return this.sponsersService.findAll(+from || 0, +to || 10);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sponsersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSponserDto: UpdateSponserDto) {
    return this.sponsersService.update(id, updateSponserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sponsersService.remove(id);
  }
}
