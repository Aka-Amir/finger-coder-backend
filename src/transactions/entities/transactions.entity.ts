import { User } from 'src/users/entities/user.entity';
import ValidationStage from '../types/validation-stage.enum';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
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

  @Column({
    type: 'enum',
    enum: ValidationStage,
    default: ValidationStage.IN_PROGRESS,
  })
  validationStage: ValidationStage;

  @OneToOne(() => User, { cascade: true })
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
