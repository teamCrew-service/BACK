import { Injectable } from '@nestjs/common';
// import { Crew } from 'src/crew/entities/crew.entity';
import { HomeRepository } from './home.repository';

@Injectable()
export class HomeService {
  constructor(private homeRepository: HomeRepository) {}

  // 내 주변 모임 찾기
  async getCrew(): Promise<any> {
    return this.homeRepository.getCrew();
  }

  // 내 주변 모임 찾기(카테고리별)
  async findCrewByCategoryAndMap(category: string): Promise<any> {
    return this.homeRepository.findCrewByCategoryAndMap(category);
  }

  // 카테고리별 모임 찾기
  async findCrewByCategory(category: string): Promise<any> {
    return this.homeRepository.findCrewByCategory(category);
  }
}
