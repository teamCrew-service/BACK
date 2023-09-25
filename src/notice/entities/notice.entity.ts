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
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  noticeId: number;

  @ManyToOne(() => Users, (user) => user.notice)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.notice)
  @JoinColumn({ name: 'crweId' })
  crewId: number;

  @Column({ type: 'varchar' })
  noticeTitle: string;

  @Column({ type: 'mediumtext' })
  noticeContent: string;

  @Column({ type: 'varchar' })
  noticeAddress: string;

  @Column({ type: 'date' })
  noticeDDay: Date;

  @Column({ type: 'boolean', default: false })
  noticeIsDone: Boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
