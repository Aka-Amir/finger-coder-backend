import { Auth } from 'src/users/auth/@shared/entities/auth.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @ManyToOne(() => Auth, (item) => item.id, { cascade: true, nullable: false })
  auth: Auth | string;
}
