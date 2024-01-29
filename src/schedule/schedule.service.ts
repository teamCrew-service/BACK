import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { ScheduleRepository } from '@src/schedule/schedule.repository';
import { CreateScheduleDto } from '@src/schedule/dto/createSchedule.dto';
import { EditScheduleDto } from '@src/schedule/dto/editSchedule.dto';
import { Cron } from '@nestjs/schedule';
import MySchedule from 'src/schedule/interface/mySchedule';
import { UpdateResult } from 'typeorm';
import { Schedule } from '@src/schedule/entities/schedule.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  @Cron('0 0 * * * *')
  async scheduleCron() {
    try {
      await this.scheduleRepository.updateScheduleIsDone();
    } catch (e) {
      this.handleException('ScheduleService/scheduleCron', e);
    }
  }

  // 일정 조회
  async findSchedule(userId: number): Promise<MySchedule[]> {
    try {
      const rawData = await this.scheduleRepository.findSchedule(userId);

      // 일정별로 데이터를 묶는 맵을 생성
      const scheduleMap = new Map();

      for (const data of rawData) {
        const scheduleKey = data.scheduleTitle + data.scheduleDDay; // 일정 제목과 날짜를 키로 사용
        let scheduleData = scheduleMap.get(scheduleKey); // 일정별로 데이터를 묶음

        // 일정이 없을 경우
        if (!scheduleData) {
          scheduleData = {
            schedule: {
              scheduleTitle: data.scheduleTitle,
              scheduleDDay: data.scheduleDDay,
              scheduleId: data.scheduleId,
              crewType: data.crewType,
              crewId: data.crewId,
            },
            profileImage: [],
          };
          scheduleMap.set(scheduleKey, scheduleData);
        }

        // 멤버의 프로필 이미지를 배열에 추가
        if (data.participant_profileImage) {
          scheduleData.profileImage.push({
            participant_profileImage: data.participant_profileImage,
            participant_userId: data.participant_userId,
            participant_userName: data.participant_userName,
          });
        } else {
          scheduleData.profileImage.push({
            user_profileImage: null,
            participant_userId: data.participant_userId,
            participant_userName: data.participant_userName,
          });
        }
      }

      // 결과 배열을 생성
      const result = Array.from(scheduleMap.values());

      return result;
    } catch (e) {
      this.handleException('ScheduleService/findSchedule', e);
    }
  }

  // 다가오는 일정, 참여 완료 일정 전체
  async findParticipateSchedule(userId: number): Promise<MySchedule[]> {
    try {
      const rawData = await this.scheduleRepository.findParticipateSchedule(
        userId,
      );

      // 일정별로 데이터를 묶는 맵을 생성
      const scheduleMap = new Map();

      for (const data of rawData) {
        const scheduleKey = data.scheduleTitle + data.scheduleDDay;
        let scheduleData = scheduleMap.get(scheduleKey);

        // 일정이 없을 경우
        if (!scheduleData) {
          scheduleData = {
            schedule: {
              scheduleTitle: data.scheduleTitle,
              scheduleDDay: data.scheduleDDay,
              scheduleId: data.scheduleId,
              crewType: data.crewType,
              crewId: data.crewId,
            },
            profileImage: [],
          };
          scheduleMap.set(scheduleKey, scheduleData);
        }

        // 멤버의 프로필 이미지를 배열에 추가
        if (data.participant_profileImage) {
          scheduleData.profileImage.push({
            participant_profileImage: data.participant_profileImage,
            participant_userId: data.participant_userId,
            participant_userName: data.participant_userName,
          });
        } else {
          scheduleData.profileImage.push({
            user_profileImage: null,
            participant_userId: data.participant_userId,
            participant_userName: data.participant_userName,
          });
        }
      }

      // 결과 배열을 생성
      const result = Array.from(scheduleMap.values());

      return result;
    } catch (e) {
      this.handleException('ScheduleService/findParticipateSchedule', e);
    }
  }

  // 일정 생성
  async createSchedule(
    createScheduleDto: CreateScheduleDto,
    userId: number,
    crewId: number,
  ): Promise<Object> {
    try {
      const schedule = await this.scheduleRepository.createSchedule(
        createScheduleDto,
        userId,
        crewId,
      );
      return { schedule, message: '일정 등록 성공' };
    } catch (e) {
      this.handleException('ScheduleService/createSchedule', e);
    }
  }

  // 일정 수정
  async editSchedule(
    crewId: number,
    scheduleId: number,
    editScheduleDto: EditScheduleDto,
  ): Promise<UpdateResult> {
    try {
      return await this.scheduleRepository.editSchedule(
        editScheduleDto,
        crewId,
        scheduleId,
      );
    } catch (e) {
      this.handleException('ScheduleService/editSchedule', e);
    }
  }

  // 일절 상세 조회
  async findScheduleDetail(
    scheduleId: number,
    crewId: number,
  ): Promise<Schedule> {
    try {
      return await this.scheduleRepository.findScheduleDetail(
        scheduleId,
        crewId,
      );
    } catch (e) {
      this.handleException('ScheduleService/findScheduleDetail', e);
    }
  }

  // 일정 삭제
  async deleteSchedule(scheduleId: number, crewId: number): Promise<Object> {
    try {
      const schedule = await this.scheduleRepository.deleteSchedule(
        scheduleId,
        crewId,
      );
      return { schedule, message: '일정 삭제 성공' };
    } catch (e) {
      this.handleException('ScheduleService/deleteSchedule', e);
    }
  }

  /* crew 해당하는 schedule 조회 */
  async findScheduleByCrew(
    crewId: number,
    userId: number,
  ): Promise<Schedule[]> {
    try {
      return await this.scheduleRepository.findScheduleByCrew(crewId, userId);
    } catch (e) {
      this.handleException('ScheduleService/findScheduleByCrew', e);
    }
  }

  /* 위임에 따라 schedule 작성자 변경 */
  async delegateSchedule(delegator: number, crewId: number): Promise<string> {
    try {
      await this.scheduleRepository.delegateSchedule(delegator, crewId);
      return '일정 위임 완료';
    } catch (e) {
      this.handleException('ScheduleService/delegateSchedule', e);
    }
  }

  /* 오늘 날짜에 가까운 schedule만 조회하기 */
  async findScheduleCloseToToday(crewId: number): Promise<Schedule> {
    try {
      return await this.scheduleRepository.findScheduleCloseToToday(crewId);
    } catch (e) {
      this.handleException('ScheduleService/findScheduleCloseToToday', e);
    }
  }

  /* crew 삭제에 따른 schedule 삭제 */
  async deleteScheduleByCrew(crewId: number): Promise<UpdateResult> {
    try {
      return await this.scheduleRepository.deleteScheduleByCrew(crewId);
    } catch (e) {
      this.handleException('ScheduleService/deleteScheduleByCrew', e);
    }
  }
}
