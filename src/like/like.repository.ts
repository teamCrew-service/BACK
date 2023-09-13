import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
  ) {}

  /* 찜하기 */
  async likeCrew(crewId: number, userId: number): Promise<any> {
    const like = new Like();
    like.crewId = crewId;
    like.userId = userId;
    await this.likeRepository.save(like);
    return like;
  }

  /* 찜 취소하기 */
  async cancelLikeCrew(crewId: number, userId: number): Promise<any> {
    const like = await this.likeRepository
      .createQueryBuilder('like')
      .select(['likeId', 'crewId', 'userId'])
      .where('like.crewId = :crewId', { crewId })
      .andWhere('like.userId = :userId', { userId })
      .getRawOne();
    const caceledLike = await this.likeRepository.remove(like);
    return caceledLike;
  }

  /* 찜 조회하기 */
  async findLikedCrew(userId: number): Promise<any> {
    const likedCrew = await this.likeRepository
      .createQueryBuilder('like')
      .select(['likeId', 'crewId'])
      .where('like.userId = :userId', { userId })
      .getRawMany();
    return likedCrew;
  }
}
