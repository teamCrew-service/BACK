import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { LikeRepository } from '@src/like/like.repository';
import { Like } from '@src/like/entities/like.entity';
import { DeleteResult } from 'typeorm';
import LikedCrew from '@src/like/interface/likedCrew';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LikeService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private likeRepository: LikeRepository,
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
      return await this.likeRepository.likeCrew(crewId, userId);
    } catch (e) {
      this.handleException('LikeService/likeCrew', e);
    }
  }

  /* 찜 취소하기 */
  async cancelLikeCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.likeRepository.cancelLikeCrew(crewId, userId);
    } catch (e) {
      this.handleException('LikeService/cancelLikeCrew', e);
    }
  }

  /* 찜 조회하기 */
  async findLikedCrew(userId: number): Promise<LikedCrew[]> {
    try {
      return await this.likeRepository.findLikedCrew(userId);
    } catch (e) {
      this.handleException('LikeService/findLikedCrew', e);
    }
  }

  /* crew를 찜한 횟수 확인 */
  async countLikedCrew(crewId: number): Promise<number> {
    try {
      const likedCrew = await this.likeRepository.countLikedCrew(crewId);

      const likeCount = likedCrew.length;
      return likeCount;
    } catch (e) {
      this.handleException('LikeService/countLikedCrew', e);
    }
  }

  /* user가 crew를 찜했는지 확인하기 */
  async confirmLiked(crewId: number, userId: number): Promise<Like> {
    try {
      return await this.likeRepository.confirmLiked(crewId, userId);
    } catch (e) {
      this.handleException('LikeService/confirmLiked', e);
    }
  }

  /* 좋아요 삭제 */
  async deleteLike(crewId: number): Promise<DeleteResult> {
    try {
      return await this.likeRepository.deleteLike(crewId);
    } catch (e) {
      this.handleException('LikeService/likeCrew', e);
      console.error(e);
      throw new Error('LikeService/deleteLike');
    }
  }
}
