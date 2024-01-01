import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '@src/users/entities/user.entity';

@Entity('topic')
export class Topic {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  topicId: number;

  @ManyToOne(() => Users, (user) => user.topic)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'varchar' })
  interestTopic: string;
}
