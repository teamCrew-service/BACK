import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';

@Injectable()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  /* 찜하기 */
  async likeCrew(crewId: number, userId: number): Promise<any> {
    const like = await this.likeRepository.likeCrew(crewId, userId);
    return like;
  }

  /* 찜 취소하기 */
  async cancelLikeCrew(crewId: number, userId: number): Promise<any> {
    const caceledLike = await this.likeRepository.cancelLikeCrew(
      crewId,
      userId,
    );
    return caceledLike;
  }

  /* 찜 조회하기 */
  async findLikedCrew(userId: number): Promise<any> {
    const likedCrewId = await this.likeRepository.findLikedCrew(userId);
    return likedCrewId;
  }

  /* crew를 찜한 횟수 확인 */
  async countLikedCrew(crewId: number): Promise<any> {
    const likedCrew = await this.likeRepository.countLikedCrew(crewId);

    const likeCount = likedCrew.length;
    return likeCount;
  }

  /* user가 crew를 찜했는지 확인하기 */
  async confirmLiked(crewId: number, userId: number): Promise<any> {
    const like = await this.likeRepository.confirmLiked(crewId, userId);
    return like;
  }

  /* 좋아요 삭제 */
  async deleteLike(crewId: number): Promise<any> {
    const deleteLike = await this.likeRepository.deleteLike(crewId);
    return deleteLike;
  }
}
