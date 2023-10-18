import { Crew } from 'src/crew/entities/crew.entity';
import { Participant } from 'src/participant/entities/participant.entity';
import { Users } from 'src/users/entities/user.entity';
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

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  scheduleId: number;

  @ManyToOne(() => Users, (user) => user.schedule)
  @JoinColumn({ name: 'userId' })
  // user: Users;
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.schedule)
  @JoinColumn({ name: 'crewId' })
  // crew: Crew;
  crewId: number;

  @Column({ type: 'varchar' })
  scheduleTitle: string;

  @Column({ type: 'mediumtext' })
  scheduleContent: string;

  @Column({ type: 'date' })
  scheduleDDay: Date;

  @Column({ type: 'varchar' })
  scheduleAddress: string;

  @Column({ type: 'varchar', nullable: true })
  schedulePlaceName: string;

  @Column({ type: 'double' })
  scheduleLatitude: number;

  @Column({ type: 'double' })
  scheduleLongitude: number;

  @Column({ type: 'boolean', default: false })
  scheduleIsDone: Boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;

  @OneToMany(() => Participant, (participant) => participant.scheduleId)
  participant: Participant[];
}
