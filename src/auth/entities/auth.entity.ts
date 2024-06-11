import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

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
