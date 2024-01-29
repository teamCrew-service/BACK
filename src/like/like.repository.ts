import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '@src/like/entities/like.entity';
import { DeleteResult, Repository } from 'typeorm';
import LikedCrew from '@src/like/interface/likedCrew';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LikeRepository {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  /* 찜하기 */
  async likeCrew(crewId: number, userId: number): Promise<Like> {
    try {
      const like = new Like();
      like.crewId = crewId;
      like.userId = userId;
      await this.likeRepository.save(like);
      return like;
    } catch (e) {
      this.handleException('LikeRepository/likeCrew', e);
    }
  }

  /* 찜 취소하기 */
  async cancelLikeCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.likeRepository
        .createQueryBuilder('like')
        .delete()
        .from(Like)
        .where('like.crewId = :crewId', { crewId })
        .andWhere('like.userId = :userId', { userId })
        .execute();
    } catch (e) {
      this.handleException('LikeRepository/cancelLikeCrew', e);
    }
  }

  /* 찜 조회하기 */
  async findLikedCrew(userId: number): Promise<LikedCrew[]> {
    try {
      return await this.likeRepository
        .createQueryBuilder('like')
        .leftJoin('crew', 'crew', 'crew.crewId = like.crewId')
        .leftJoin('member', 'member', 'member.crewId = like.crewId')
        .select([
          'crew.crewId AS crewId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.crewDDay AS crewDDay',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(member.crewId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
        ])
        .where('like.userId = :userId', { userId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .groupBy('like.likeId')
        .getRawMany();
    } catch (e) {
      this.handleException('LikeRepository/findLikedCrew', e);
    }
  }

  /* crew를 찜한 횟수 확인 */
  async countLikedCrew(crewId: number): Promise<Like[]> {
    try {
      return await this.likeRepository
        .createQueryBuilder('like')
        .select(['likeId', 'crewId'])
        .where('like.crewId = :crewId', { crewId })
        .getRawMany();
    } catch (e) {
      this.handleException('LikeRepository/countLikedCrew', e);
    }
  }

  /* user가 crew를 찜했는지 확인하기 */
  async confirmLiked(crewId: number, userId: number): Promise<Like> {
    try {
      return await this.likeRepository
        .createQueryBuilder('like')
        .select(['likeId', 'crewId', 'userId'])
        .where('like.crewId = :crewId', { crewId })
        .andWhere('like.userId = :userId', { userId })
        .getRawOne();
    } catch (e) {
      this.handleException('LikeRepository/confirmLiked', e);
    }
  }

  /* 좋아요 삭제 */
  async deleteLike(crewId: number): Promise<DeleteResult> {
    try {
      return await this.likeRepository
        .createQueryBuilder('like')
        .delete()
        .from(Like)
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.handleException('LikeRepository/deleteLike', e);
    }
  }
}
