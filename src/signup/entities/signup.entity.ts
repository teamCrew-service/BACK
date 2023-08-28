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
import { SignupForm } from './signupForm.entity';

@Entity()
export class Signup {
  @PrimaryGeneratedColumn()
  signupId: number;

  @Column()
  signupFormId: number;

  @Column()
  crewId: number;

  @ManyToOne(() => Users, (user) => user.signup)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: Users;

  @ManyToOne(() => SignupForm, (signupForm) => signupForm.signup)
  @JoinColumn({ name: 'signupFormId', referencedColumnName: 'signupFormId' })
  signupForm: SignupForm;

  @Column()
  userId: number;

  @Column()
  answer1: string;

  @Column()
  answer2: string;

  @Column({ nullable: true })
  permission: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
