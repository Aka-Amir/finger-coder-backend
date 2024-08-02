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
import { AccessGuard } from 'src/core/guards/access.guard';
import { Access } from 'src/core/decorators/access.decorator';
import { TokenType } from 'src/core/types/enums/token-types.enum';
import { TokenData } from 'src/core/decorators/token.decorator';

@Controller('offer-codes')
@UseGuards(AccessGuard)
export class OfferCodesController {
  constructor(private readonly offerCodesService: OfferCodesService) {}

  @Post()
  @Access(TokenType.access)
  create(@Body() createOfferCodeDto: CreateOfferCodeDto) {
    if (!createOfferCodeDto.eventId && !createOfferCodeDto.userId)
      throw new BadRequestException('eventId or userId must be provided');

    return this.offerCodesService.create(createOfferCodeDto);
  }

  @Get()
  @Access(TokenType.access)
  findAll() {
    return this.offerCodesService.findAll();
  }

  @Get(':id')
  @Access(TokenType.access)
  findOne(@Param('id') id: string) {
    return this.offerCodesService.findOne(id);
  }

  @Get(':id/validate/:eventId')
  @Access(TokenType.commonUser)
  validateEvent(
    @Param('id') offerCode: string,
    @Param('eventId') eventId: string,
    @TokenData('id') userId: string,
  ) {
    if (Number.isNaN(+eventId)) {
      throw new BadRequestException('Invalid eventId');
    }
    return this.offerCodesService.validateOfferCode(
      offerCode,
      userId,
      +eventId,
    );
  }

  @Delete(':id')
  @Access(TokenType.access)
  remove(@Param('id') id: string) {
    return this.offerCodesService.remove(id).then((response) => ({
      affected: response.affected,
    }));
  }
}
