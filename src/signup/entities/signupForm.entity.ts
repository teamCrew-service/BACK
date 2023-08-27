import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SignupForm {
  @PrimaryGeneratedColumn()
  signupFormId: number;

  @Column()
  crewId: number;

  @Column()
  question1: string;

  @Column()
  question2: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
