import { Injectable } from '@nestjs/common';
import { CrewService } from 'src/crew/crew.service';

@Injectable()
export class HomeService {
  constructor(private crewService: CrewService) {}

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    const crewList = this.crewService.findByCategory(category);
    return crewList;
  }
}
