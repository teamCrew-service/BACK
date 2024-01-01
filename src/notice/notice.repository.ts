import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from '@src/notice/entities/notice.entity';
import { CreateNoticeDto } from '@src/notice/dto/createNotice.dto';
import { EditNoticeDto } from '@src/notice/dto/editNotice.dto';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectRepository(Notice) private noticeRepository: Repository<Notice>,
  ) {}

  /* 공지 등록 */
  async createNotice(
    userId: number,
    crewId: number,
    createNoticeDto: CreateNoticeDto,
  ): Promise<any> {
    try {
      const notice = new Notice();
      notice.userId = userId;
      notice.crewId = crewId;
      notice.noticeTitle = createNoticeDto.noticeTitle;
      notice.noticeContent = createNoticeDto.noticeContent;
      notice.noticeAddress = createNoticeDto.noticeAddress;
      notice.noticePlaceName = createNoticeDto.noticePlaceName;
      notice.noticeDDay = createNoticeDto.noticeDDay;
      notice.noticeLatitude = createNoticeDto.noticeLatitude;
      notice.noticeLongitude = createNoticeDto.noticeLongitude;

      const createdNotice = await this.noticeRepository.save(notice);
      return createdNotice;
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/createNotice');
    }
  }

  /* 공지 전체 조회 */
  async findAllNotice(crewId: number): Promise<any> {
    try {
      const notice = await this.noticeRepository
        .createQueryBuilder('notice')
        .select([
          'noticeId',
          'userId',
          'noticeTitle',
          'noticeContent',
          'noticeAddress',
          'noticePlaceName',
          'noticeDDay',
          'noticeLatitude',
          'noticeLongitude',
          'noticeIsDone',
          'createdAt',
        ])
        .where('notice.crewId = :crewId', { crewId })
        .andWhere('notice.deletedAt IS NULL')
        .orderBy('notice.noticeDDay', 'ASC')
        .getRawMany();
      return notice;
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/findAllNotice');
    }
  }

  /* 공지 상세 조회 */
  async findNoticeDetail(crewId: number, noticeId: number): Promise<any> {
    try {
      const notice = await this.noticeRepository
        .createQueryBuilder('notice')
        .select([
          'noticeId',
          'noticeTitle',
          'noticeContent',
          'noticeAddress',
          'noticePlaceName',
          'noticeDDay',
          'noticeLatitude',
          'noticeLongitude',
        ])
        .where('notice.crewId = :crewId', { crewId })
        .andWhere('notice.noticeId = :noticeId', { noticeId })
        .getRawOne();
      return notice;
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/findNoticeDetail');
    }
  }

  /* 공지 수정 */
  async editNotice(
    crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    try {
      const {
        noticeTitle,
        noticeContent,
        noticeAddress,
        noticePlaceName,
        noticeDDay,
        noticeLatitude,
        noticeLongitude,
      } = editNoticeDto;

      const editedNotice = await this.noticeRepository.update(
        { crewId, noticeId },
        {
          noticeTitle,
          noticeContent,
          noticeAddress,
          noticePlaceName,
          noticeDDay,
          noticeLatitude,
          noticeLongitude,
        },
      );

      return editedNotice;
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/editNotice');
    }
  }

  /* 공지 삭제 */
  async deleteNotice(crewId: number, noticeId: number): Promise<any> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      const deletedNotice = await this.noticeRepository
        .createQueryBuilder('notice')
        .update(Notice)
        .set({ deletedAt: today })
        .where('notice.crewId = :crewId', { crewId })
        .andWhere('notice.noticeId = :noticeId', { noticeId })
        .execute();

      return deletedNotice;
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/deleteNotice');
    }
  }

  /* 오늘 날짜 기준보다 날짜가 지난 공지를 찾아 IsDone을 true로 전환 */
  async updateNoticeIsDone(): Promise<any> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      await this.noticeRepository
        .createQueryBuilder('notice')
        .update(Notice)
        .set({ noticeIsDone: true })
        .where('notice.noticeDDay < :today', { today })
        .andWhere('notice.noticeIsDone = :noticeIsDone', {
          noticeIsDone: false,
        })
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/updateNoticeIsDone');
    }
  }

  /* 위임에 따라 완료되지 않은 공지 userId를 위임자 userId로 수정 */
  async delegateNotice(delegator: number, crewId: number): Promise<any> {
    try {
      await this.noticeRepository
        .createQueryBuilder('notice')
        .update(Notice)
        .set({ userId: delegator })
        .where('crewId = :crewId', { crewId })
        .andWhere('deletedAt IS NULL')
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/delegateNotice');
    }
  }

  /* crew 삭제에 따른 notice 삭제 */
  async deleteNoticeByCrew(crewId: number): Promise<any> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      const deleteNotice = await this.noticeRepository
        .createQueryBuilder('notice')
        .update(Notice)
        .set({ deletedAt: today })
        .where('crewId = :crewId', { crewId })
        .execute();

      return deleteNotice;
    } catch (e) {
      console.error(e);
      throw new Error('NoticeRepository/deleteNoticeByCrew');
    }
  }
}
