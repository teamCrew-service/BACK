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
  @PrimaryGeneratedColumn()
  voteFormId: number;

  @ManyToOne(() => Users, (user) => user.voteForm)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.voteForm)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column()
  voteTitle: string;

  @Column()
  voteContent: string;

  @Column()
  voteEndDate: Date;

  @Column({ nullable: true })
  voteOption1: string;

  @Column({ nullable: true })
  voteOption2: string;

  @Column({ nullable: true })
  voteOption3: string;

  @Column({ nullable: true })
  voteOption4: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Vote, (vote) => vote.voteFormId)
  vote: Vote[];
}
