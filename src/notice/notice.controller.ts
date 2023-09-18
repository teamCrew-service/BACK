import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { CrewService } from 'src/crew/crew.service';
import { EditNoticeDto } from './dto/editNotice.dto';

@Controller('notice')
@ApiTags('Notice API')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly crewService: CrewService,
  ) {}

  /* 공지 등록 */
  @Post(':crewId/createNotice')
  @ApiOperation({
    summary: '공지 등록 API',
    description: '필요한 공지를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '공지 등록 성공',
  })
  @ApiBearerAuth('accessToken')
  async createNotice(
    @Param('crewId') crewId: number,
    @Body() createNoticeDto: CreateNoticeDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findCrewDetail(crewId);

      // 모임장이 아닌 경우
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '공지를 등록할 권한이 없습니다.' });
      }

      await this.noticeService.createNotice(userId, crewId, createNoticeDto);

      return res.status(HttpStatus.OK).json({ message: '공지 등록 완료' });
    } catch (e) {
      console.error(e);
      throw new Error('noticeController/createNotice');
    }
  }

  /* 공지 전체 조회 */
  @Get(':crewId')
  @ApiOperation({
    summary: '공지 전체 조회 API',
    description: 'crewId에 해당하는 공지를 모두 조회.',
  })
  @ApiResponse({
    status: 200,
    description: 'crewId에 해당하는 공지를 모두 조회.',
    schema: {
      example: {
        schedule: {
          noticeTitle: '일산 호수공원 런닝!!',
          noticeContent:
            '일산 호수공원 저녁 8시에 런닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
          noticeAddress: '일산 호수공원',
          noticeDDay: '2023-08-19T03:44:19.661Z',
          noticeLatitude: 23.010203,
          noticeLongitude: 106.102032,
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findAllNotice(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const notice = await this.noticeService.findAllNotice(crewId);
      if (!notice) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '조회된 공지가 없습니다.' });
      } else {
        return res.status(HttpStatus.OK).json({ notice });
      }
    } catch (e) {
      console.error(e);
      throw new Error('noticeController/findAllNotice');
    }
  }

  /* 공지 상세 조회 */
  @Get(':crewId/:noticeId')
  @ApiOperation({
    summary: '공지 상세 조회 API',
    description: 'noitceId에 해당하는 공지 글을 상세 조회.',
  })
  @ApiResponse({
    status: 200,
    description: 'noticeId에 해당하는 공지를 조회',
    schema: {
      example: {
        noticeTitle: '일산 호수공원 런닝!!',
        noticeContent:
          '일산 호수공원 저녁 8시에 런닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
        noticeAddress: '일산 호수공원',
        noticeDDay: '2023-08-19T03:44:19.661Z',
        noticeLatitude: 23.010203,
        noticeLongitude: 106.102032,
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findNoticeDetail(
    @Param('crewId') crewId: number,
    @Param('noticeId') noticeId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const notice = await this.noticeService.findNoticeDetail(
        crewId,
        noticeId,
      );
      if (!notice) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '공지가 존재하지 않습니다.' });
      } else {
        return res.status(HttpStatus.OK).json(notice);
      }
    } catch (e) {
      console.error(e);
      throw new Error('noticeController/findNoticeDetail');
    }
  }

  /* 공지 수정 */
  @Put('edit/:crewId/:noticeId')
  @ApiOperation({
    summary: '공지 수정 API',
    description: '원하는 공지를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공지 수정 성공',
  })
  @ApiBearerAuth('accessToken')
  async editNotice(
    @Body() editNoticeDto: EditNoticeDto,
    @Param('crewId') crewId: number,
    @Param('noticeId') noticeId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 글입니다.' });
      }
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '공지 수정 권한이 없습니다.' });
      }

      const editedNotice = await this.noticeService.editNotice(
        crewId,
        noticeId,
        editNoticeDto,
      );

      if (editedNotice.length < 1) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '공지 수정을 실패했습니다.' });
      } else {
        return res.status(HttpStatus.OK).json({ message: '공지 수정 성공' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('noticeController/editNotice');
    }
  }

  /* 공지 삭제 */
  @Delete('delete/:crewId/:noticeId')
  @ApiOperation({
    summary: '공지 삭제 API',
    description: '원하는 공지를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공지 삭제 성공',
  })
  @ApiBearerAuth('accessToken')
  async deleteNotice(
    @Param('crewId') crewId: number,
    @Param('noticeId') noticeId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 글입니다.' });
      }
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '공지 삭제 권한이 없습니다.' });
      }

      const deletedNotice = await this.noticeService.deleteNotice(
        crewId,
        noticeId,
      );

      if (deletedNotice.length < 1) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '공지 삭제를 실패했습니다.' });
      } else {
        return res.status(HttpStatus.OK).json({ message: '공지 삭제 성공' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('noticeController/deleteNotice');
    }
  }
}
