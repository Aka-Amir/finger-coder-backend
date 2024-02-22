import ValidationStage from '../types/validation-stage.enum';

import {
  Entity,
  Column,
  Generated,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    nullable: true,
    type: 'text',
    transformer: {
      from: (value: string | undefined | null) =>
        !value ? null : JSON.parse(value),
      to: (value: Record<string, unknown>) =>
        !value ? null : JSON.stringify(value),
    },
  })
  metaData: Record<string, unknown> | null;

  @Column({
    type: 'enum',
    enum: ValidationStage,
    default: ValidationStage.IN_PROGRESS,
  })
  validationStage: ValidationStage;

  @Column({
    type: 'number',
  })
  trackId: number;

  @CreateDateColumn({
    type: 'datetime',
  })
  createDate: Date;

  @UpdateDateColumn({
    type: 'datetime',
  })
  lastUpdateDate: Date;
}
