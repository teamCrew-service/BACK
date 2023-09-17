import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { CreateScheduleDto } from './dto/createSchedule.dto';
import { EditScheduleDto } from './dto/editSchedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  // 공지사항 조회
  async findSchedule(userId: number) {
    const schedule = await this.scheduleRepository.findSchedule(userId);

    // map 함수를 사용하여 schedule를 순회하면서 필요한 데이터만 추출 후 새로운 배열로 반환
    const processedSchedules = schedule.map((schedule) => {
      return {
        scheduleTitle: schedule.scheduleTitle,
        scheduleDDay: schedule.scheduleDDay,
        profileImage: schedule.userId ? schedule.userId.profileImage : null, // user.profileImage가 존재하지 않을 경우 null
      };
    });

    return processedSchedules;
  }

  // 공지사항 생성
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

  // 공지사항 수정
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

  // 공지사항 상세 조회
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

  // 공지사항 삭제
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
