import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { EditScheduleDto } from './dto/editSchedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  // 일정 조회
  async findSchedule(userId: number): Promise<any[]> {
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
          },
          profileImage: [],
        };
        scheduleMap.set(scheduleKey, scheduleData);
      }

      // 멤버의 프로필 이미지를 배열에 추가
      if (data.member_profileImage) {
        scheduleData.profileImage.push({
          member_profileImage: data.member_profileImage,
          member_userId: data.member_userId,
          member_userName: data.member_userName,
        });
      } else {
        scheduleData.profileImage.push({
          user_profileImage: null,
          member_userId: data.member_userId,
          member_userName: data.member_userName,
        });
      }
    }

    // 결과 배열을 생성
    const result = Array.from(scheduleMap.values());

    return result;
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
      return { schedule, message: '공지 등록 성공' };
    } catch (error) {
      throw new HttpException('공지 글 생성 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 일정 수정
  async editSchedule(
    userId: number,
    crewId: number,
    scheduleId: number,
    editScheduleDto: EditScheduleDto,
  ): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.editSchedule(
        editScheduleDto,
        userId,
        crewId,
        scheduleId,
      );
      return { schedule, message: '공지사항 수정 성공' };
    } catch (error) {
      console.error('Error while editing schedule:', error);
      throw new HttpException('공지사항 수정 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 일절 상세 조회
  async findScheduleDetail(scheduleId: number, crewId: number): Promise<any> {
    try {
      const schedule = await this.scheduleRepository.findScheduleDetail(
        scheduleId,
        crewId,
      );
      return { schedule, message: '공지사항 상세 조회 성공' };
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
      return { schedule, message: '공지사항 삭제 성공' };
    } catch (error) {
      console.error('Error while deleting schedule:', error);
      throw new HttpException('공지사항 삭제 실패', HttpStatus.BAD_REQUEST);
    }
  }

  /* crew 해당하는 schedule 조회 */
  async findScheduleByCrew(crewId: number): Promise<any> {
    const schedule = await this.scheduleRepository.findScheduleByCrew(crewId);
    return schedule;
  }
}
