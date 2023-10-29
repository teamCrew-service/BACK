import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { EditScheduleDto } from './dto/editSchedule.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  @Cron('0 0 * * * *')
  async scheduleCron() {
    try {
      await this.scheduleRepository.updateScheduleIsDone();
    } catch (e) {
      console.error(e);
      throw new Error('ScheduleService/scheduleCron');
    }
  }

  // 일정 조회
  async findSchedule(userId: number): Promise<any[]> {
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
      console.error(e);
      throw new Error('ScheduleService/findSchedule');
    }
  }

  // 다가오는 일정, 참여 완료 일정 전체
  async findParticipateSchedule(userId: number): Promise<any> {
    try {
      const rawData = await this.scheduleRepository.findParticipateSchedule(
        userId,
      );

      // 일정별로 데이터를 묶는 맵을 생성
      const scheduleMap = new Map();

      for (const data of rawData) {
        const scheduleKey = data.shceduleTitle + data.scheduleDDay;
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
      console.error(e);
      throw new Error('ScheduleService/findParticipateSchedule');
    }
  }

  // 일정 생성
  async createSchedule(
    createScheduleDto: CreateScheduleDto,
    userId: number,
    crewId: number,
  ): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.createSchedule(
        createScheduleDto,
        userId,
        crewId,
      );
      return { schedule, message: '일정 등록 성공' };
    } catch (error) {
      throw new HttpException('일정 글 생성 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 일정 수정
  async editSchedule(
    crewId: number,
    scheduleId: number,
    editScheduleDto: EditScheduleDto,
  ): Promise<any> {
    try {
      const updatedSchedule = await this.scheduleRepository.editSchedule(
        editScheduleDto,
        crewId,
        scheduleId,
      );
      return updatedSchedule;
    } catch (error) {
      console.error('Error while editing schedule:', error);
      throw new HttpException('일정 수정 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 일절 상세 조회
  async findScheduleDetail(scheduleId: number, crewId: number): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.findScheduleDetail(
        scheduleId,
        crewId,
      );
      return schedule;
    } catch (error) {
      console.error('Error while finding schedule detail:', error);
      throw new HttpException(
        '공지사항 상세 조회 실패',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 일정 삭제
  async deleteSchedule(scheduleId: number, crewId: number): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.deleteSchedule(
        scheduleId,
        crewId,
      );
      return { schedule, message: '일정 삭제 성공' };
    } catch (error) {
      console.error('Error while deleting schedule:', error);
      throw new HttpException('공지사항 삭제 실패', HttpStatus.BAD_REQUEST);
    }
  }

  /* crew 해당하는 schedule 조회 */
  async findScheduleByCrew(crewId: number, userId: number): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.findScheduleByCrew(
        crewId,
        userId,
      );
      return schedule;
    } catch (e) {
      console.error(e);
      throw new Error('ScheduleService/findScheduleByCrew');
    }
  }

  /* 위임에 따라 schedule 작성자 변경 */
  async delegateSchedule(delegator: number, crewId: number): Promise<any> {
    try {
      await this.scheduleRepository.delegateSchedule(delegator, crewId);
      return '일정 위임 완료';
    } catch (e) {
      console.error(e);
      throw new Error('ScheduleService/delegateSchedule');
    }
  }

  /* 오늘 날짜에 가까운 schedule만 조회하기 */
  async findScheduleCloseToToday(crewId: number): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.findScheduleCloseToToday(
        crewId,
      );
      return schedule;
    } catch (e) {
      console.error(e);
      throw new Error('ScheduleService/findScheduleCloseToToday');
    }
  }

  /* crew 삭제에 따른 schedule 삭제 */
  async deleteScheduleByCrew(crewId: number): Promise<any> {
    try {
      const deleteSchedule = await this.scheduleRepository.deleteScheduleByCrew(
        crewId,
      );
      return deleteSchedule;
    } catch (e) {
      console.error(e);
      throw new Error('ScheduleService/deleteScheduleByCrew');
    }
  }
}
