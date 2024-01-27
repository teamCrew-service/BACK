import { Injectable } from '@nestjs/common';
import { LeavecrewRepository } from '@src/leavecrew/leavecrew.repository';
import { Cron } from '@nestjs/schedule';
import { Leavecrew } from '@src/leavecrew/entities/leavecrew.entity';

@Injectable()
export class LeavecrewService {
  constructor(private leavecrewRepository: LeavecrewRepository) {}

  @Cron('0 0 * * * *')
  async toBeLeaveCron() {
    try {
      await this.leavecrewRepository.findAllLeaveCrew();
    } catch (e) {
      console.error(e);
      throw new Error('LeavecrewService/toBeLeaveCron');
    }
  }

  /* crew 탈퇴 등록하기 */
  async createLeaveCrew(crewId: number, userId: number): Promise<Leavecrew> {
    try {
      return await this.leavecrewRepository.createLeaveCrew(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('LeavecrewService/createLeaveCrew');
    }
  }

  /* crew 탈퇴자 조회하기 */
  async findOneLeaveUser(crewId: number, userId: number): Promise<Leavecrew> {
    try {
      return await this.leavecrewRepository.findOneLeaveUser(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('LeavecrewService/findOneLeaveUser');
    }
  }
}
