import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { VoteFormService } from './voteform.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVoteFormDto } from './dto/createVoteForm.dto';
import { CrewService } from 'src/crew/crew.service';
import { MemberService } from 'src/member/member.service';
import { EditVoteFormDto } from './dto/editVoteForm.dto';

@Controller('voteform')
@ApiTags('VoteForm API')
export class VoteformController {
  constructor(
    private readonly voteFormService: VoteFormService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
  ) {}

  /* 투표 공지 등록 */
  @Post(':crewId/createVoteForm')
  @ApiOperation({
    summary: '투표 공지 등록 API',
    description: '투표 공지를 등록합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '투표 공지 등록 성공',
  })
  @ApiBearerAuth('accessToken')
  async createVoteForm(
    @Param('crewId') crewId: number,
    @Body() createVoteFormDto: CreateVoteFormDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '투표 공지를 등록할 권한이 없습니다.' });
      }

      await this.voteFormService.createVoteForm(
        userId,
        crewId,
        createVoteFormDto,
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: '투표 공지를 등록했습니다.' });
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormController/createVoteForm');
    }
  }

  /* 투표 공지 상세 조회 */
  @Get(':crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 공지 전체 조회 API',
    description: '투표 공지 전체를 조회하는 API.',
  })
  @ApiResponse({
    status: 200,
    description: 'crewId에 해당하는 공지를 모두 조회.',
    schema: {
      example: {
        schedule: {
          voteTitle: '일산 호수공원 런닝!!',
          voteFormContent: '이번주 목요일에 런닝 시간대 투표하겠습니다.',
          voteFormEndDate: '2023-08-22T03:44:19.661Z',
          voteFormOption1: '2시',
          voteFormOption2: '3시',
          voteFormOption3: '4시 30분',
          voteFormOption4: null,
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findVoteFormDetail(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const member = await this.memberService.findAllMember(crewId);
      for (let i = 0; i < member.length; i++) {
        if (userId === member[i]) {
          const voteForm = await this.voteFormService.findVoteFormDetail(
            crewId,
            voteFormId,
          );
          return res.status(HttpStatus.OK).json({ voteForm });
        }
      }
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'crew원이 아닙니다.' });
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormController/findVoteFormDetail');
    }
  }

  /* 투표 공지 수정 */
  @Put('edit/:crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 공지 수정 API',
    description: '원하는 투표 공지를 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '투표 공지 수정 성공',
  })
  @ApiBearerAuth('accessToken')
  async editVoteForm(
    @Body() editVoteFormDto: EditVoteFormDto,
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '투표 공지 수정 권한이 없습니다.' });
      }
      const editedVoteForm = await this.voteFormService.editVoteForm(
        crewId,
        voteFormId,
        editVoteFormDto,
      );
      if (editedVoteForm.length < 1) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '투표 공지 수정 실패' });
      }
      return res.status(HttpStatus.OK).json({ message: '투표 공지 수정 성공' });
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormController/editVoteForm');
    }
  }

  /* 투표 공지 삭제 */
  @Delete('delete/:crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 공지 삭제 API',
    description: '원하는 투표 공지를 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '투표 공지 삭제 성공',
  })
  @ApiBearerAuth('accessToken')
  async deleteVoteForm(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (crew.userId !== userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '투표 공지 삭제 권한이 없습니다.' });
      }

      const deletedVoteForm = await this.voteFormService.deleteVoteForm(
        crewId,
        voteFormId,
      );
      if (deletedVoteForm.length < 1) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '투표 공지 삭제 실패' });
      }
      return res.status(HttpStatus.OK).json({ message: '투표 공지 삭제 성공' });
    } catch (e) {
      console.error(e);
      throw new Error('VoteFormController/deleteVoteForm');
    }
  }
}
