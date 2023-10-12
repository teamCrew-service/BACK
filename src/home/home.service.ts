import { Injectable } from '@nestjs/common';
// import { Crew } from 'src/crew/entities/crew.entity';
import { HomeRepository } from './home.repository';
import { ScheduleService } from 'src/schedule/schedule.service';

@Injectable()
export class HomeService {
  constructor(
    private homeRepository: HomeRepository,
    private scheduleService: ScheduleService,
  ) {}

  // 다가오는 일정
  async findSchedule(userId: number): Promise<any> {
    const schedule = await this.scheduleService.findSchedule(userId);
    return schedule;
  }

  // 다가오는 일정, 참여완료 일정
  async findParticipateSchedule(userId: number): Promise<any> {
    const schedule = await this.scheduleService.findParticipateSchedule(userId);
    return schedule;
  }

  // 내 주변 모임 찾기
  async getCrew(userId: number): Promise<any> {
    return this.homeRepository.getCrew(userId);
  }

  // 내 주변 모임 찾기(카테고리별)
  async findCrewByCategoryAndMap(category: string): Promise<any> {
    return this.homeRepository.findCrewByCategoryAndMap(category);
  }

  // 카테고리별 모임 찾기
  async findCrewByCategory(category: string, userId: number): Promise<any> {
    return this.homeRepository.findCrewByCategory(category, userId);
  }
}
