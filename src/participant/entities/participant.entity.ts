import { Crew } from 'src/crew/entities/crew.entity';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Users } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('participant')
export class Participant {
  @PrimaryGeneratedColumn()
  participantId: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.participant)
  @JoinColumn({ name: 'scheduleId' })
  scheduleId: number;

  @ManyToOne(() => Users, (user) => user.participant)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.participant)
  @JoinColumn({ name: 'crewId' })
  crewId: number;
}
