import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  title: string;

  @Column({
    nullable: false,
  })
  priceIRT: number;

  @Column({
    default: 0,
  })
  discount: number;

  @Column({
    nullable: false,
  })
  amount: number;

  @Column({
    nullable: true,
  })
  description?: string;

  @Column('datetime', {
    nullable: true,
    default: null,
  })
  disableAt?: Date;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDisabled: boolean;
}
