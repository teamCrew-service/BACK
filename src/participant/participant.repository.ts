import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';
import { Participant } from '@src/participant/entities/participant.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ParticipantRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Participant)
    private readonly participantRepository: Repository<Participant>,
  ) {}

  /* 일정에서 참여하기 */
  async participateSchedule(
    userId: number,
    crewId: number,
    scheduleId: number,
  ): Promise<Participant> {
    try {
      const participant = new Participant();
      participant.userId = userId;
      participant.crewId = crewId;
      participant.scheduleId = scheduleId;
      await this.participantRepository.save(participant);
      return participant;
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantRepository/participateSchedule',
        e,
      );
    }
  }

  /* schedule에 참여한 인원 조회하기 */
  async findAllParticipant(
    crewId: number,
    scheduleId: number,
  ): Promise<Participant[]> {
    try {
      const participant = await this.participantRepository
        .createQueryBuilder('participant')
        .where('participant.crewId = :crewId', { crewId })
        .andWhere('participant.scheduleId = :scheduleId', { scheduleId })
        .leftJoin('users', 'users', 'users.userId = participant.userId')
        .select([
          'participant.participantId AS participantId',
          'participant.userId AS userId',
          'users.profileImage AS profileImage',
        ])
        .groupBy('participant.participantId')
        .getRawMany();
      return participant;
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantRepository/findAllParticipant',
        e,
      );
    }
  }

  /* 참여한 schedule 취소하기 */
  async cancelParticipate(
    crewId: number,
    scheduleId: number,
    userId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.participantRepository
        .createQueryBuilder('participant')
        .delete()
        .from(Participant)
        .where('crewId = :crewId', { crewId })
        .andWhere('scheduleId = :scheduleId', { scheduleId })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantRepository/cancelParticipate',
        e,
      );
    }
  }

  /* crew 삭제에 따른 participant delete */
  async deleteParticipant(crewId: number): Promise<DeleteResult> {
    try {
      return await this.participantRepository
        .createQueryBuilder('participant')
        .delete()
        .from(Participant)
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantRepository/deleteParticipant',
        e,
      );
    }
  }

  /* schedule 삭제에 따라 participant delete */
  async deleteParticipantBySchedule(
    scheduleId: number,
    crewId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.participantRepository
        .createQueryBuilder('participant')
        .delete()
        .from(Participant)
        .where('crewId = :crewId', { crewId })
        .andWhere('scheduleId = :scheduleId', { scheduleId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantRepository/deleteParticipantBySchedule',
        e,
      );
    }
  }
}
