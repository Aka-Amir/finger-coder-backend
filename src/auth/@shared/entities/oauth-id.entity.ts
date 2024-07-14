import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OAuthProviders } from '../types/oauth-providers';
import { Auth } from './auth.entity';

@Entity()
export class OAuthID {
  @PrimaryGeneratedColumn()
  rowID: number;

  @Column({
    nullable: false,
  })
  id: string;

  @Column({})
  authId: string;

  @OneToOne(() => Auth, {
    cascade: true,
    eager: true,
  })
  @JoinColumn({ name: 'authId' })
  auth: Auth;

  @Column({
    enum: OAuthProviders,
  })
  provider: OAuthProviders;
}
