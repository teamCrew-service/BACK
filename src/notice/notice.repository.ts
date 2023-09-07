import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { CreateNoticeDto } from './dto/createnotice.dto';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

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

  async createNotice(createNoticeDto: CreateNoticeDto): Promise<Notice> {
    const notice = new Notice();
    Object.assign(notice, createNoticeDto);
    await this.noticeRepository.save(notice);
    return notice;
  }
}
