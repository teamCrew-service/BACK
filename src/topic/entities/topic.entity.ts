import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from '../../users/entities/user.entity';

@Entity('topic')
export class Topic {
  @PrimaryGeneratedColumn()
  topicId: number;

  @ManyToOne(() => Users, (user) => user.topic)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column()
  interestTopic: string;
}
