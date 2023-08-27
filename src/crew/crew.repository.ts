import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crew } from './entities/crew.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CrewRepository {
  constructor(
    @InjectRepository(Crew) private crewRepository: Repository<Crew>,
  ) {}

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<any> {
    const crewList = this.crewRepository.find({ where: { category } });
    return crewList;
  }

  async createCrew(CreateCrewDto: any): Promise<any> {
    const crew = await this.crewRepository.create(CreateCrewDto);
    await this.crewRepository.save(crew);
    return crew;
  }
}
