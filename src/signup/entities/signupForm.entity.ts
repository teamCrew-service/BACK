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
export class SignupForm {
  @PrimaryGeneratedColumn()
  signupFormId: number;

  @ManyToOne(() => Crew, (crew) => crew.signupFormId)
  @JoinColumn({ name: 'crewId', referencedColumnName: 'crewId' })
  crew: Crew;

  @Column()
  crewId: number;

  @Column()
  question1: string;

  @Column()
  question2: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Signup, (signup) => signup.signupId)
  signupId: Signup[];
}
