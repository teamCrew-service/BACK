import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Signupform } from './signupForm.entity';
import { Crew } from 'src/crew/entities/crew.entity';

@Entity()
export class Signup {
  @PrimaryGeneratedColumn()
  signupId: number;

  @ManyToOne(() => Users, (user) => user.signup)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Signupform, (signupForm) => signupForm.signup)
  @JoinColumn({ name: 'signupFormId' })
  signupFormId: number;

  @ManyToOne(() => Crew, (crew) => crew.signup)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column({ nullable: false })
  answer1: string;

  @Column({ nullable: false })
  answer2: string;

  @Column({ nullable: true })
  permission: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
