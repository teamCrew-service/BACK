import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { EditNoticeDto } from './dto/editNotice.dto';

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
    crewId: number,
    noticeId: number,
    editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    try {
      const notice = await this.noticeRepository.editNotice(
        editNoticeDto,
        userId,
        crewId,
        noticeId,
      );
      return { notice, message: '공지사항 수정 성공' };
    } catch (error) {
      console.error('Error while editing notice:', error);
      throw new HttpException('공지사항 수정 실패', HttpStatus.BAD_REQUEST);
    }
  }

  // 공지사항 상세 조회
  async findNoticeDetail(noticeId: number, crewId: number): Promise<any> {
    try {
      const notice = await this.noticeRepository.findNoticeDetail(
        noticeId,
        crewId,
      );
      return { notice, message: '공지사항 상세 조회 성공' };
    } catch (error) {
      console.error('Error while finding notice detail:', error);
      throw new HttpException(
        '공지사항 상세 조회 실패',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 공지사항 삭제
  async deleteNotice(noticeId: number, crewId: number): Promise<any> {
    try {
      const notice = await this.noticeRepository.deleteNotice(noticeId, crewId);
      return { notice, message: '공지사항 삭제 성공' };
    } catch (error) {
      console.error('Error while deleting notice:', error);
      throw new HttpException('공지사항 삭제 실패', HttpStatus.BAD_REQUEST);
    }
  }

  /* crew 해당하는 notice 조회 */
  async findNoticeByCrew(crewId: number): Promise<any> {
    const notice = await this.noticeRepository.findNoticeByCrew(crewId);
    return notice;
  }
}
