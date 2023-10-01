import { Crew } from 'src/crew/entities/crew.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  reportId: number;

  @ManyToOne(() => Users, (user) => user.report)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.report)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column({ type: 'varchar' })
  reportContent: string;
}
