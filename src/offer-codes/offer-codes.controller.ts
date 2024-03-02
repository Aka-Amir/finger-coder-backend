import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOfferCodeDto } from './dto/create-offer-code.dto';
import { OfferCodesService } from './offer-codes.service';
import { AuthGuard } from 'src/core/auth';
import { AccessGuard } from 'src/core/guards/access.guard';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';

@Controller('offer-codes')
@Access(TokenType.access)
@UseGuards(AuthGuard, AccessGuard)
export class OfferCodesController {
  constructor(private readonly offerCodesService: OfferCodesService) {}

  @Post()
  create(@Body() createOfferCodeDto: CreateOfferCodeDto) {
    if (!createOfferCodeDto.eventId && !createOfferCodeDto.userId)
      throw new BadRequestException('eventId or userId must be provided');

    return this.offerCodesService.create(createOfferCodeDto);
  }

  @Get()
  findAll() {
    return this.offerCodesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offerCodesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.offerCodesService.remove(id).then((response) => ({
      affected: response.affected,
    }));
  }
}
