import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoticeRepository {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  async findNotice(): Promise<any> {
    const notice = await this.noticeRepository
      .createQueryBuilder('notice') // Notice 엔티티와 조인
      .leftJoinAndSelect('notice.userId', 'users') // Users 엔티티와 조인
      .leftJoinAndSelect('notice.crewId', 'crew') // Crew 엔티티와 조인
      .select([
        'notice.noticeTitle',
        'notice.noticeDDay',
        'users.profileImage', // Users 엔티티의 profileImage 필드 가정
      ])
      .getMany();
    return notice;
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
