import { Injectable } from '@nestjs/common';
import { HomeRepository } from '@src/home/home.repository';
import MySchedule from '@src/schedule/interface/mySchedule';
import { ScheduleService } from '@src/schedule/schedule.service';
import GetCrew from '@src/home/interface/getCrew';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class HomeService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private homeRepository: HomeRepository,
    private scheduleService: ScheduleService,
  ) {}

  // 다가오는 일정
  async findSchedule(userId: number): Promise<MySchedule[]> {
    try {
      return await this.scheduleService.findSchedule(userId);
    } catch (e) {
      this.errorHandlingService.handleException('HomeService/findSchedule', e);
    }
  }

  // 다가오는 일정, 참여완료 일정
  async findParticipateSchedule(userId: number): Promise<MySchedule[]> {
    try {
      return await this.scheduleService.findParticipateSchedule(userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'HomeService/findParticipateSchedule',
        e,
      );
    }
  }

  // 내 주변 모임 찾기
  async getCrew(userId: number): Promise<GetCrew[]> {
    try {
      return await this.homeRepository.getCrew(userId);
    } catch (e) {
      this.errorHandlingService.handleException('HomeService/getCrew', e);
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
      this.errorHandlingService.handleException(
        'HomeService/findCrewByCategoryAndMap',
        e,
      );
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
      this.errorHandlingService.handleException(
        'HomeService/findCrewByCategory',
        e,
      );
    }
  }
}
