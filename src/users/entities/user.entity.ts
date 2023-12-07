import { Genders } from '../../core/types/enums/gender.enum';
import { HowWeMet } from '../../core/types/enums/how-we-met.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Generated('uuid')
  @Column({
    unique: true,
  })
  nickname: string;

  @Column({
    nullable: true,
  })
  about?: string;

  @Column({
    type: 'enum',
    enum: Genders,
    default: Genders.Female,
  })
  gender: Genders;

  @Column({
    type: 'enum',
    enum: HowWeMet,
    default: HowWeMet.Others,
  })
  howWeMet: HowWeMet;

  @Column({
    nullable: true,
  })
  email?: string;

  @CreateDateColumn()
  joinedAt: Date;
}
