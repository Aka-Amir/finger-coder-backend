import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/users/auth/@shared/entities/auth.entity';
import { Event } from '../events/entities/event.entity';
import { Repository } from 'typeorm';
import { CreateOfferCodeDto } from './dto/create-offer-code.dto';
import { OfferCode } from './entities/offer-code.entity';

@Injectable()
export class OfferCodesService {
  constructor(
    @InjectRepository(OfferCode)
    private readonly repo: Repository<OfferCode>,
  ) {}

  private readonly eventsRelation = {
    id: true,
    title: true,
    posterPath: true,
  };

  private readonly usersRelation = {
    id: true,
    phoneNumber: true,
  };

  async validateOfferCode(offerCode: string, userId: string, eventId: number) {
    const offer = await this.findOne(offerCode);
    if (
      (offer.user && (offer.user as Auth).id === userId) ||
      (offer.event && (offer.event as Event).id === eventId)
    ) {
      return {
        offerAmount: offer.amount,
      };
    }
    throw new ForbiddenException('INVALID_OFFER_CODE');
  }

  async create(createOfferCodeDto: CreateOfferCodeDto) {
    await this.repo.insert({
      id: createOfferCodeDto.code,
      amount: createOfferCodeDto.amount,
      user: createOfferCodeDto.userId,
      event: createOfferCodeDto.eventId,
    });

    return {
      message: 'inserted',
      code: createOfferCodeDto.code,
    };
  }

  findAll() {
    return this.repo.find({
      select: {
        id: true,
        amount: true,
        event: this.eventsRelation,
        user: this.usersRelation,
      },
      relations: {
        event: true,
        user: true,
      },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: {
        id,
      },
      select: {
        event: this.eventsRelation,
        user: this.usersRelation,
        amount: true,
        id: true,
      },
      relations: {
        event: true,
        user: true,
      },
    });
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
