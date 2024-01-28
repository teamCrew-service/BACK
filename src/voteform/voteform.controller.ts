import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { VoteFormService } from '@src/voteform/voteform.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateVoteFormDto } from '@src/voteform/dto/createVoteForm.dto';
import { CrewService } from '@src/crew/crew.service';
import { MemberService } from '@src/member/member.service';
import { EditVoteFormDto } from '@src/voteform/dto/editVoteForm.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Controller('voteform')
@ApiTags('VoteForm API')
export class VoteformController {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 권한 확인
      if (crew.userId !== userId) {
        throw new HttpException(
          '투표 공지를 등록할 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 투표 폼 생성
      const voteForm = await this.voteFormService.createVoteForm(
        userId,
        crewId,
        createVoteFormDto,
      );
      const voteFormId = voteForm.voteFormId;
      return res
        .status(HttpStatus.OK)
        .json({ message: '투표 공지를 등록했습니다.', voteFormId });
    } catch (e) {
      this.logger.error('VoteFormController/createVoteForm', e.message);
      throw new HttpException(
        'VoteFormController/createVoteForm',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* 투표 공지 상세 조회 */
  @Get(':crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 공지 전체 조회 API',
    description: '투표 공지 전체를 조회하는 API.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiParam({
    name: 'voteFormId',
    type: 'number',
    description: '투표 공지 Id',
  })
  @ApiResponse({
    status: 200,
    description: 'crewId에 해당하는 공지를 모두 조회.',
    schema: {
      example: {
        voteForm: {
          voteFormTitle: '일산 호수공원 런닝!!',
          voteFormContent: '이번주 목요일에 런닝 시간대 투표하겠습니다.',
          voteFormEndDate: '2023-08-22T03:44:19.661Z',
          voteFormOption1: '2시',
          voteFormOption2: '3시',
          voteFormOption3: '4시 30분',
          voteFormOption4: null,
          voteFormOption5: null,
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findVoteFormDetail(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 모임장일 경우
      if (crew.userId === userId) {
        const voteForm = await this.voteFormService.findVoteFormDetail(
          crewId,
          voteFormId,
        );
        return res.status(HttpStatus.OK).json(voteForm);
      }

      // member일 경우
      const member = await this.memberService.findAllMember(crewId);
      for (let i = 0; i < member.length; i++) {
        if (userId === member[i]) {
          const voteForm = await this.voteFormService.findVoteFormDetail(
            crewId,
            voteFormId,
          );
          return res.status(HttpStatus.OK).json(voteForm);
        }
      }
      throw new HttpException('crew원이 아닙니다.', HttpStatus.UNAUTHORIZED);
    } catch (e) {
      this.logger.error('VoteFormController/findVoteFormDetail', e.message);
      throw new HttpException(
        'VoteFormController/findVoteFormDetail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* 투표 공지 수정 */
  @Put('edit/:crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 공지 수정 API',
    description: '원하는 투표 공지를 수정합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiParam({
    name: 'voteFormId',
    type: 'number',
    description: '투표 공지 Id',
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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      // 권한 확인
      if (crew.userId !== userId) {
        throw new HttpException(
          '투표 공지 수정 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }
      // 투표 폼 수정
      const editedVoteForm = await this.voteFormService.editVoteForm(
        crewId,
        voteFormId,
        editVoteFormDto,
      );
      if (!editedVoteForm) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '투표 공지 수정 실패' });
      }
      return res.status(HttpStatus.OK).json({ message: '투표 공지 수정 성공' });
    } catch (e) {
      this.logger.error('VoteFormController/editVoteForm', e.message);
      throw new HttpException(
        'VoteFormController/editVoteForm',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* 투표 공지 삭제 */
  @Delete('delete/:crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 공지 삭제 API',
    description: '원하는 투표 공지를 삭제합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiParam({
    name: 'voteFormId',
    type: 'number',
    description: '투표 공지 Id',
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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 권한 확인
      if (crew.userId !== userId) {
        throw new HttpException(
          '투표 공지 삭제 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      // 투표 폼 삭제
      const deletedVoteForm = await this.voteFormService.deleteVoteForm(
        crewId,
        voteFormId,
      );
      if (!deletedVoteForm) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: '투표 공지 삭제 실패' });
      }
      return res.status(HttpStatus.OK).json({ message: '투표 공지 삭제 성공' });
    } catch (e) {
      this.logger.error('VoteFormController/deleteVoteForm', e.message);
      throw new HttpException(
        'VoteFormController/deleteVoteForm',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
