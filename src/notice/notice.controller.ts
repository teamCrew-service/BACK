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
import { VoteFormService } from 'src/voteform/voteform.service';

@Controller('notice')
@ApiTags('Notice API')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly crewService: CrewService,
    private readonly voteFormService: VoteFormService,
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
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);

      // 권한 확인
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '공지를 등록할 권한이 없습니다.' });
      }

      // 공지 생성
      const notice = await this.noticeService.createNotice(
        userId,
        crewId,
        createNoticeDto,
      );
      // 생성된 공지 Id
      const noticeId = notice.noticeId;

      return res
        .status(HttpStatus.OK)
        .json({ message: '공지 등록 완료', noticeId });
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
        notice: {
          noticeTitle: '일산 호수공원 런닝!!',
          noticeContent:
            '일산 호수공원 저녁 8시에 런닝 모임 있습니다~~많이 오세요!! 회비는 1만원 입니다.',
          noticeAddress: '일산 호수공원',
          noticePlaceName: '고양체육관',
          noticeDDay: '2023-08-19T03:44:19.661Z',
        },
        voteForm: {
          voteFormId: 1,
          crewId: 1,
          voteTitle: '이번 주에 만날 사람. 투표 부탁드립니다!',
          voteContent: '홍대 근처 사시는 분들 함께 달리면 좋을 것 같아요!',
          voteEndDate: '2023-08-19T03:44:19.661Z',
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
      // user 정보 확인
      const { userId } = res.locals.user;
      // 공지, 투표 조회
      const notice = await this.noticeService.findAllNotice(crewId);
      const voteForm = await this.voteFormService.findAllVoteForm(
        crewId,
        userId,
      );

      // 모든 공지
      const allNotice = { notice, voteForm };
      return res.status(HttpStatus.OK).json(allNotice);
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
        noticePlaceName: '고양체육관',
        noticeDDay: '2023-08-19T03:44:19.661Z',
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
      // 공지 상세 조회
      const notice = await this.noticeService.findNoticeDetail(
        crewId,
        noticeId,
      );
      // 공지 조회 확인
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
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 글입니다.' });
      }
      // 권한 확인
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '공지 수정 권한이 없습니다.' });
      }

      // 공지 수정
      const editedNotice = await this.noticeService.editNotice(
        crewId,
        noticeId,
        editNoticeDto,
      );

      if (!editedNotice) {
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
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 글입니다.' });
      }
      // 권한 확인
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '공지 삭제 권한이 없습니다.' });
      }

      // 모임 삭제
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
