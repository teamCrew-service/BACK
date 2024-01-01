import { Crew } from '@src/crew/entities/crew.entity';
import { Users } from '@src/users/entities/user.entity';
import { VoteForm } from '@src/voteform/entities/voteform.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('vote')
export class Vote {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  voteId: number;

  @ManyToOne(() => Users, (user) => user.vote)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.vote)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @ManyToOne(() => VoteForm, (voteForm) => voteForm.vote)
  @JoinColumn({ name: 'voteFormId' })
  voteFormId: number;

  @Column({ type: 'varchar' })
  vote: string;
}
