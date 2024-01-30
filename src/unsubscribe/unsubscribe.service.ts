import { Injectable } from '@nestjs/common';
import { UnsubscribeRepository } from '@src/unsubscribe/unsubscribe.repository';
import { UsersRepository } from '@src/users/users.repository';
import { Cron } from '@nestjs/schedule';
import { TopicRepository } from '@src/topic/topic.repository';
import { Unsubscribe } from './entities/unsubscribe.entity';
import { DeleteResult } from 'typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class UnsubscribeService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private unsubscribeRepository: UnsubscribeRepository,
    private usersRepository: UsersRepository,
    private topicRepository: TopicRepository,
  ) {}

  @Cron('0 0 * * * *')
  async toBeDeletedCron() {
    try {
      const toBeDeletedAccounts =
        await this.unsubscribeRepository.findAllUnsubscribe();
      if (toBeDeletedAccounts.length > 0) {
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
      this.errorHandlingService.handleException(
        'UnsubscribeService/ToBeDeletedCron',
        e,
      );
    }
  }

  /* 탈퇴 대기 계정 조회*/
  async findAllUnsubscribe(): Promise<Unsubscribe[]> {
    try {
      return await this.unsubscribeRepository.findAllUnsubscribe();
    } catch (e) {
      this.errorHandlingService.handleException(
        'UnsubscribeService/findAllUnsubscribe',
        e,
      );
    }
  }

  /* 탈퇴 대기 계정 하나 조회 */
  async findOneUnsubscribe(userId: any): Promise<Unsubscribe> {
    try {
      return await this.unsubscribeRepository.findOneUnsubscribe(userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'UnsubscribeService/findOneUnsubscribe',
        e,
      );
    }
  }

  /* 탈퇴 대기 등록 */
  async createUnsubscribe(userId: number): Promise<Unsubscribe> {
    try {
      return await this.unsubscribeRepository.createUnsubscribe(userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'UnsubscribeService/createUnsubscribe',
        e,
      );
    }
  }

  /* 탈퇴 대기 취소 */
  async deleteUnsubscribe(userId: number): Promise<DeleteResult> {
    try {
      return await this.unsubscribeRepository.deleteUnsubscribe(userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'UnsubscribeService/deleteUnsubscribe',
        e,
      );
    }
  }
}
