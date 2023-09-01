import { Crew } from 'src/crew/entities/crew.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notice')
export class Notice {
  @PrimaryGeneratedColumn()
  noticeId: number;

  @ManyToOne(() => Users, (user) => user.notice)
  @JoinColumn({ name: 'userId' })
  // user: Users;
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.notice)
  @JoinColumn({ name: 'crewId' })
  // crew: Crew;
  crewId: number;

  @Column()
  noticeTitle: string;

  @Column()
  noticeContent: string;

  @Column()
  noticeDDay: Date;

  @Column()
  noticeAddress: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
  user: any;
}
