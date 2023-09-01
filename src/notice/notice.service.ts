import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  async getComingDate() {
    try {
      const notice = await this.noticeRepository.findNotice();

      const processedNotices = notice.map((notice) => {
        return {
          noticeTitle: notice.noticeTitle,
          noticeDDay: notice.noticeDDay,
          profileImage: notice.userId.profileImage,
        };
      });

      console.log('service');
      console.log(processedNotices);

      return processedNotices;
    } catch (error) {
      console.error(error); // 로깅
      throw new InternalServerErrorException(
        `리스트 조회 실패: ${error.message}`,
      );
    }
  }
}
