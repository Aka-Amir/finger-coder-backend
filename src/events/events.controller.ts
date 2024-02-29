import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/core/auth';
import { TokenData } from 'src/core/decorators/token.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { AccessGuard } from 'src/core/guards/access.guard';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Access(TokenType.access)
  @UseGuards(AuthGuard, AccessGuard)
  create(@Body() createEventDto: CreateEventDto) {
    if (createEventDto.startDate <= Date.now()) {
      throw new BadRequestException('Invalid date');
    }

    return this.eventsService.create(createEventDto);
  }

  @Get('pay/:id')
  @Access(TokenType.access, TokenType.commonUser)
  @UseGuards(AuthGuard, AccessGuard)
  async pay(@Param('id') id: string, @TokenData('id') userId: string) {
    try {
      // TODO: Add transaction hash
      return this.eventsService.pay(+id, +userId, `events/${id}/confirm`);
    } catch (e) {
      console.log(e);
    }
  }

  @Get()
  findAll(@Query('from') from: string, @Query('to') to: string) {
    if (Number.isNaN(+from) || Number.isNaN(+to)) {
      throw new BadRequestException('Invalid range');
    }
    return this.eventsService.findAll(+from, +to);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Get(':id/payments')
  @Access(TokenType.access)
  @UseGuards(AuthGuard, AccessGuard)
  findPayments(@Param('id') id: string) {
    return this.eventsService.getAllPayments(+id);
  }

  // @Post('confirm')
  // confirmPayment(@Body() body: CallBackResponseDTO) {
  // console.log('IM HERE');
  // return { message: true }; //this.eventsService.confirmPayment(body);
  // }

  @Get(':id/confirm')
  confirmPaymentGet(
    @Query('success') success: '0' | '1',
    @Query('trackId') trackId: string,
    @Query('orderId') orderId: string,
  ) {
    try {
      return this.eventsService.confirmPayment({
        success,
        trackId: +trackId,
        orderId,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // @Patch(':id')
  @Put(':id')
  @Access(TokenType.access)
  @UseGuards(AuthGuard, AccessGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @Access(TokenType.access)
  @UseGuards(AuthGuard, AccessGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
