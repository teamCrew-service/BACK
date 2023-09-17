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

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleId: number;

  @ManyToOne(() => Users, (user) => user.schedule)
  @JoinColumn({ name: 'userId' })
  // user: Users;
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.schedule)
  @JoinColumn({ name: 'crewId' })
  // crew: Crew;
  crewId: number;

  @Column()
  scheduleTitle: string;

  @Column()
  scheduleContent: string;

  @Column()
  scheduleDDay: Date;

  @Column()
  scheduleAddress: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
  user: any;
}
