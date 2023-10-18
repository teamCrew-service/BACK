import { Crew } from 'src/crew/entities/crew.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('leavecrew')
export class Leavecrew {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  levaecrewId: number;

  @ManyToOne(() => Users, (user) => user.leavecrew)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.leavecrew)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column({ type: 'datetime' })
  leaveDay: Date;
}
