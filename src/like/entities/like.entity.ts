import { Crew } from 'src/crew/entities/crew.entity';
import { Users } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('like')
export class Like {
  @PrimaryGeneratedColumn()
  likeId: number;

  @ManyToOne(() => Users, (user) => user.like)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @ManyToOne(() => Crew, (crew) => crew.like)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
