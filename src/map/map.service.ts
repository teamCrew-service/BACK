import { Injectable } from '@nestjs/common';
// import { Crew } from 'src/crew/entities/crew.entity';
import { MapRepository } from './map.repository';

@Injectable()
export class MapService {
  constructor(private mapRepository: MapRepository) {}

  // 내 주변 모임 찾기
  async getCrew(): Promise<any> {
    return this.mapRepository.getCrew();
  }

  // 내 주변 모임 찾기(카테고리별)
  async getCrewByCategory(category: string): Promise<any> {
    return this.mapRepository.getCrewByCategory(category);
  }
}
