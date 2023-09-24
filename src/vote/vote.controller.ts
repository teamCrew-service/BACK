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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VotingDto } from './dto/voting.dto';
import { CrewService } from 'src/crew/crew.service';
import { MemberService } from 'src/member/member.service';
import { EditVotingDto } from './dto/editVoting.dto';

@Controller('vote')
@ApiTags('Vote API')
export class VoteController {
  constructor(
    private readonly voteService: VoteService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
  ) {}

  /* 투표 하기 */
  @Post(':crewId/:voteFormId')
  @ApiOperation({
    summary: '투표 하기 API',
    description: '투표합니다.',
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

      for (let i = 0; i < member.length; i++) {
        if (member[i].userId === userId || crew.userId === userId) {
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
  @Get(':crewId')
  @ApiOperation({
    summary: '투표 조회 API',
    description: '투표에 대한 정보를 조회하는 API.',
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
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      const member = await this.memberService.findAllMember(crewId);

      for (let i = 0; i < member.length; i++) {
        if (member[i].member_userId === userId || crew.userId === userId) {
          const voteDetail = await this.voteService.findAllVote(crewId);
          return res.status(HttpStatus.OK).json(voteDetail);
        }
      }
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'crew원만 이용할 수 있습니다.' });
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
