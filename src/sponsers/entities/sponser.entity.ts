import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { AcceptanceStatus } from '../types/acceptance-status.enum';
import { Plan } from '../../plans/entities/plan.entity';

@Entity()
export class Sponser {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @OneToOne(() => Plan, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'planId' })
  selectedPlan: string | Plan;

  @Column()
  clientName: string;

  @Column()
  sponseringReason: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  sponsershipPriceIRT: number;

  @Column({
    unique: true,
  })
  sponserEmail: string;

  // Private properties

  @Column({
    type: 'int',
  })
  acceptanceStatus: AcceptanceStatus;
}
