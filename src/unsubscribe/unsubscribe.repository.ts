import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unsubscribe } from '@src/unsubscribe/entities/unsubscribe.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class UnsubscribeRepository {
  constructor(
    @InjectRepository(Unsubscribe)
    private unsubscribeRepository: Repository<Unsubscribe>,
  ) {}

  /* 탈퇴를 원하는 계정 조회 */
  async findAllUnsubscribe(): Promise<Unsubscribe[]> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      return await this.unsubscribeRepository
        .createQueryBuilder('unsubscribe')
        .where('unsubscribe.toBeDeletedDay <= :today', { today })
        .select(['userId', 'toBeDeletedDay'])
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeRepository/findAllUnsubscribe');
    }
  }

  /* 탈퇴를 원하는 계정 하나 조회 */
  async findOneUnsubscribe(userId: any): Promise<Unsubscribe> {
    try {
      return await this.unsubscribeRepository
        .createQueryBuilder('unsubscribe')
        .where('unsubscribe.userId = :userId', { userId })
        .select(['userId', 'toBeDeletedDay'])
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeRepository/findOneUnsubscribe');
    }
  }

  /* 탈퇴 대기 등록 */
  async createUnsubscribe(userId: number): Promise<Unsubscribe> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      const unsubscribe = new Unsubscribe();
      unsubscribe.userId = userId;
      unsubscribe.toBeDeletedDay = today;
      await this.unsubscribeRepository.save(unsubscribe);
      return unsubscribe;
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeRepository/createUnsubscribe');
    }
  }

  /* 탈퇴 대기 취소  */
  async deleteUnsubscribe(userId: number): Promise<DeleteResult> {
    try {
      return this.unsubscribeRepository
        .createQueryBuilder('unsubscribe')
        .delete()
        .from(Unsubscribe)
        .where('unsubscribe.userId = :userId', { userId })
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeRepository/deleteUnsubscribe');
    }
  }
}
