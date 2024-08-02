import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @Access(TokenType.access)
  create(@Body() createTicketDto: CreateTicketDto) {
    if (!!createTicketDto) {
      createTicketDto.disableAt = new Date(createTicketDto.disableAt);
      if (createTicketDto.disableAt.getTime() < Date.now()) {
        createTicketDto.disableAt = null;
      }
    }
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @Access(TokenType.commonUser, TokenType.access)
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(':id')
  @Access(TokenType.commonUser, TokenType.access)
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Put(':id')
  @Access(TokenType.access)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(':id')
  @Access(TokenType.access)
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
