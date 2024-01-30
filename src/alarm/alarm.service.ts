import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '@src/alarm/alarm.repository';
import { Alarm } from '@src/alarm/entities/alarm.entity';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';
import { UpdateResult } from 'typeorm';

@Injectable()
export class AlarmService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private alarmRepository: AlarmRepository,
  ) {}

  /* 알림 생성 */
  async createAlarm(
    crewId: number,
    delegator: number,
    nickname: string,
  ): Promise<Alarm> {
    try {
      return await this.alarmRepository.createAlarm(
        crewId,
        delegator,
        nickname,
      );
    } catch (e) {
      this.errorHandlingService.handleException('AlarmService/createAlarm', e);
    }
  }

  /* 알림 조회 */
  async findOneAlarm(crewId: number, userId: number): Promise<Alarm> {
    try {
      return await this.alarmRepository.findOneAlarm(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException('AlarmService/findOneAlarm', e);
    }
  }

  /* 알림 확인 */
  async checkAlarm(crewId: number, userId: number): Promise<UpdateResult> {
    try {
      return await this.alarmRepository.checkAlarm(crewId, userId);
    } catch (e) {
      this.errorHandlingService.handleException('AlarmService/checkAlarm', e);
    }
  }
}
