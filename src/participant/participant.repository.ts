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
    try {
      const participant = new Participant();
      participant.userId = userId;
      participant.crewId = crewId;
      participant.scheduleId = scheduleId;
      await this.participantRepository.save(participant);
      return participant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantRepository/participateSchedule');
    }
  }

  /* schedule에 참여한 인원 조회하기 */
  async findAllParticipant(crewId: number, scheduleId: number): Promise<any> {
    try {
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
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantRepository/findAllParticipant');
    }
  }

  /* 참여한 schedule 취소하기 */
  async cancelParticipate(
    crewId: number,
    scheduleId: number,
    userId: number,
  ): Promise<any> {
    try {
      const canceledParticipant = await this.participantRepository
        .createQueryBuilder('participant')
        .delete()
        .from(Participant)
        .where('crewId = :crewId', { crewId })
        .andWhere('scheduleId = :scheduleId', { scheduleId })
        .andWhere('userId = :userId', { userId })
        .execute();
      return canceledParticipant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantRepository/cancelParticipate');
    }
  }

  /* crew 삭제에 따른 participant delete */
  async deleteParticipant(crewId: number): Promise<any> {
    try {
      const deleteParticipant = await this.participantRepository
        .createQueryBuilder('participant')
        .delete()
        .from(Participant)
        .where('crewId = :crewId', { crewId })
        .execute();

      return deleteParticipant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantRepository/deleteParticipant');
    }
  }

  /* schedule 삭제에 따라 participant delete */
  async deleteParticipantBySchedule(
    scheduleId: number,
    crewId: number,
  ): Promise<any> {
    try {
      const deleteParticipant = await this.participantRepository
        .createQueryBuilder('participant')
        .delete()
        .from(Participant)
        .where('crewId = :crewId', { crewId })
        .andWhere('scheduleId = :scheduleId', { scheduleId })
        .execute();
      return deleteParticipant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantRepository/deleteParticipantBySchedule');
    }
  }
}
