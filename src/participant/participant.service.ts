import { Injectable } from '@nestjs/common';
import { ParticipantRepository } from '@src/participant/participant.repository';

@Injectable()
export class ParticipantService {
  constructor(private readonly participantRepository: ParticipantRepository) {}

  /* 일정에서 참여하기 */
  async participateSchedule(
    userId: number,
    crewId: number,
    scheduleId: number,
  ): Promise<any> {
    try {
      const participant = await this.participantRepository.participateSchedule(
        userId,
        crewId,
        scheduleId,
      );
      return participant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantService/participateSchedule');
    }
  }

  /* schedule에 참여한 인원 조회하기 */
  async findAllParticipant(crewId: number, scheduleId: number): Promise<any> {
    try {
      const participant = await this.participantRepository.findAllParticipant(
        crewId,
        scheduleId,
      );
      return participant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantService/findAllParticipant');
    }
  }

  /* 참여한 schedule 취소하기 */
  async cancelParticipate(
    crewId: number,
    scheduleId: number,
    userId: number,
  ): Promise<any> {
    try {
      const canceledParticipant =
        await this.participantRepository.cancelParticipate(
          crewId,
          scheduleId,
          userId,
        );
      return canceledParticipant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantService/cancelParticipate');
    }
  }

  /* crew 삭제에 따른 participant delete */
  async deleteParticipant(crewId: number): Promise<any> {
    try {
      const deleteParticipant =
        await this.participantRepository.deleteParticipant(crewId);
      return deleteParticipant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantService/deleteParticipant');
    }
  }

  /* schedule 삭제에 따라 participant delete */
  async deleteParticipantBySchedule(
    scheduleId: number,
    crewId: number,
  ): Promise<any> {
    try {
      const deleteParticipant =
        await this.participantRepository.deleteParticipantBySchedule(
          scheduleId,
          crewId,
        );
      return deleteParticipant;
    } catch (e) {
      console.error(e);
      throw new Error('ParticipantService/deleteParticipantBySchedule');
    }
  }
}
