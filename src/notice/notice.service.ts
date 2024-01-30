import { Injectable } from '@nestjs/common';
import { NoticeRepository } from '@src/notice/notice.repository';
import { CreateNoticeDto } from '@src/notice/dto/createNotice.dto';
import { EditNoticeDto } from '@src/notice/dto/editNotice.dto';
import { Cron } from '@nestjs/schedule';
import { Notice } from '@src/notice/entities/notice.entity';
import { UpdateResult } from 'typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class NoticeService {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly noticeRepository: NoticeRepository,
  ) {}

  @Cron('0 0 * * * *') // cron을 이용해 scheduling
  // method가 자정에 맞춰 계속 noticeIsDone 부분을 scheduling
  async noticeCron() {
    try {
      await this.noticeRepository.updateNoticeIsDone();
    } catch (e) {
      this.errorHandlingService.handleException('NoticeService/noticeCron', e);
    }
  }

  /* 공지 등록 */
  async createNotice(
    userId: number,
    crewId: number,
    createNoticeDto: CreateNoticeDto,
  ): Promise<Notice> {
    try {
      return await this.noticeRepository.createNotice(
        userId,
        crewId,
        createNoticeDto,
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'NoticeService/createNotice',
        e,
      );
    }
  }

  /* 공지 전체 조회 */
  async findAllNotice(crewId: number): Promise<Notice[]> {
    try {
      return await this.noticeRepository.findAllNotice(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'NoticeService/findAllNotice',
        e,
      );
    }
  }

  /* 공지 상세 조회 */
  async findNoticeDetail(crewId: number, noticeId: number): Promise<Notice> {
    try {
      return await this.noticeRepository.findNoticeDetail(crewId, noticeId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'NoticeService/findNoticeDetail',
        e,
      );
    }
  }

  /* 공지 수정 */
  async editNotice(
    crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<UpdateResult> {
    try {
      return await this.noticeRepository.editNotice(
        crewId,
        noticeId,
        editNoticeDto,
      );
    } catch (e) {
      this.errorHandlingService.handleException('NoticeService/editNotice', e);
    }
  }

  /* 공지 삭제 */
  async deleteNotice(crewId: number, noticeId: number): Promise<UpdateResult> {
    try {
      return await this.noticeRepository.deleteNotice(crewId, noticeId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'NoticeService/deleteNotice',
        e,
      );
    }
  }

  /* 위임에 따라 완료되지 않은 공지 userId를 위임자 userId로 수정 */
  async delegateNotice(delegator: number, crewId: number): Promise<string> {
    try {
      await this.noticeRepository.delegateNotice(delegator, crewId);
      return '공지 위임 완료';
    } catch (e) {
      this.errorHandlingService.handleException(
        'NoticeService/delegateNotice',
        e,
      );
    }
  }

  /* crew 삭제에 따른 notice 삭제 */
  async deleteNoticeByCrew(crewId: number): Promise<UpdateResult> {
    try {
      return await this.noticeRepository.deleteNoticeByCrew(crewId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'NoticeService/deleteNoticeByCrew',
        e,
      );
    }
  }
}
