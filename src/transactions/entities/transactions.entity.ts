import { User } from 'src/users/entities/user.entity';
import ValidationStage from '../types/validation-stage.enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OfferCode } from 'src/offer-codes/entities/offer-code.entity';

@Entity()
export class Transactions {
  /**
   * @description id is trackId
   */
  @PrimaryColumn()
  id: string; // trackId

  @Column({
    nullable: true,
    type: 'text',
    transformer: {
      from: (value: string | undefined | null) =>
        !value ? null : JSON.parse(value),
      to: (value: Record<string, any>) =>
        !value ? null : JSON.stringify(value),
    },
  })
  metaData: Record<string | number, any> | null;

  @JoinColumn({ name: 'offerCode' })
  @ManyToOne(() => OfferCode, (u) => u.id, { cascade: true, nullable: true })
  offerCode: string | OfferCode;

  @Column({
    type: 'enum',
    enum: ValidationStage,
    default: ValidationStage.IN_PROGRESS,
  })
  validationStage: ValidationStage;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (u) => u.id, { cascade: true, nullable: false })
  user: User | number;

  @CreateDateColumn({
    type: 'datetime',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  lastUpdateDate: Date;
}
