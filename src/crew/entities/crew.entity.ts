import { Users } from 'src/users/entities/user.entity';
import { Notice } from 'src/notice/entities/notice.entity';
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
import { SignupForm } from 'src/signup/entities/signupForm.entity';

@Entity('crew')
export class Crew {
  @PrimaryGeneratedColumn()
  crewId: number;

  @ManyToOne(() => Users, (user) => user.crew)
  @JoinColumn({ name: 'userId', referencedColumnName: 'userId' })
  user: Users;

  @OneToMany(() => Notice, (notice) => notice.crew)
  notice: Notice[];

  @OneToMany(() => SignupForm, (signupForm) => signupForm.crew)
  signupForm: SignupForm[];

  @Column()
  userId: number;

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
