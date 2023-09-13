import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/createNotice.dto';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  // 공지사항 조회
  async findNotice(userId: number) {
    const notice = await this.noticeRepository.findNotice(userId);

    // map 함수를 사용하여 notice를 순회하면서 필요한 데이터만 추출 후 새로운 배열로 반환
    const processedNotices = notice.map((notice) => {
      return {
        noticeTitle: notice.noticeTitle,
        noticeDDay: notice.noticeDDay,
        profileImage: notice.userId ? notice.userId.profileImage : null, // user.profileImage가 존재하지 않을 경우 null
      };
    });

    return processedNotices;
  }

  // 공지사항 생성
  async createNotice(
    createNoticeDto: CreateNoticeDto,
    userId: number,
    crewId: number,
  ): Promise<any> {
    try {
      const notice = await this.noticeRepository.createNotice(
        createNoticeDto,
        userId,
        crewId,
      );
      return { notice, message: '공지 등록 성공' };
    } catch (error) {
      throw new HttpException('공지 글 생성 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 공지사항 수정
  async editNotice(
    userId: number,
    // crewId: number,
    noticeId: number,
    editNoticeDto: any,
  ): Promise<any> {
    try {
      const message = await this.noticeRepository.editNotice(
        userId,
        // crewId,
        noticeId,
        editNoticeDto,
      );
      return { message };
    } catch (error) {
      console.error('Error while editing notice:', error);
      throw new HttpException('공지사항 수정 실패', HttpStatus.BAD_REQUEST);
    }
  }

  /* crew 해당하는 notice 조회 */
  async findNoticeByCrew(crewId: number): Promise<any> {
    const notice = await this.noticeRepository.findNoticeByCrew(crewId);
    return notice;
  }
}
