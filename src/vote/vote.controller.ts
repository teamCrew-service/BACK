import {
  Controller,
  Param,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Put,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VotingDto } from './dto/voting.dto';
import { CrewService } from 'src/crew/crew.service';
import { MemberService } from 'src/member/member.service';
import { EditVotingDto } from './dto/editVoting.dto';
import { VoteFormService } from 'src/voteform/voteform.service';

@Controller('vote')
@ApiTags('Vote API')
export class VoteController {
  constructor(
    private readonly voteService: VoteService,
    private readonly voteFormService: VoteFormService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
  ) {}

  /* 투표 하기 */
  @Post(':crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 하기 API',
    description: '투표합니다.',
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
    description: '투표 성공',
  })
  @ApiBearerAuth('accessToken')
  async voting(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Body() votingDto: VotingDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      const member = await this.memberService.findAllMember(crewId);
      const voteForm = await this.voteFormService.findVoteFormDetail(
        crewId,
        voteFormId,
      );

      // 다중 투표
      if (
        voteForm.voteform_multipleVotes === true ||
        voteForm.voteform_multipleVotes === 1
      ) {
        for (let i = 0; i < member.length; i++) {
          if (member[i].member_userId === userId || crew.userId === userId) {
            await this.voteService.voting(
              userId,
              crewId,
              voteFormId,
              votingDto,
            );
            return res.status(HttpStatus.OK).json({ message: '투표 완료' });
          }
        }
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'crew 원만 투표가 가능합니다.' });
      }

      // 단일 투표 검사
      if (
        (voteForm.voteform_multipleVotes === false ||
          voteForm.voteform_multipleVotes === 0) &&
        votingDto.vote.includes(',')
      ) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '단일 투표만 가능합니다.' });
      }
      // 단일 투표
      for (let i = 0; i < member.length; i++) {
        if (member[i].member_userId === userId || crew.userId === userId) {
          await this.voteService.voting(userId, crewId, voteFormId, votingDto);
          return res.status(HttpStatus.OK).json({ message: '투표 완료' });
        }
      }
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'crew 원만 투표가 가능합니다.' });
    } catch (e) {
      console.error(e);
      throw new Error('VoteController/voting');
    }
  }

  /* 투표 확인하기 */
  @Get(':crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 조회 API',
    description: '투표에 대한 정보를 조회하는 API.',
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
    description: 'crewId에 해당하는 투표를 조회.',
    schema: {
      example: {
        schedule: {
          userId: 1,
          users: {
            nickname: '돌핀맨',
            prfileImage: 'URL',
          },
          crewId: 1,
          voteFormId: 2,
          vote: '2시',
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findAllVote(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      const member = await this.memberService.findAllMember(crewId);
      const voteForm = await this.voteFormService.findVoteFormDetail(
        crewId,
        voteFormId,
      );

      // 익명 투표
      if (voteForm.anonymousVote === true || voteForm.anonymousVote === 1) {
        for (let i = 0; i < member.length; i++) {
          if (member[i].member_userId === userId || crew.userId === userId) {
            const vote = await this.voteService.findAllAnonymousVote(
              crewId,
              voteFormId,
            );
            return res.status(HttpStatus.OK).json(vote);
          }
        }
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'crew원만 이용할 수 있습니다.' });
      }

      // 공개 투표
      if (voteForm.anonymousVote === false || voteForm.anonymousVote === 0) {
        for (let i = 0; i < member.length; i++) {
          if (member[i].member_userId === userId || crew.userId === userId) {
            const vote = await this.voteService.findAllVote(crewId, voteFormId);
            return res.status(HttpStatus.OK).json(vote);
          }
        }
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'crew원만 이용할 수 있습니다.' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('VoteController/findVote');
    }
  }

  /* 투표 수정하기 */
  @Put(':crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 수정 API',
    description: '투표를 수정합니다.',
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
    description: '투표 수정 성공',
  })
  @ApiBearerAuth('accessToken')
  async editVote(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Body() editVotingDto: EditVotingDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      const member = await this.memberService.findAllMember(crewId);

      for (let i = 0; i < member.length; i++) {
        if (member[i].member_userId === userId || crew.userId === userId) {
          await this.voteService.editVote(
            userId,
            crewId,
            voteFormId,
            editVotingDto,
          );
          return res.status(HttpStatus.OK).json({ message: '투표 수정 완료' });
        }
      }
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'crew원만 이용할 수 있습니다.' });
    } catch (e) {
      console.error(e);
      throw new Error('VoteController/editVote');
    }
  }
}
