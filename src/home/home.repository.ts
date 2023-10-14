import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crew } from 'src/crew/entities/crew.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HomeRepository {
  constructor(
    @InjectRepository(Crew)
    private mapRepository: Repository<Crew>,
  ) {}

  // 내 주변 모임 찾기
  async getCrew(userId: number): Promise<any> {
    const crew = await this.mapRepository
      .createQueryBuilder('crew')
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .leftJoin(
        'like',
        'like',
        'like.crewId = crew.crewId AND like.userId = :userId',
        { userId },
      )
      .select([
        'crew.crewId',
        'crew.category',
        'crew.crewType',
        'crew.crewTitle',
        'crew.thumbnail',
        'crew.crewDDay',
        'crew.crewAddress',
        'crew.crewMaxMember',
        'crew.latitude',
        'crew.longtitude',
        'COUNT(member.crewId) AS crewAttendedMember',
        'COUNT(like.userId) > 0 AS likeCheck',
      ])
      .andWhere('crew.deletedAt IS NULL')
      .groupBy('crew.crewId')
      .getRawMany();

    return crew;
  }

  // 내 주변 모임 찾기(카테고리별)
  async findCrewByCategoryAndMap(category: string): Promise<any> {
    const crew = await this.mapRepository
      .createQueryBuilder('crew')
      .select([
        'crew.crewId',
        'crew.category',
        'crew.crewType',
        'crew.crewTitle',
        'crew.thumbnail',
        'crew.crewDDay',
        'crew.crewAddress',
        'crew.crewMaxMember',
        'crew.latitude',
        'crew.longtitude',
        'COUNT(member.crewId) AS crewAttendedMember',
        'COUNT(like.userId) > 0 AS likeCheck',
      ])
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .leftJoin('like', 'like', 'like.crewId = crew.crewId')
      .groupBy('crew.crewId')
      .where('crew.category = :category', { category })
      .andWhere('crew.deletedAt IS NULL')
      .getRawMany();

    return crew;
  }

  // 카테고리별 모임 찾기
  async findCrewByCategory(category: string, userId: number): Promise<any> {
    const crew = await this.mapRepository
      .createQueryBuilder('crew')
      .select([
        'crew.crewId',
        'crew.category',
        'crew.crewType',
        'crew.crewTitle',
        'crew.crewContent',
        'crew.thumbnail',
        'crew.crewDDay',
        'crew.crewAddress',
        'crew.crewMaxMember',
        'COUNT(member.crewId) AS crewAttendedMember',
      ])
      .leftJoin('member', 'member', 'member.crewId = crew.crewId')
      .leftJoin('like', 'like', 'like.crewId = crew.crewId')
      .groupBy('crew.crewId')
      .where('crew.category = :category', { category })
      .andWhere('crew.userId != :userId', { userId })
      .andWhere('crew.deletedAt IS NULL')
      .orderBy('like.userId', 'DESC')
      .getRawMany();

    return crew;
  }
}
