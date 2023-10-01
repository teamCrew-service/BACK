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
        'participant.participantId',
        'participant.userId',
        'users.profileImage',
      ])
      .groupBy('participant.participantId')
      .getRawMany();
    return participant;
  }

  /* 참여한 schedule 취소하기 */
  async cancelParticipate(
    crewId: number,
    scheduleId: number,
    userId: number,
  ): Promise<any> {
    const canceledParticipant = await this.participantRepository
      .createQueryBuilder('participant')
      .delete()
      .from(Participant)
      .where('participant.crewId = :crewId', { crewId })
      .andWhere('participant.scheduleId = :scheduleId', { scheduleId })
      .andWhere('participant.userId = :userId', { userId })
      .execute();
    return canceledParticipant;
  }
}
