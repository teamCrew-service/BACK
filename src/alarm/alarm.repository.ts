import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alarm } from '@src/alarm/entities/alarm.entity';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class AlarmRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Alarm) private alarmRepository: Repository<Alarm>,
  ) {}

  /* 알림 생성 */
  async createAlarm(
    crewId: number,
    delegator: number,
    nickname: string,
  ): Promise<Alarm> {
    try {
      const alarmMessage = `안녕하세요 ${nickname}님 새로운 호스트가 되셨습니다. 앞으로 정모를 잘 부탁드립니다.`;
      const alarm = new Alarm();
      alarm.userId = delegator;
      alarm.crewId = crewId;
      alarm.alarmMessage = alarmMessage;
      await this.alarmRepository.save(alarm);
      return alarm;
    } catch (e) {
      this.errorHandlingService.handleException(
        'AlarmRepository/createAlarm',
        e,
      );
    }
  }

  /* 알림 조회 */
  async findOneAlarm(crewId: number, userId: number): Promise<Alarm> {
    try {
      return await this.alarmRepository
        .createQueryBuilder('alarm')
        .select(['alarmId', 'userId', 'crewId', 'alarmMessage', 'alarmCheck'])
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .andWhere('alarmCheck IS false')
        .getRawOne();
    } catch (e) {
      this.errorHandlingService.handleException(
        'AlarmRepository/findOneAlarm',
        e,
      );
    }
  }

  /* 알림 확인 */
  async checkAlarm(crewId: number, userId: number): Promise<UpdateResult> {
    try {
      return await this.alarmRepository
        .createQueryBuilder('alarm')
        .update(Alarm)
        .set({ alarmCheck: true })
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'AlarmRepository/checkAlarm',
        e,
      );
    }
  }
}
