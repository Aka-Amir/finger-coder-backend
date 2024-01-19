import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  Query,
  UseGuards,
  Put,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { UpdateEventDto } from './dto/update-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from 'src/core/auth';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createEventDto: CreateEventDto) {
    if (createEventDto.startDate <= Date.now()) {
      throw new BadRequestException('Invalid date');
    }

    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(@Query('from') from: string, @Query('to') to: string) {
    try {
      if (Number.isNaN(+from) || Number.isNaN(+to)) {
        throw new BadRequestException('Invalid range');
      }
      return this.eventsService.findAll(+from, +to);
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    Logger.log('Got event');
    return this.eventsService.findOne(+id);
  }

  // @Patch(':id')
  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
