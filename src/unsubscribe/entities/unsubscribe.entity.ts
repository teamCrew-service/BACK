import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('unsubscribe')
export class Unsubscribe {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  unsubscribeId: number;

  @ManyToOne(() => Users, (user) => user.unsubscribe)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'date' })
  toBeDeletedDay: Date;
}
