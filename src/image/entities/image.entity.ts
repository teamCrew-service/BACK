import { Crew } from '@src/crew/entities/crew.entity';
import { Users } from '@src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('image')
export class Image {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  imageId: number;

  @ManyToOne(() => Crew, (crew) => crew.image)
  @JoinColumn({ name: 'crewId' })
  crewId: number;

  @ManyToOne(() => Users, (user) => user.image)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'varchar' })
  image: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
