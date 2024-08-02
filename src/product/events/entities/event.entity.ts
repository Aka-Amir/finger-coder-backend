import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  heading: string;

  @Column()
  place: string;

  @Column()
  lecturer: string;

  @Column()
  posterPath: string;

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
}
