import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  // UseGuards,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { application } from 'express';
import { json } from 'stream/consumers';
// import { GoogleAuthGuard } from 'src/auth/guard/google-auth.guard';
// import { KakaoAuthGuard } from 'src/auth/guard/kakao-auth.guard';
// import { NaverAuthGuard } from 'src/auth/guard/naver-auth.guard';

@Controller('notice')
@ApiTags('Notice API')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // HTTP GET 요청에 대한 핸들러
  @Get('comingDate')
  @ApiOperation({
    summary: '다가오는 일정 리스트 조회 API',
    description: '다가오는 일정 리스트 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '다가오는 일정 리스트 조회합니다.',
    schema: {
      example: {
        noice: {
          noticeTitle: '퇴근 후 40분 걷기',
          noticeDDay: '2023-08-19T03:44:19.661Z',
        },
        participatedUser: { profileImage: 'URI' },
      },
    },
  })
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
