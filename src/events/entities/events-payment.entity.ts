import { Transactions } from 'src/transactions/entities/transactions.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from './event.entity';

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventsPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({ name: 'user' })
  @ManyToOne(() => User, (item) => item.id, {
    cascade: true,
  })
  user: User | number;

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
