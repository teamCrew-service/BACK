import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { EditNoticeDto } from './dto/editNotice.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  // 공지사항 조회
  async findNotice(userId: number): Promise<any> {
    const notices = await this.noticeRepository
      .createQueryBuilder('notice')
      .leftJoinAndSelect('notice.userId', 'users') // users 테이블과 조인하여 profileImage를 가져옴
      .leftJoin('notice.crewId', 'crew') // crew 테이블과의 join
      .leftJoin('crew.member', 'member') // crew와 member 테이블과의 join
      .where('member.userId = :userId', { userId }) // 해당 userId를 가진 멤버만 필터링
      .select(['notice.noticeTitle', 'notice.noticeDDay', 'users.profileImage']) // 필요한 필드만 선택
      .getMany();

    return notices;
  }

  // 공지사항 생성
  async createNotice(
    createNoticeDto: CreateNoticeDto,
    userId: number,
    crewId: number,
  ): Promise<Notice> {
    console.log('Inside createNotice Repository', createNoticeDto);
    const notice = new Notice();
    notice.userId = userId;
    notice.crewId = crewId;
    notice.noticeTitle = createNoticeDto.noticeTitle;
    notice.noticeContent = createNoticeDto.noticeContent;
    notice.noticeDDay = createNoticeDto?.noticeDDay;
    notice.noticeAddress = createNoticeDto.noticeAddress;

    const createdNotice = await this.noticeRepository.save(notice);

    return createdNotice;
  }

  // 공지사항 수정
  async editNotice(
    editNoticeDto: EditNoticeDto,
    userId: number,
    crewId: number,
    noticeId: number,
  ): Promise<any> {
    const notice = await this.noticeRepository.findOne({
      where: { noticeId, userId, crewId },
    });

    // 수정할 필드만 선택적으로 업데이트
    notice.noticeTitle = editNoticeDto.noticeTitle || notice.noticeTitle;
    notice.noticeAddress = editNoticeDto.noticeAddress || notice.noticeAddress;
    notice.noticeDDay = editNoticeDto.noticeDDay || notice.noticeDDay;
    notice.noticeContent = editNoticeDto.noticeContent || notice.noticeContent;

    const updatedNotice = await this.noticeRepository.save(notice);

    return updatedNotice;
  }

  // 공지사항 상세 조회
  async findNoticeDetail(noticeId: number, crewId: number): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .leftJoin('notice.crewId', 'crew') // crew 테이블과의 join
      .leftJoin('crew.member', 'member') // crew와 member 테이블과의 join
      .where('notice.noticeId = :noticeId', { noticeId }) // 해당 noticeId를 가진 멤버만 필터링
      .andWhere('crew.crewId = :crewId', { crewId }) // 해당 crewId를 가진 멤버만 필터링
      .select([
        'notice.noticeTitle',
        'notice.noticeDDay',
        'notice.noticeContent',
        'notice.noticeAddress',
      ]) // 필요한 필드만 선택
      .getOne();

    return notice;
  }

  // 공지사항 삭제
  async deleteNotice(noticeId: number, crewId: number): Promise<any> {
    const notice = await this.noticeRepository.findOne({
      where: { noticeId, crewId },
    });

    const deletedNotice = await this.noticeRepository.softRemove(notice); // soft delete

    return deletedNotice;
  }

  /* crew에 해당하는 notice 조회 */
  async findNoticeByCrew(crewId: number): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice')
      .select(['noticeTitle', 'noticeContent', 'noticeDDay', 'noticeAddress'])
      .where('notice.crewId = :id', { id: crewId })
      .getRawMany();
    return notice;
  }
}
