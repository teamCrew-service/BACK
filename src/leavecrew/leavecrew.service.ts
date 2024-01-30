import { Injectable } from '@nestjs/common';
import { LeavecrewRepository } from '@src/leavecrew/leavecrew.repository';
import { Cron } from '@nestjs/schedule';
import { Leavecrew } from '@src/leavecrew/entities/leavecrew.entity';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class LeavecrewService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private leavecrewRepository: LeavecrewRepository,
  ) {}

  @Cron('0 0 * * * *')
  async toBeLeaveCron() {
    try {
      await this.leavecrewRepository.findAllLeaveCrew();
    } catch (e) {
      this.errorHandlingService.handleException(
        'LeavecrewService/toBeLeaveCron',
        e,
      );
    }
  }

  /* crew 탈퇴 등록하기 */
  async createLeaveCrew(crewId: number, userId: number): Promise<Leavecrew> {
    try {
      return await this.leavecrewRepository.createLeaveCrew(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'LeavecrewService/createLeaveCrew',
        e,
      );
    }
  }

  /* crew 탈퇴자 조회하기 */
  async findOneLeaveUser(crewId: number, userId: number): Promise<Leavecrew> {
    try {
      return await this.leavecrewRepository.findOneLeaveUser(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'LeavecrewService/findOneLeaveUser',
        e,
      );
    }
  }
}
