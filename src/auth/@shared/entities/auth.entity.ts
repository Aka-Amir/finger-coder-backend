import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
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

  @Column({
    nullable: true,
  })
  googleId?: string;

  @Column({
    nullable: true,
  })
  githubId?: string;

  @CreateDateColumn()
  joinedAt: Date;
}
