import { Users } from 'src/users/entities/user.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
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
import { Signupform } from 'src/signup/entities/signupForm.entity';
import { Signup } from 'src/signup/entities/signup.entity';
import { Member } from 'src/member/entities/member.entity';
import { Like } from 'src/like/entities/like.entity';

@Entity('crew')
export class Crew {
  @PrimaryGeneratedColumn()
  crewId: number;

  @ManyToOne(() => Users, (user) => user.crew)
  @JoinColumn({ name: 'userId' })
  userId: number;

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

  @Column()
  category: string;

  @Column()
  crewAddress: string;

  @Column()
  crewType: string;

  @Column()
  crewDDay: Date;

  @Column()
  crewMemberInfo: string;

  @Column()
  crewTimeInfo: string;

  @Column()
  crewAgeInfo: string;

  @Column()
  crewSignup: boolean;

  @Column()
  crewTitle: string;

  @Column()
  crewContent: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  crewMaxMember: number;

  @Column()
  latitude: number;

  @Column()
  longtitude: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
