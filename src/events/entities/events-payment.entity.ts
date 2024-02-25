import { Transactions } from 'src/transactions/entities/transactions.entity';
import { User } from 'src/users/entities/user.entity';
import { Event } from './event.entity';

import { Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EventsPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, {
    cascade: true,
  })
  user: User | number;

  @OneToOne(() => Event, {
    cascade: true,
  })
  event: Event;

  @OneToOne(() => User, {
    cascade: true,
  })
  transaction: Transactions | string;
}
