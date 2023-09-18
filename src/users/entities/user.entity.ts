import { Crew } from 'src/crew/entities/crew.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Signup } from 'src/signup/entities/signup.entity';
import { Member } from 'src/member/entities/member.entity';
import { Topic } from '../../topic/entities/topic.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Like } from 'src/like/entities/like.entity';
import { Notice } from 'src/notice/entities/notice.entity';
import { VoteForm } from 'src/voteform/entities/voteform.entity';
import { Vote } from 'src/vote/entities/vote.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  provider: string;

  @Column()
  email: string;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  myMessage: string;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Crew, (crew) => crew.userId)
  crew: Crew[];

  @OneToMany(() => Signup, (signup) => signup.userId)
  signup: Signup[];

  @OneToMany(() => Schedule, (schedule) => schedule.userId)
  schedule: Schedule[];

  @OneToMany(() => Topic, (topic) => topic.userId)
  topic: Topic[];

  @OneToMany(() => Member, (member) => member.userId)
  member: Member[];

  @OneToMany(() => Like, (like) => like.userId)
  like: Like[];

  @OneToMany(() => Notice, (notice) => notice.userId)
  notice: Notice[];

  @OneToMany(() => VoteForm, (voteForm) => voteForm.userId)
  voteForm: VoteForm[];

  @OneToMany(() => Vote, (vote) => vote.userId)
  vote: Vote[];
}
