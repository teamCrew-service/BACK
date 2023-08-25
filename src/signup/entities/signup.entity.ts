import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Signup {
  @PrimaryGeneratedColumn()
  signupId: number;

  @Column()
  signupFormId: number;

  @Column()
  crewId: number;

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
