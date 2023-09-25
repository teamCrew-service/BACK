import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { EditNoticeDto } from './dto/editNotice.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  @Cron('0 0 * * * *') // cron을 이용해 scheduling
  // method가 자정에 맞춰 계속 noticeIsDone 부분을 scheduling
  async noticeCron() {
    await this.noticeRepository.updateNoticeIsDone();
  }

  /* 공지 등록 */
  async createNotice(
    userId: number,
    crewId: number,
    createNoticeDto: CreateNoticeDto,
  ): Promise<any> {
    const notice = await this.noticeRepository.createNotice(
      userId,
      crewId,
      createNoticeDto,
    );
    return notice;
  }

  /* 공지 전체 조회 */
  async findAllNotice(crewId: number): Promise<any> {
    const notice = await this.noticeRepository.findAllNotice(crewId);
    return notice;
  }

  /* 공지 상세 조회 */
  async findNoticeDetail(crewId: number, noticeId: number): Promise<any> {
    const notice = await this.noticeRepository.findNoticeDetail(
      crewId,
      noticeId,
    );
    return notice;
  }

  /* 공지 수정 */
  async editNotice(
    crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    const editNotice = await this.noticeRepository.editNotice(
      crewId,
      noticeId,
      editNoticeDto,
    );
    return editNotice;
  }

  /* 공지 삭제 */
  async deleteNotice(crewId: number, noticeId: number): Promise<any> {
    const deletedNotice = await this.noticeRepository.deleteNotice(
      crewId,
      noticeId,
    );
    return deletedNotice;
  }
}
