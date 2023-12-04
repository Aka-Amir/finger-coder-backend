import { Column, Entity, Generated, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @Generated('uuid')
  @PrimaryColumn({
    select: false,
  })
  id: string;

  @Column({
    default: false,
    select: false,
  })
  superAdmin: boolean;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;
}
