import { Injectable } from '@nestjs/common';
// import { Crew } from 'src/crew/entities/crew.entity';
import { HomeRepository } from '@src/home/home.repository';
import MySchedule from '@src/schedule/interface/mySchedule';
import { ScheduleService } from '@src/schedule/schedule.service';
import GetCrew from '@src/home/interface/getCrew';

@Injectable()
export class HomeService {
  constructor(
    private homeRepository: HomeRepository,
    private scheduleService: ScheduleService,
  ) {}

  // 다가오는 일정
  async findSchedule(userId: number): Promise<MySchedule[]> {
    try {
      return await this.scheduleService.findSchedule(userId);
    } catch (e) {
      console.error(e);
      throw new Error('HomeService/findSchedule');
    }
  }

  // 다가오는 일정, 참여완료 일정
  async findParticipateSchedule(userId: number): Promise<MySchedule[]> {
    try {
      return await this.scheduleService.findParticipateSchedule(userId);
    } catch (e) {
      console.error(e);
      throw new Error('HomeService/findParticipateSchedule');
    }
  }

  // 내 주변 모임 찾기
  async getCrew(userId: number): Promise<GetCrew[]> {
    try {
      return await this.homeRepository.getCrew(userId);
    } catch (e) {
      console.error(e);
      throw new Error('HomeService/getCrew');
    }
  }

  // 내 주변 모임 찾기(카테고리별)
  async findCrewByCategoryAndMap(
    category: string,
    userId: number,
  ): Promise<GetCrew[]> {
    try {
      return await this.homeRepository.findCrewByCategoryAndMap(
        category,
        userId,
      );
    } catch (e) {
      console.error(e);
      throw new Error('HomeService/findCrewByCategoryAndMap');
    }
  }

  // 카테고리별 모임 찾기
  async findCrewByCategory(
    category: string,
    userId: number,
  ): Promise<GetCrew[]> {
    try {
      return await this.homeRepository.findCrewByCategory(category, userId);
    } catch (e) {
      console.error(e);
      throw new Error('HomeService/findCrewByCategory');
    }
  }
}
