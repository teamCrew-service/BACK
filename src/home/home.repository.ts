import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crew } from '@src/crew/entities/crew.entity';
import { Repository } from 'typeorm';
import GetCrew from '@src/home/interface/getCrew';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class HomeRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Crew)
    private mapRepository: Repository<Crew>,
  ) {}

  // 내 주변 모임 찾기
  async getCrew(userId: number): Promise<GetCrew[]> {
    try {
      return await this.mapRepository
        .createQueryBuilder('crew')
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .leftJoin(
          'like',
          'like',
          'like.crewId = crew.crewId AND like.userId = :userId',
          { userId },
        )
        .select([
          'crew.crewId AS crewId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.thumbnail AS thumbnail',
          'crew.crewDDay AS crewDDay',
          'crew.crewAddress AS crewAddress',
          'crew.crewMaxMember AS crewMaxMember',
          'crew.latitude AS latitude',
          'crew.longtitude AS longtitude',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'COUNT(like.userId) > 0 AS likeCheck',
        ])
        .where('crew.userId != :userId', { userId })
        .andWhere('(member.userId != :userId OR member.userId IS NULL)')
        .andWhere('crew.deletedAt IS NULL')
        .groupBy('crew.crewId')
        .getRawMany();
    } catch (e) {
      this.errorHandlingService.handleException('HomeRepository/getCrew', e);
    }
  }

  // 내 주변 모임 찾기(카테고리별)
  async findCrewByCategoryAndMap(
    category: string,
    userId: number,
  ): Promise<GetCrew[]> {
    try {
      return await this.mapRepository
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
          'crew.latitude',
          'crew.longtitude',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'COUNT(like.userId) > 0 AS likeCheck',
        ])
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .leftJoin(
          'like',
          'like',
          'like.crewId = crew.crewId AND like.userId = :userId',
          { userId },
        )
        .groupBy('crew.crewId')
        .where('crew.category = :category', { category })
        .andWhere('crew.userId != :userId', { userId })
        .andWhere('(member.userId != :userId OR member.userId IS NULL)')
        .andWhere('crew.deletedAt IS NULL')
        .getRawMany();
    } catch (e) {
      this.errorHandlingService.handleException(
        'HomeRepository/findCrewByCategoryAndMap',
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
      return await this.mapRepository
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
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'COUNT(like.userId) > 0 AS likeCheck',
        ])
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .leftJoin(
          'like',
          'like',
          'like.crewId = crew.crewId AND like.userId = :userId',
          { userId },
        )
        .groupBy('crew.crewId')
        .where('crew.category = :category', { category })
        .andWhere('crew.userId != :userId', { userId })
        .andWhere('(member.userId != :userId OR member.userId IS NULL)')
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('like.userId', 'DESC')
        .getRawMany();
    } catch (e) {
      this.errorHandlingService.handleException(
        'HomeRepository/findCrewByCategory',
        e,
      );
    }
  }
}
