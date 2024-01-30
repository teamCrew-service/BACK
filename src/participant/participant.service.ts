import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from '@src/participant/participant.repository';
import { Participant } from '@src/participant/entities/participant.entity';
import { DeleteResult } from 'typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class ParticipantService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly participantRepository: ParticipantRepository,
  ) {}

  /* 일정에서 참여하기 */
  async participateSchedule(
    userId: number,
    crewId: number,
    scheduleId: number,
  ): Promise<Participant> {
    try {
      return await this.participantRepository.participateSchedule(
        userId,
        crewId,
        scheduleId,
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantService/participateSchedule',
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
      const participant = await this.participantRepository.findAllParticipant(
        crewId,
        scheduleId,
      );
      return participant;
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantService/findAllParticipant',
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
      return await this.participantRepository.cancelParticipate(
        crewId,
        scheduleId,
        userId,
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantService/cancelParticipate',
        e,
      );
    }
  }

  /* crew 삭제에 따른 participant delete */
  async deleteParticipant(crewId: number): Promise<DeleteResult> {
    try {
      return await this.participantRepository.deleteParticipant(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantService/deleteParticipant',
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
      return await this.participantRepository.deleteParticipantBySchedule(
        scheduleId,
        crewId,
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'ParticipantService/deleteParticipantBySchedule',
        e,
      );
    }
  }
}
