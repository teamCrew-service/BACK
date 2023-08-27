import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  // UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
// import { GoogleAuthGuard } from 'src/auth/guard/google-auth.guard';
// import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
// import { NaverAuthGuard } from 'src/auth/guard/naver-auth.guard';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // HTTP GET 요청에 대한 핸들러
  @Get('/comingDate')
  // @UseGuards(GoogleAuthGuard, KakaoAuthGuard, NaverAuthGuard)
  async getComingDate() {
    try {
      // 서비스를 통해 알림 정보 가져오기
      return await this.noticeService.getComingDate();
    } catch (error) {
      // 에러 발생 시, HTTP 500 응답 전송
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errorMessage: '리스트 조회 실패',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
