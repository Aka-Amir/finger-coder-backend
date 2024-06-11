import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { Response } from 'express';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenData } from 'src/core/decorators/token.decorator';
import { AccessGuard } from 'src/core/guards/access.guard';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsService } from './events.service';
import { Public } from 'src/core/decorators/public.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Access(TokenType.access)
  @UseGuards(AccessGuard)
  create(@Body() createEventDto: CreateEventDto) {
    if (createEventDto.startDate <= Date.now()) {
      throw new BadRequestException('Invalid date');
    }

    return this.eventsService.create(createEventDto);
  }

  @Get('active')
  @Public()
  getActiveEvents() {
    return this.eventsService.getActiveEvents();
  }

  @Get('pay/:id')
  @Access(TokenType.access, TokenType.commonUser)
  @UseGuards(AccessGuard)
  async pay(
    @Param('id') id: string,
    @TokenData('id') userId: string,
    @Query('offer') offer?: string,
  ) {
    try {
      const transactionHash = createHash('md5')
        .update(process.env.SECRET_KEY + id.toString())
        .digest('hex');
      return this.eventsService.pay(
        +id,
        +userId,
        offer,
        `events/${id}/${transactionHash}/confirm`,
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Get()
  @Public()
  async findAll(@Query('from') from: string, @Query('to') to: string) {
    if (Number.isNaN(+from) || Number.isNaN(+to)) {
      throw new BadRequestException('Invalid range');
    }
    const [events, count] = await this.eventsService.findAll(+from, +to);
    return {
      data: events,
      count,
    };
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Get(':id/payments')
  @Access(TokenType.access)
  @UseGuards(AccessGuard)
  findPayments(@Param('id') id: string) {
    return this.eventsService.getAllPayments(+id);
  }

  @Get(':id/resgistration')
  @Access(TokenType.commonUser)
  @UseGuards(AccessGuard)
  getRegistration(@Param('id') id: string, @TokenData('id') userId: string) {
    if (Number.isNaN(+id)) throw new BadRequestException();
    return this.eventsService.registeration(+userId, +id);
  }

  // @Post('confirm')
  // confirmPayment(@Body() body: CallBackResponseDTO) {
  // console.log('IM HERE');
  // return { message: true }; //this.eventsService.confirmPayment(body);
  // }

  @Get(':id/:hash/confirm')
  @Public()
  async confirmPaymentGet(
    @Param('id') eventId: string,
    @Param('hash') hash: string,
    @Query('success') success: '0' | '1',
    @Query('trackId') trackId: string,
    @Query('orderId') orderId: string,
    @Res() resolver: Response,
  ) {
    try {
      const transactionHash = createHash('md5')
        .update(process.env.SECRET_KEY + eventId)
        .digest('hex');
      if (transactionHash !== hash) throw new ForbiddenException();
      await this.eventsService.confirmPayment({
        success,
        trackId: +trackId,
        orderId,
      });

      resolver.redirect(
        (success === '1'
          ? process.env.SUCCESS_CALLBACK
          : process.env.ERROR_CALLBACK) +
          `?status=${success}&trackId=${trackId}`,
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // @Patch(':id')
  @Put(':id')
  @Access(TokenType.access)
  @UseGuards(AccessGuard)
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @Access(TokenType.access)
  @UseGuards(AccessGuard)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
