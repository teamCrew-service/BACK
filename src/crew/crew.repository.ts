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
    const crewList = await this.crewRepository.find({ where: { category } });
    return crewList;
  }

  async createCrew(CreateCrewDto: any): Promise<any> {
    const crew = this.crewRepository.create(CreateCrewDto);
    await this.crewRepository.save(crew);
  }
  /* 모임 글 상세 조회(참여 전) */
  async findCrewDetail(crewId: number): Promise<any> {
    const crew = await this.crewRepository
      .createQueryBuilder('crew')
      .select([
        'crewId',
        'userId',
        'category',
        'crewAddress',
        'crewType',
        'crewDDay',
        'crewMemberInfo',
        'crewAgeInfo',
        'crewSignup',
        'crewTitle',
        'crewContent',
        'thumbnail',
        'crewMaxMember',
        'latitude',
        'longtitude',
        'deletedAt',
      ])
      .where('crew.crewId = :id', { id: crewId })
      .getRawOne();

    return crew;
  }

  async findCreatedCrew(userId: number): Promise<any> {
    const createdCrew = await this.crewRepository
      .createQueryBuilder('crew')
      .select(['crewId', 'category', 'crewType', 'crewAddress', 'crewTitle'])
      .where('crew.userId = :id', { id: userId })
      .getRawMany();
    return createdCrew;
  }
}
