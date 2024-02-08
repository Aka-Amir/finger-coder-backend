import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SponsersService } from './sponsers.service';
import { CreateSponserDto } from './dto/create-sponser.dto';
import { UpdateSponserDto } from './dto/update-sponser.dto';

@Controller('sponsers')
export class SponsersController {
  constructor(private readonly sponsersService: SponsersService) {}

  @Post()
  create(@Body() createSponserDto: CreateSponserDto) {
    return this.sponsersService.create(createSponserDto);
  }

  @Get()
  findAll() {
    return this.sponsersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sponsersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSponserDto: UpdateSponserDto) {
    return this.sponsersService.update(+id, updateSponserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sponsersService.remove(+id);
  }
}
