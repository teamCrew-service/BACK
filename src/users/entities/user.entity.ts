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
import { Participant } from 'src/participant/entities/participant.entity';
import { Image } from 'src/image/entities/image.entity';
import { Report } from 'src/report/entities/report.entity';
import { Unsubscribe } from 'src/unsubscribe/entities/unsubscribe.entity';
import { Leavecrew } from 'src/leavecrew/entities/leavecrew.entity';
import { Alarm } from 'src/alarm/entities/alarm.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  userId: number;

  @Column({ type: 'varchar' })
  provider: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  profileImage: string;

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({ type: 'varchar', nullable: true })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  myMessage: string;

  @Column({ type: 'varchar', nullable: true })
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

  @OneToMany(() => Participant, (participant) => participant.userId)
  participant: Participant[];

  @OneToMany(() => Image, (image) => image.userId)
  image: Image[];

  @OneToMany(() => Report, (report) => report.userId)
  report: Report[];

  @OneToMany(() => Unsubscribe, (unsubscribe) => unsubscribe.userId)
  unsubscribe: Unsubscribe[];

  @OneToMany(() => Leavecrew, (leavecrew) => leavecrew.userId)
  leavecrew: Leavecrew[];

  @OneToMany(() => Alarm, (alarm) => alarm.userId)
  alarm: Alarm[];
}
