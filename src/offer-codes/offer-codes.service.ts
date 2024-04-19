import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOfferCodeDto } from './dto/create-offer-code.dto';
import { OfferCode } from './entities/offer-code.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Event } from 'src/events/entities/event.entity';

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
    firstName: true,
    lastName: true,
    id: true,
    phoneNumber: true,
    nickname: true,
  };

  async validateOfferCode(offerCode: string, userId: number, eventId: number) {
    const offer = await this.findOne(offerCode);
    if (
      (offer.user && (offer.user as User).id === userId) ||
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
