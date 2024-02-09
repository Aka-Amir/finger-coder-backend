import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan {
  @PrimaryColumn()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  planName: string;

  @Column({
    type: 'bigint',
  })
  priceIRT: number;

  @Column()
  planDescription: string;

  @Column({
    nullable: true,
  })
  planLogo: string;
}
