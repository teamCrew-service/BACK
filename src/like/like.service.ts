import { Injectable } from '@nestjs/common';
import { LikeRepository } from '@src/like/like.repository';
import { Like } from '@src/like/entities/like.entity';
import { DeleteResult } from 'typeorm';
import LikedCrew from '@src/like/interface/likedCrew';

@Injectable()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  /* 찜하기 */
  async likeCrew(crewId: number, userId: number): Promise<Like> {
    try {
      return await this.likeRepository.likeCrew(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('LikeService/likeCrew');
    }
  }

  /* 찜 취소하기 */
  async cancelLikeCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.likeRepository.cancelLikeCrew(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('LikeService/cancelLikeCrew');
    }
  }

  /* 찜 조회하기 */
  async findLikedCrew(userId: number): Promise<LikedCrew[]> {
    try {
      return await this.likeRepository.findLikedCrew(userId);
    } catch (e) {
      console.error(e);
      throw new Error('LikeService/findLikedCrew');
    }
  }

  /* crew를 찜한 횟수 확인 */
  async countLikedCrew(crewId: number): Promise<number> {
    try {
      const likedCrew = await this.likeRepository.countLikedCrew(crewId);

      const likeCount = likedCrew.length;
      return likeCount;
    } catch (e) {
      console.error(e);
      throw new Error('LikeService/countLikedCrew');
    }
  }

  /* user가 crew를 찜했는지 확인하기 */
  async confirmLiked(crewId: number, userId: number): Promise<Like> {
    try {
      return await this.likeRepository.confirmLiked(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('LikeService/confirmLiked');
    }
  }

  /* 좋아요 삭제 */
  async deleteLike(crewId: number): Promise<DeleteResult> {
    try {
      return await this.likeRepository.deleteLike(crewId);
    } catch (e) {
      console.error(e);
      throw new Error('LikeService/deleteLike');
    }
  }
}
