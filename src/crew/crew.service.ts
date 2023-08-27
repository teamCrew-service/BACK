import { Injectable } from '@nestjs/common';
import { CrewRepository } from './crew.repository';

@Injectable()
export class CrewService {
  constructor(private crewRepository: CrewRepository) {}

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    const crewList = this.crewRepository.findByCategory(category);
    return crewList;
  }
}
