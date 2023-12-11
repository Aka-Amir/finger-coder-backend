import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    nullable: true,
    transformer: {
      from: (value: string) => value?.split(',') || null,
      to: (value: string[]) => value?.toString() || null,
    },
    type: 'text',
  })
  metaTags: string[];

  @Column('datetime')
  startDate: Date;

  @Column()
  price: number;

  @Column({
    default: 0,
  })
  discount: number;

  @Column({
    default: 30,
  })
  limit: number;
}
