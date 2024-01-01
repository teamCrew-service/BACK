import { Crew } from '@src/crew/entities/crew.entity';
import { Users } from '@src/users/entities/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  memberId: number;

  @ManyToOne(() => Crew, (crew) => crew.member)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @ManyToOne(() => Users, (user) => user.member)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
