import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '@src/schedule/entities/schedule.entity';
import { CreateScheduleDto } from '@src/schedule/dto/createSchedule.dto';
import { EditScheduleDto } from '@src/schedule/dto/editSchedule.dto';
import { Repository, EntityManager, UpdateResult } from 'typeorm';
import MySchedule from '@src/schedule/interface/mySchedule';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class ScheduleRepository {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly entityManager: EntityManager,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  // 일정 조회
  async findSchedule(userId: number): Promise<MySchedule[]> {
    try {
      const query = `
     SELECT 
            schedule.scheduleTitle,
            schedule.scheduleDDay,
            schedule.scheduleId,
            users_participant.profileImage AS participant_profileImage, -- 해당 크루에 포함된 멤버의 이미지 (users 테이블에서 가져옴)
            users.userId,
            participant.userId AS participant_userId,
            crew.crewId,
            crew.crewType,
            users_participant.nickname AS participant_userName
       FROM  schedule
  LEFT JOIN  users ON schedule.userId = users.userId -- 일정을 작성한 사람과 users 테이블 조인
  LEFT JOIN crew ON schedule.crewId = crew.crewId -- 일정이 속한 크루와 crew 테이블 조인
  LEFT JOIN participant ON crew.crewId = participant.crewId -- 크루에 포함된 멤버와 participant 테이블 조인
  LEFT JOIN users AS users_participant ON participant.userId = users_participant.userId -- 멤버의 이미지를 users 테이블에서 가져옴
      WHERE (crew.crewId IN (SELECT crewId FROM participant WHERE userId = ${userId})
      OR crew.userId = ${userId}) -- crew의 작성자도 schedule을 확인할 수 있도록 추가
      AND schedule.scheduleIsDone = false
      ORDER BY schedule.scheduleDDay;`;

      return await this.entityManager.query(query);
    } catch (e) {
      this.handleException('ScheduleRepository/findSchedule', e);
    }
  }

  // 종료된 일정 조회
  async findParticipateSchedule(userId: number): Promise<MySchedule[]> {
    try {
      const query = `
     SELECT 
            schedule.scheduleTitle,
            schedule.scheduleDDay,
            schedule.scheduleId,
            users_participant.profileImage AS participant_profileImage, -- 해당 크루에 포함된 멤버의 이미지 (users 테이블에서 가져옴)
            users.userId,
            participant.userId AS participant_userId,
            crew.crewId,
            crew.crewType,
            users_participant.nickname AS participant_userName
       FROM  schedule
  LEFT JOIN  users ON schedule.userId = users.userId -- 일정을 작성한 사람과 users 테이블 조인
  LEFT JOIN crew ON schedule.crewId = crew.crewId -- 일정이 속한 크루와 crew 테이블 조인
  LEFT JOIN participant ON crew.crewId = participant.crewId -- 크루에 포함된 멤버와 participant 테이블 조인
  LEFT JOIN users AS users_participant ON participant.userId = users_participant.userId -- 멤버의 이미지를 users 테이블에서 가져옴
      WHERE (crew.crewId IN (SELECT crewId FROM participant WHERE userId = ${userId})
      OR crew.userId = ${userId}) -- crew의 작성자도 schedule을 확인할 수 있도록 추가
      AND schedule.scheduleIsDone = true
      ORDER BY schedule.scheduleDDay;`;

      return await this.entityManager.query(query);
    } catch (e) {
      this.handleException('ScheduleRepository/findParticipateSchedule', e);
    }
  }

  // 일정 생성
  async createSchedule(
    createScheduleDto: CreateScheduleDto,
    userId: number,
    crewId: number,
  ): Promise<Schedule> {
    try {
      const schedule = new Schedule();
      schedule.userId = userId;
      schedule.crewId = crewId;
      schedule.scheduleTitle = createScheduleDto.scheduleTitle;
      schedule.scheduleContent = createScheduleDto.scheduleContent;
      schedule.scheduleDDay = createScheduleDto.scheduleDDay;
      schedule.scheduleAddress = createScheduleDto.scheduleAddress;
      schedule.schedulePlaceName = createScheduleDto.schedulePlaceName;
      schedule.scheduleLatitude = createScheduleDto.scheduleLatitude;
      schedule.scheduleLongitude = createScheduleDto.scheduleLongitude;

      const createdSchedule = await this.scheduleRepository.save(schedule);

      return createdSchedule;
    } catch (e) {
      this.handleException('ScheduleRepository/createSchedule', e);
    }
  }

  // 일정 수정
  async editSchedule(
    editScheduleDto: EditScheduleDto,
    crewId: number,
    scheduleId: number,
  ): Promise<UpdateResult> {
    try {
      // 수정할 필드만 선택적으로 업데이트
      const {
        scheduleTitle,
        scheduleAddress,
        schedulePlaceName,
        scheduleDDay,
        scheduleContent,
        scheduleLatitude,
        scheduleLongitude,
      } = editScheduleDto;

      return await this.scheduleRepository.update(
        { scheduleId, crewId },
        {
          scheduleTitle,
          scheduleAddress,
          schedulePlaceName,
          scheduleDDay,
          scheduleContent,
          scheduleLatitude,
          scheduleLongitude,
        },
      );
    } catch (e) {
      this.handleException('ScheduleRepository/editSchedule', e);
    }
  }

  // 일정 상세 조회
  async findScheduleDetail(
    scheduleId: number,
    crewId: number,
  ): Promise<Schedule> {
    try {
      return await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoin('schedule.crewId', 'crew') // crew 테이블과의 join
        .leftJoin(
          'participant',
          'participant',
          'participant.crewId = schedule.crewId',
        )
        .leftJoin('users', 'users', 'users.userId = schedule.userId')
        .where('schedule.scheduleId = :scheduleId', { scheduleId }) // 해당 scheduleId를 가진 멤버만 필터링
        .andWhere('crew.crewId = :crewId', { crewId }) // 해당 crewId를 가진 멤버만 필터링
        .select([
          'schedule.scheduleId AS scheduleId',
          'schedule.scheduleTitle AS schedule',
          'schedule.scheduleDDay AS scheduleDDay',
          'schedule.scheduleContent AS scheduleContent',
          'schedule.scheduleAddress AS scheduleAddress',
          'schedule.schedulePlaceName AS schedulePlaceName',
          'schedule.scheduleLatitude AS scheduleLatitude',
          'schedule.scheduleLongitude AS scheduleLongitude',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(participant.crewId) AS scheduleAttendedMember',
          'users.profileImage AS captainProfileImage',
        ]) // 필요한 필드만 선택
        .getRawOne();
    } catch (e) {
      this.handleException('ScheduleRepository/findScheduleDetail', e);
    }
  }

  // 일정 삭제
  async deleteSchedule(scheduleId: number, crewId: number): Promise<Schedule> {
    try {
      const schedule = await this.scheduleRepository.findOne({
        where: { scheduleId, crewId },
      });

      return await this.scheduleRepository.softRemove(schedule); // soft delete
    } catch (e) {
      this.handleException('ScheduleRepository/deleteSchedule', e);
    }
  }

  /* crew에 해당하는 schedule 조회 */
  async findScheduleByCrew(
    crewId: number,
    userId: number,
  ): Promise<Schedule[]> {
    try {
      const schedules = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoin(
          'participant',
          'participant',
          'participant.crewId = schedule.crewId',
        )
        .leftJoin('users', 'users', 'users.userId = participant.userId')
        .leftJoin('crew', 'crew', 'crew.crewId = schedule.crewId')
        .where('schedule.crewId = :crewId', { crewId })
        .andWhere('schedule.deletedAt IS NULL')
        .select([
          'schedule.scheduleId AS scheduleId',
          'schedule.userId AS userId',
          'schedule.scheduleTitle AS scheduleTitle',
          'schedule.scheduleContent AS scheduleContent',
          'schedule.scheduleDDay AS scheduleDDay',
          'schedule.scheduleIsDone AS scheduleIsDone',
          'schedule.scheduleAddress AS scheduleAddress',
          'schedule.schedulePlaceName AS schedulePlaceName',
          'crew.crewMaxMember AS scheduleMaxMember',
          'COUNT(participant.scheduleId) AS scheduleAttendedMember',
          'schedule.scheduleLatitude AS scheduleLatitude',
          'schedule.scheduleLongitude AS scheduleLongitude',
          'schedule.createdAt AS createdAt',
          `JSON_ARRAYAGG(JSON_OBJECT('participantUserId', participant.userId, 'participantProfileImage', users.profileImage)) AS participants`,
        ])
        .groupBy('schedule.scheduleId')
        .orderBy('schedule.scheduleDDay', 'ASC')
        .getRawMany();
      if (schedules.length < 1 || schedules[0].scheduleId === null) {
        const schedule = [];
        return schedule;
      } else {
        const schedule = schedules;
        return schedule;
      }
    } catch (e) {
      this.handleException('ScheduleRepository/findScheduleByCrew', e);
    }
  }

  /* 오늘 날짜 기준보다 날짜가 지난 일정을 찾아 IsDone을 true로 전환 */
  async updateScheduleIsDone(): Promise<void> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      await this.scheduleRepository
        .createQueryBuilder('schedule')
        .update(Schedule)
        .set({ scheduleIsDone: true })
        .where('scheduleDDay < :today', { today })
        .andWhere('scheduleIsDone = :scheduleIsDone', {
          scheduleIsDone: false,
        })
        .execute();
    } catch (e) {
      this.handleException('ScheduleRepository/updateScheduleIsDone', e);
    }
  }

  /* 위임에 따라 schedule 작성자 변경 */
  async delegateSchedule(delegator: number, crewId: number): Promise<void> {
    try {
      await this.scheduleRepository
        .createQueryBuilder('schedule')
        .update(Schedule)
        .set({ userId: delegator })
        .where('crewId = :crewId', { crewId })
        .andWhere('deletedAt IS NULL')
        .execute();
    } catch (e) {
      this.handleException('ScheduleRepository/delegateSchedule', e);
    }
  }

  /* 오늘 날짜에 가까운 schedule만 조회하기 */
  async findScheduleCloseToToday(crewId: number): Promise<Schedule> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      const schedule = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .select(['crewId', 'scheduleDDay'])
        .where('schedule.crewId = :crewId', { crewId })
        .andWhere('schedule.scheduleDDay > :today', { today })
        .orderBy('schedule.scheduleDDay', 'ASC')
        .getRawMany();

      return schedule[0];
    } catch (e) {
      this.handleException('ScheduleRepository/findScheduleCloseToToday', e);
    }
  }

  /* crew 삭제에 따른 schedule 삭제 */
  async deleteScheduleByCrew(crewId: number): Promise<UpdateResult> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      return await this.scheduleRepository
        .createQueryBuilder('schedule')
        .update(Schedule)
        .set({ deletedAt: today })
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.handleException('ScheduleRepository/deleteScheduleByCrew', e);
    }
  }
}
