import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

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
  async findNotice(@Res() res: any): Promise<any> {
    try {
      // 다가오는 일정 리스트 조회
      const notice = await this.noticeService.findNotice();

      // 다가오는 일정 리스트 조회 결과가 없을 경우
      if (notice.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          errormessage: '다가오는 일정 리스트 조회 결과가 없습니다.',
        });
      }
      // 다가오는 일정 리스트 조회 결과가 있을 경우
      return res.status(HttpStatus.OK).json(notice);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `리스트 조회 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
