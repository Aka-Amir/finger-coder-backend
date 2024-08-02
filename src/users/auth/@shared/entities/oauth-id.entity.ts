import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OAuthProviders } from '../types/oauth-providers';
import { Auth } from './auth.entity';

@Entity()
export class OAuthID {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  providerId: string;

  @JoinColumn()
  @ManyToOne(() => Auth, (item) => item.id, { cascade: true, nullable: false })
  auth: Auth | string;

  @Column({
    nullable: false,
  })
  provider: OAuthProviders;
}
