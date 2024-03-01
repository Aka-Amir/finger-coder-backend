import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class OfferCode {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'user' })
  user: User | number | null;

  @ManyToOne(() => Event, (e) => e.id, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'event' })
  event: Event | number | null;

  @Column()
  amount: number;
}
