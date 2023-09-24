import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notice } from './entities/notice.entity';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { EditNoticeDto } from './dto/editNotice.dto';

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
    const notice = new Notice();
    notice.userId = userId;
    notice.crewId = crewId;
    notice.noticeTitle = createNoticeDto.noticeTitle;
    notice.noticeContent = createNoticeDto.noticeContent;
    notice.noticeAddress = createNoticeDto.noticeAddress;
    notice.noticeDDay = createNoticeDto.noticeDDay;

    const createdNotice = await this.noticeRepository.save(notice);
    return createdNotice;
  }

  /* 공지 전체 조회 */
  async findAllNotice(crewId: number): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .select(['noticeTitle', 'noticeContent', 'noticeAddress', 'noticeDDay'])
      .where('notice.crewId = :crewId', { crewId })
      .getRawMany();
    return notice;
  }

  /* 공지 상세 조회 */
  async findNoticeDetail(crewId: number, noticeId: number): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .select(['noticeTitle', 'noticeContent', 'noticeAddress', 'noticeDDay'])
      .where('notice.crewId = :crewId', { crewId })
      .andWhere('notice.noticeId = :noticeId', { noticeId })
      .getRawOne();
    return notice;
  }

  /* 공지 수정 */
  async editNotice(
    crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .select(['noticeTitle', 'noticeContent', 'noticeAddress', 'noticeDDay'])
      .where('notice.crewId = :crewId', { crewId })
      .andWhere('notice.noticeId = :noticeId', { noticeId })
      .getRawOne();

    if (editNoticeDto.noticeTitle !== undefined) {
      notice.noticeTitle = editNoticeDto.noticeTitle;
    }
    if (editNoticeDto.noticeContent !== undefined) {
      notice.noticeContent = editNoticeDto.noticeContent;
    }
    if (editNoticeDto.noticeAddress !== undefined) {
      notice.noticeAddress = editNoticeDto.noticeAddress;
    }
    if (editNoticeDto.noticeDDay !== undefined) {
      notice.noticeDDay = editNoticeDto.noticeDDay;
    }

    const editedNotice = await this.noticeRepository.save(notice);

    return editedNotice;
  }

  /* 공지 삭제 */
  async deleteNotice(crewId: number, noticeId: number): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .select(['noticeTitle', 'noticeContent', 'noticeAddress', 'noticeDDay'])
      .where('notice.crewId = :crewId', { crewId })
      .andWhere('notice.noticeId = :noticeId', { noticeId })
      .getRawOne();

    const deletedNotice = await this.noticeRepository.softDelete(notice);
    return deletedNotice;
  }
}
