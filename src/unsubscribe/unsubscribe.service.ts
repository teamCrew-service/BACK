import { Injectable } from '@nestjs/common';
import { UnsubscribeRepository } from '@src/unsubscribe/unsubscribe.repository';
import { UsersRepository } from '@src/users/users.repository';
import { Cron } from '@nestjs/schedule';
import { TopicRepository } from '@src/topic/topic.repository';

@Injectable()
export class UnsubscribeService {
  constructor(
    private unsubscribeRepository: UnsubscribeRepository,
    private usersRepository: UsersRepository,
    private topicRepository: TopicRepository,
  ) {}

  @Cron('0 0 * * * *')
  async toBeDeletedCron() {
    try {
      const toBeDeletedAccounts =
        await this.unsubscribeRepository.findAllUnsubscribe();
      if (toBeDeletedAccounts > 0) {
        const deleteAccounts = toBeDeletedAccounts.map((account) =>
          this.usersRepository.deleteAccount(account.userId),
        );
        await Promise.all(deleteAccounts);

        const deleteTopics = toBeDeletedAccounts.map((account) =>
          this.topicRepository.deleteTopic(account.userId),
        );
        await Promise.all(deleteTopics);

        const deleteUnsubscribe = toBeDeletedAccounts.map((account) =>
          this.unsubscribeRepository.deleteUnsubscribe(account.userId),
        );
        await Promise.all(deleteUnsubscribe);
      }
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeService/ToBeDeletedCron');
    }
  }

  /* 탈퇴 대기 계정 조회*/
  async findAllUnsubscribe(): Promise<any> {
    try {
      const toBeDeletedAccounts = await this.findAllUnsubscribe();
      return toBeDeletedAccounts;
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeService/findAllUnsubscribe');
    }
  }

  /* 탈퇴 대기 계정 하나 조회 */
  async findOneUnsubscribe(userId: any): Promise<any> {
    try {
      const toBeDeletedAccount =
        await this.unsubscribeRepository.findOneUnsubscribe(userId);
      return toBeDeletedAccount;
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeService/findOneUnsubscribe');
    }
  }

  /* 탈퇴 대기 등록 */
  async createUnsubscribe(userId: number): Promise<any> {
    try {
      const unsubscribe = await this.unsubscribeRepository.createUnsubscribe(
        userId,
      );
      return unsubscribe;
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeService/createUnsubscribe');
    }
  }

  /* 탈퇴 대기 취소 */
  async deleteUnsubscribe(userId: number): Promise<any> {
    try {
      const account = await this.unsubscribeRepository.deleteUnsubscribe(
        userId,
      );
      return account;
    } catch (e) {
      console.error(e);
      throw new Error('UnsubscribeService/deleteUnsubscribe');
    }
  }
}
