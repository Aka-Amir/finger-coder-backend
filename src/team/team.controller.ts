import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { AccessGuard } from 'src/core/guards/access.guard';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('team')
@Access(TokenType.access)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(AccessGuard)
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AccessGuard)
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(+id, updateTeamDto);
  }

  @Delete(':id')
  @UseGuards(AccessGuard)
  remove(@Param('id') id: string) {
    return this.teamService.remove(+id);
  }
}
