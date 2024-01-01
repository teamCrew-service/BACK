import { Injectable } from '@nestjs/common';
import { AlarmRepository } from '@src/alarm/alarm.repository';

@Injectable()
export class AlarmService {
  constructor(private alarmRepository: AlarmRepository) {}

  /* 알림 생성 */
  async createAlarm(
    crewId: number,
    delegator: number,
    nickname: string,
  ): Promise<any> {
    try {
      const alarm = await this.alarmRepository.createAlarm(
        crewId,
        delegator,
        nickname,
      );
      return alarm;
    } catch (e) {
      console.error(e);
      throw new Error('AlarmService/createAlarm');
    }
  }

  /* 알림 조회 */
  async findOneAlarm(crewId: number, userId: number): Promise<any> {
    try {
      const alarm = await this.alarmRepository.findOneAlarm(crewId, userId);
      return alarm;
    } catch (e) {
      console.error(e);
      throw new Error('AlarmService/findOneAlarm');
    }
  }

  /* 알림 확인 */
  async checkAlarm(crewId: number, userId: number): Promise<any> {
    try {
      const checkAlarm = await this.alarmRepository.checkAlarm(crewId, userId);
      return checkAlarm;
    } catch (e) {
      console.error(e);
      throw new Error('AlarmService/checkAlarm');
    }
  }
}
