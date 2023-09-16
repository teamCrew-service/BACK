import {
  Controller,
  Get,
  Post,
  Put,
  HttpException,
  HttpStatus,
  Request,
  Res,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { EditNoticeDto } from './dto/editNotice.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';

@Controller('notice')
@ApiTags('Notice API')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 공지사항 조회
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
      const userId = res.locals.user ? res.locals.user.userId : null;
      const notice = await this.noticeService.findNotice(userId);

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

  // 공지사항 생성
  @Post('/:crewId/notices')
  async createNotice(
    @Param('crewId') crewId: number,
    @Body() createNoticeDto: CreateNoticeDto,
    @Res() res: any,
  ): Promise<any> {
    const userId = res.locals.user ? res.locals.user.userId : null;

    const result = await this.noticeService.createNotice(
      createNoticeDto,
      userId,
      crewId,
    );

    return res.json(result);
  }

  // 공지사항 수정
  @Put('edit/:crewId/:noticeId')
  async editNotice(
    @Request() req,
    @Res() res: any,
    @Param('crewId') crewId: number,
    @Param('noticeId') noticeId: number,
    @Body() editNoticeDto: EditNoticeDto,
  ): Promise<any> {
    const userId = res.locals.user ? res.locals.user.userId : null;
    const result = await this.noticeService.editNotice(
      userId,
      crewId,
      noticeId,
      editNoticeDto,
    );
    return res.json(result);
  }

  // 공지사항 상세 조회
  @Get('detail/:crewId/:noticeId')
  async findNoticeDetail(
    @Param('noticeId') noticeId: number,
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const notice = await this.noticeService.findNoticeDetail(
        noticeId,
        crewId,
      );
      return res.status(HttpStatus.OK).json(notice);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `공지사항 상세 조회 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 공지사항 삭제
  @Delete('del/:crewId/:noticeId')
  async deleteNotice(
    @Param('crewId') crewId: number,
    @Param('noticeId') noticeId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const result = await this.noticeService.deleteNotice(noticeId, crewId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error(error); // 로깅
      throw new HttpException(
        `공지사항 삭제 실패: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
