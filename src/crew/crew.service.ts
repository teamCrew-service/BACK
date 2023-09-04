import { Injectable } from '@nestjs/common';
import { CrewRepository } from './crew.repository';

@Injectable()
export class CrewService {
  constructor(private crewRepository: CrewRepository) {}

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    const crewList = await this.crewRepository.findByCategory(category);
    return crewList;
  }

  async createCrew(CreateCrewDto: any): Promise<any> {
    const crew = await this.crewRepository.createCrew(CreateCrewDto);
    return crew;
  }
  /* 모임 글 상세 조회(참여 전) */
  async findCrewDetail(crewId: number): Promise<any> {
    const crew = await this.crewRepository.findCrewDetail(crewId);

    return crew;
  }

  /* 참여한 모임 */
  async findCreatedCrew(userId: number): Promise<any> {
    const createdCrew = await this.crewRepository.findCreatedCrew(userId);
    return createdCrew;
  }
}
