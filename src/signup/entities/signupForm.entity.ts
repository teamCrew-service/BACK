import { Crew } from 'src/crew/entities/crew.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Signup } from './signup.entity';

@Entity()
export class Signupform {
  @PrimaryGeneratedColumn()
  signupFormId: number;

  @ManyToOne(() => Crew, (crew) => crew.signupForm)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @Column({ nullable: false })
  question1: string;

  @Column({ nullable: false })
  question2: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Signup, (signup) => signup.signupFormId)
  signup: Signup[];
}
