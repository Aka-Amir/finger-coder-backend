import { Transactions } from 'src/payment/transactions/entities/transactions.entity';
import { Event } from './event.entity';

import { Auth } from 'src/users/auth/@shared/entities/auth.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OfferCode } from 'src/product/offer-codes/entities/offer-code.entity';
import { Ticket } from 'src/product/tickets/entities/ticket.entity';

@Entity()
export class EventsPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'user' })
  @ManyToOne(() => Auth, (item) => item.id, {
    cascade: true,
  })
  user: Auth | string;

  @JoinColumn({ name: 'event' })
  @ManyToOne(() => Event, (item) => item.id, {
    cascade: true,
  })
  event: Event | number;

  @JoinColumn({ name: 'ticket' })
  @ManyToOne(() => Ticket, (item) => item.id, {
    cascade: true,
  })
  ticket: Ticket | number;

  @JoinColumn({ name: 'offerCode' })
  @ManyToOne(() => OfferCode, (item) => item.id, {
    cascade: true,
    nullable: true,
  })
  offerCode: OfferCode | string;

  @JoinColumn({ name: 'transaction' })
  @ManyToOne(() => Transactions, (item) => item.id, {
    cascade: true,
  })
  transaction: Transactions | string;
}
