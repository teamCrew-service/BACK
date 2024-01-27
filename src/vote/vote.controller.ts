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
import { VoteService } from '@src/vote/vote.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VotingDto } from '@src/vote/dto/voting.dto';
import { CrewService } from '@src/crew/crew.service';
import { MemberService } from '@src/member/member.service';
import { EditVotingDto } from '@src/vote/dto/editVoting.dto';
import { VoteFormService } from '@src/voteform/voteform.service';

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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      // 멤버 조회
      const member = await this.memberService.findAllMember(crewId);
      // 투표 폼 정보 조회
      const voteForm = await this.voteFormService.findVoteFormDetail(
        crewId,
        voteFormId,
      );
      // 투표 정보 조회
      const vote = await this.voteService.findAllVote(crewId, voteFormId);

      // 투표했는지 확인하기
      for (let i = 0; i < vote.length; i++) {
        if (vote[i].userId === userId) {
          return res
            .status(HttpStatus.NOT_ACCEPTABLE)
            .json({ message: '이미 투표를 완료했습니다.' });
        }
      }

      // 다중 투표
      if (voteForm.multipleVotes === true) {
        if (crew.userId === userId) {
          await this.voteService.voting(userId, crewId, voteFormId, votingDto);
          return res.status(HttpStatus.OK).json({ message: '투표 완료' });
        }
        for (let i = 0; i < member.length; i++) {
          if (member[i].userId === userId) {
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
      if (voteForm.multipleVotes === false && votingDto.vote.includes(',')) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '단일 투표만 가능합니다.' });
      }
      // 단일 투표
      if (crew.userId === userId) {
        await this.voteService.voting(userId, crewId, voteFormId, votingDto);
        return res.status(HttpStatus.OK).json({ message: '투표 완료' });
      }
      for (let i = 0; i < member.length; i++) {
        if (member[i].userId === userId) {
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
    description: '익명 투표',
    content: {
      'application/json': {
        examples: {
          '익명 투표': {
            value: [
              {
                voteId: 1,
                crewId: 22,
                voteFormId: 4,
                vote: '2시',
              },
            ],
          },
          '공개 투표': {
            value: [
              {
                voteId: 1,
                crewId: 22,
                voteFormId: 5,
                vote: '4시',
                userId: 3,
                nickname: '돌핀맨',
              },
            ],
          },
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findAllVote(
    @Param('crewId') crewId: number,
    @Param('voteFormId') voteFormId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      // 멤버 조회
      const member = await this.memberService.findAllMember(crewId);
      // 투표 폼 정보 조회
      const voteForm = await this.voteFormService.findVoteFormDetail(
        crewId,
        voteFormId,
      );

      // 익명 투표
      if (voteForm.anonymousVote === true) {
        if (crew.userId === userId) {
          const vote = await this.voteService.findAllAnonymousVote(
            crewId,
            voteFormId,
          );
          return res.status(HttpStatus.OK).json({ voteForm, vote });
        }
        for (let i = 0; i < member.length; i++) {
          if (member[i].userId === userId || crew.userId === userId) {
            const vote = await this.voteService.findAllAnonymousVote(
              crewId,
              voteFormId,
            );
            return res.status(HttpStatus.OK).json({ voteForm, vote });
          }
        }
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'crew원만 이용할 수 있습니다.' });
      }

      // 공개 투표
      if (voteForm.anonymousVote === false) {
        if (crew.userId === userId) {
          const vote = await this.voteService.findAllVote(crewId, voteFormId);
          return res.status(HttpStatus.OK).json({ voteForm, vote });
        }
        for (let i = 0; i < member.length; i++) {
          if (member[i].userId === userId || crew.userId === userId) {
            const vote = await this.voteService.findAllVote(crewId, voteFormId);
            return res.status(HttpStatus.OK).json({ voteForm, vote });
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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      // 멤버 조회
      const member = await this.memberService.findAllMember(crewId);

      // 권한 확인
      for (let i = 0; i < member.length; i++) {
        if (member[i].userId === userId || crew.userId === userId) {
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
