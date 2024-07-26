import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OAuthID } from './oauth-id.entity';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  email?: string;

  @Column({
    unique: true,
  })
  phoneNumber: string;

  @JoinColumn()
  @OneToMany(() => OAuthID, (item) => item.auth)
  oauths: OAuthID[];

  @CreateDateColumn()
  joinedAt: Date;
}
