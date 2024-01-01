import { Users } from '@src/users/entities/user.entity';
import { Schedule } from '@src/schedule/entities/schedule.entity';
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
import { Signupform } from '@src/signup/entities/signupForm.entity';
import { Signup } from '@src/signup/entities/signup.entity';
import { Member } from '@src/member/entities/member.entity';
import { Like } from '@src/like/entities/like.entity';
import { Notice } from '@src/notice/entities/notice.entity';
import { VoteForm } from '@src/voteform/entities/voteform.entity';
import { Vote } from '@src/vote/entities/vote.entity';
import { Participant } from '@src/participant/entities/participant.entity';
import { Image } from '@src/image/entities/image.entity';
import { Report } from '@src/report/entities/report.entity';
import { Leavecrew } from '@src/leavecrew/entities/leavecrew.entity';
import { Alarm } from '@src/alarm/entities/alarm.entity';

@Entity('crew')
export class Crew {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  crewId: number;

  @ManyToOne(() => Users, (user) => user.crew)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'varchar' })
  category: string;

  @Column({ type: 'varchar' })
  crewAddress: string;

  @Column({ type: 'varchar', nullable: true })
  crewPlaceName: string;

  @Column({ type: 'varchar' })
  crewType: string;

  @Column({ type: 'datetime', nullable: true })
  crewDDay: Date;

  @Column({ type: 'varchar' })
  crewMemberInfo: string;

  @Column({ type: 'varchar' })
  crewTimeInfo: string;

  @Column({ type: 'varchar' })
  crewAgeInfo: string;

  @Column({ type: 'boolean' })
  crewSignup: boolean;

  @Column({ type: 'varchar' })
  crewTitle: string;

  @Column({ type: 'mediumtext' })
  crewContent: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ type: 'bigint' })
  crewMaxMember: number;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longtitude: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Member, (member) => member.crewId)
  member: Member[];

  @OneToMany(() => Schedule, (schedule) => schedule.crewId)
  schedule: Schedule[];

  @OneToMany(() => Signupform, (signupForm) => signupForm.crewId)
  signupForm: Signupform[];

  @OneToMany(() => Signup, (signup) => signup.crewId)
  signup: Signupform[];

  @OneToMany(() => Like, (like) => like.crewId)
  like: Like[];

  @OneToMany(() => Notice, (notice) => notice.crewId)
  notice: Notice[];

  @OneToMany(() => VoteForm, (voteForm) => voteForm.crewId)
  voteForm: VoteForm[];

  @OneToMany(() => Vote, (vote) => vote.crewId)
  vote: Vote[];

  @OneToMany(() => Participant, (participant) => participant.crewId)
  participant: Participant[];

  @OneToMany(() => Image, (image) => image.crewId)
  image: Image[];

  @OneToMany(() => Report, (report) => report.crewId)
  report: Report[];

  @OneToMany(() => Leavecrew, (leavecrew) => leavecrew.crewId)
  leavecrew: Leavecrew[];

  @OneToMany(() => Alarm, (alarm) => alarm.crewId)
  alarm: Alarm[];
}
