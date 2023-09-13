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
}
