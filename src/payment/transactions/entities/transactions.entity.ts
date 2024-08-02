import { OfferCode } from 'src/product/offer-codes/entities/offer-code.entity';
import ValidationStage from '../types/validation-stage.enum';

import { Auth } from 'src/users/auth/@shared/entities/auth.entity';

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

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
  @ManyToOne(() => Auth, (u) => u.id, { cascade: true, nullable: false })
  user: Auth | string;

  @CreateDateColumn({
    type: 'datetime',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  lastUpdateDate: Date;
}
