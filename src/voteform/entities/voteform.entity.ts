import { Crew } from 'src/crew/entities/crew.entity';
import { Users } from 'src/users/entities/user.entity';
import { Vote } from 'src/vote/entities/vote.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('voteform')
export class VoteForm {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  voteFormId: number;

  @ManyToOne(() => Users, (user) => user.voteForm)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.voteForm)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column({ type: 'varchar' })
  voteFormTitle: string;

  @Column({ type: 'varchar' })
  voteFormContent: string;

  @Column({ type: 'boolean' })
  multipleVotes: Boolean;

  @Column({ type: 'boolean' })
  anonymousVote: Boolean;

  @Column({ type: 'datetime' })
  voteFormEndDate: Date;

  @Column({ type: 'boolean', default: false })
  voteFormIsDone: Boolean;

  @Column({ type: 'varchar', nullable: true })
  voteFormOption1: string;

  @Column({ type: 'varchar', nullable: true })
  voteFormOption2: string;

  @Column({ type: 'varchar', nullable: true })
  voteFormOption3: string;

  @Column({ type: 'varchar', nullable: true })
  voteFormOption4: string;

  @Column({ type: 'varchar', nullable: true })
  voteFormOption5: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Vote, (vote) => vote.voteFormId)
  vote: Vote[];
}
