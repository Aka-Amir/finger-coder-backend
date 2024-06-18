import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryColumn()
  @Generated('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  email?: string;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @CreateDateColumn()
  joinedAt: Date;
}
