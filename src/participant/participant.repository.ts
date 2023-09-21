import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from './entities/participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantRepository {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  /* 일정에서 참여하기 */
  async participateSchedule(
    userId: number,
    crewId: number,
    scheduleId: number,
  ): Promise<any> {
    const participant = new Participant();
    participant.userId = userId;
    participant.crewId = crewId;
    participant.scheduleId = scheduleId;
    await this.participantRepository.save(participant);
    return participant;
  }

  /* schedule에 참여한 인원 조회하기 */
  async findAllParticipant(crewId: number, scheduleId: number): Promise<any> {
    const participant = await this.participantRepository
      .createQueryBuilder('participant')
      .where('participant.crewId = :crewId', { crewId })
      .andWhere('participant.scheduleId = :scheduleId', { scheduleId })
      .leftJoin('users', 'users', 'users.userId = participant.userId')
      .select([
        'participant.scheduleId',
        'participant.userId',
        'users.profileImage',
      ])
      .groupBy('participant.scheduleId')
      .getRawMany();
    return participant;
  }
}
