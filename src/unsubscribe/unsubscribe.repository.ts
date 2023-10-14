import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unsubscribe } from './entities/unsubscribe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnsubscribeRepository {
  constructor(
    @InjectRepository(Unsubscribe)
    private unsubscribeRepository: Repository<Unsubscribe>,
  ) {}

  /* 탈퇴를 원하는 계정 조회 */
  async findAllUnsubscribe(): Promise<any> {
    const koreaTimezoneOffset = 9 * 60;
    const currentDate = new Date();
    const today = new Date(currentDate.getTime() + koreaTimezoneOffset * 60000);
    const toBeDeletedAccounts = await this.unsubscribeRepository
      .createQueryBuilder('unsubscribe')
      .where('unsubscribe.toBeDeletedDay <= :today', { today })
      .select(['userId', 'toBeDeletedDay'])
      .getRawMany();

    return toBeDeletedAccounts;
  }

  /* 탈퇴를 원하는 계정 하나 조회 */
  async findOneUnsubscribe(userId: any): Promise<any> {
    const toBeDeletedAccount = await this.unsubscribeRepository
      .createQueryBuilder('unsubscribe')
      .where('unsubscribe.userId = :userId', { userId })
      .select(['userId', 'toBeDeletedDay'])
      .getRawOne();

    return toBeDeletedAccount;
  }

  /* 탈퇴 대기 등록 */
  async createUnsubscribe(userId: number): Promise<any> {
    const koreaTimezoneOffset = 9 * 60;
    const currentDate = new Date();
    const today = new Date(currentDate.getTime() + koreaTimezoneOffset * 60000);
    const unsubscribe = new Unsubscribe();
    unsubscribe.userId = userId;
    unsubscribe.toBeDeletedDay = today;
    const account = await this.unsubscribeRepository.save(unsubscribe);
    return account;
  }

  /* 탈퇴 대기 취소  */
  async deleteUnsubscribe(userId: number): Promise<any> {
    const account = this.unsubscribeRepository
      .createQueryBuilder('unsubscribe')
      .delete()
      .from(Unsubscribe)
      .where('userId = :userId', { userId })
      .execute();
    return account;
  }
}
