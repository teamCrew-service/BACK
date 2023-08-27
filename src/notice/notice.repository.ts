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
    try {
      const notice = await this.noticeRepository
        .createQueryBuilder('notice') // Notice 엔티티와 조인
        .leftJoinAndSelect('notice.user', 'user') // Users 엔티티와 조인
        .leftJoinAndSelect('notice.crew', 'crew') // Crew 엔티티와 조인
        .select([
          'notice.noticeTitle',
          'notice.noitceDDay',
          'user.profileImage', // Users 엔티티의 profileImage 필드 가정
        ])
        .getMany();

      return notice;
    } catch (error) {
      // 에러 발생 시, 에러 메시지를 예외로 던짐
      throw new Error('리스트 조회 실패');
    }
  }
}
