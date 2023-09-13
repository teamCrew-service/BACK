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
    // notice.noticeDDay = createNoticeDto?.noticeDDay;
    notice.noticeAddress = createNoticeDto.noticeAddress;

    try {
      await this.noticeRepository.save(notice);
      console.log('Notice saved successfully'); // 성공 로깅
    } catch (error) {
      console.error('Error saving notice:', error); // 에러 로깅
      throw new Error('Notice save failed');
    }
    return notice;
  }

  // 공지사항 수정
  async editNotice(
    userId: number,
    // crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    const notice = await this.noticeRepository.findOne({
      where: { noticeId },
      select: ['userId'],
    });

    console.log('Fetched notice:', notice);
    console.log('Type of notice.userId:', typeof notice.userId);
    console.log('Type of userId:', typeof userId);
    console.log('userId:', userId);

    // 공지사항 작성자가 아닐 경우
    if (notice.userId !== userId) {
      console.log('Authorship verification failed');
      throw new Error('작성자가 아닙니다.');
    }

    // 공지사항 수정
    notice.noticeTitle = editNoticeDto.noticeTitle;
    notice.noticeContent = editNoticeDto.noticeContent;
    // notice.noticeDDay = editNoticeDto.noticeDDay;
    notice.noticeAddress = editNoticeDto.noticeAddress;
    notice.updatedAt = new Date();

    try {
      await this.noticeRepository.save(notice);
      return '공지사항 수정 성공';
    } catch (error) {
      throw new Error('공지사항 수정 실패');
    }
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
