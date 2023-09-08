import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  async findNotice() {
    const notice = await this.noticeRepository.findNotice();

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

  /* crew 해당하는 notice 조회 */
  async findNoticeByCrew(crewId: number): Promise<any> {
    const notice = await this.noticeRepository.findNoticeByCrew(crewId);
    return notice;
  }
}
