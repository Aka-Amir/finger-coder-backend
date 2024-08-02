import { Transactions } from 'src/transactions/entities/transactions.entity';
import { Event } from './event.entity';

import { Auth } from 'src/users/auth/@shared/entities/auth.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @JoinColumn({ name: 'transaction' })
  @ManyToOne(() => Transactions, (item) => item.id, {
    cascade: true,
  })
  transaction: Transactions | string;
}
