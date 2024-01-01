import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alarm } from '@src/alarm/entities/alarm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlarmRepository {
  constructor(
    @InjectRepository(Alarm) private alarmRepository: Repository<Alarm>,
  ) {}

  /* 알림 생성 */
  async createAlarm(
    crewId: number,
    delegator: number,
    nickname: string,
  ): Promise<any> {
    try {
      const alarmMessage = `안녕하세요 ${nickname}님 새로운 호스트가 되셨습니다. 앞으로 정모를 잘 부탁드립니다.`;
      const alarm = new Alarm();
      alarm.userId = delegator;
      alarm.crewId = crewId;
      alarm.alarmMessage = alarmMessage;
      await this.alarmRepository.save(alarm);
      return alarm;
    } catch (e) {
      console.error(e);
      throw new Error('AlarmRepository/createAlarm');
    }
  }

  /* 알림 조회 */
  async findOneAlarm(crewId: number, userId: number): Promise<any> {
    try {
      const alarm = await this.alarmRepository
        .createQueryBuilder('alarm')
        .select(['alarmId', 'userId', 'crewId', 'alarmMessage', 'alarmCheck'])
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .andWhere('alarmCheck IS false')
        .getRawOne();
      return alarm;
    } catch (e) {
      console.error(e);
      throw new Error('AlarmRepository/findOneAlarm');
    }
  }

  /* 알림 확인 */
  async checkAlarm(crewId: number, userId: number): Promise<any> {
    try {
      const checkAlarm = await this.alarmRepository
        .createQueryBuilder('alarm')
        .update(Alarm)
        .set({ alarmCheck: true })
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .execute();
      return checkAlarm;
    } catch (e) {
      console.error(e);
      throw new Error('AlarmRepository/checkAlarm');
    }
  }
}
