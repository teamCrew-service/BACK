import { Crew } from 'src/crew/entities/crew.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('alarm')
export class Alarm {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  alarmId: number;

  @ManyToOne(() => Users, (user) => user.alarm)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.alarm)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column({ type: 'varchar' })
  alarmMessage: string;

  @Column({ type: 'boolean', default: false })
  alarmCheck: boolean;
}
