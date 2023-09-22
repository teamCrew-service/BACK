import {
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
  Controller,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { CrewService } from './crew.service';
import { EditCrewDto } from './dto/editCrew.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { SignupService } from 'src/signup/signup.service';
import { MemberService } from 'src/member/member.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { JoinCreateCrewDto } from './dto/joinCreateCrew.dto';
import { NoticeService } from 'src/notice/notice.service';
import { VoteFormService } from 'src/voteform/voteform.service';
@Controller('crew')
@ApiTags('Crew API')
export class CrewController {
  constructor(
    private readonly crewService: CrewService,
    private readonly signupService: SignupService,
    private readonly memberService: MemberService,
    private readonly scheduleService: ScheduleService,
    private readonly noticeService: NoticeService,
    private readonly voteFormService: VoteFormService,
  ) {}

  /* 모임 생성 */
  @Post('createcrew')
  @ApiOperation({
    summary: '모임 생성 API',
    description: '모임을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '모임 생성 성공',
  })
  @ApiBearerAuth('accessToken')
  async createCrew(
    @Body() joinCreateCrewDto: JoinCreateCrewDto,
    @Res() res: any,
  ): Promise<any> {
    let { createCrewDto, createSignupFormDto } = joinCreateCrewDto;
    const { userId } = res.locals.user;
    //thumbnail 을 aws3에 업로드하고 그 url을 받아온다.
    //const thumbnail = await this.crewService.thumbnailUpload(createCrewDto);
    // createCrewDto.thumbnail = thumbnail;
    //createCrewDto.thumbnail = 'thumbnail_temp';

    const newCrew = await this.crewService.createCrew(createCrewDto, userId);
    if (createCrewDto.crewSignup === true) {
      await this.signupService.createSignupForm(
        newCrew.crewId,
        createSignupFormDto,
      );
    }
    return res.status(HttpStatus.CREATED).json({ message: '모임 생성 성공' });
  }

  /* 모임 상세 조회*/
  @Get(':crewId')
  @ApiOperation({
    summary: '모임 상세 조회 API',
    description: '모임의 상세한 내용을 조회합니다.',
  })
  @ApiParam({
    name: 'crewId',
    type: 'number',
    description: '모임 Id',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 상세한 내용을 조회합니다.',
    schema: {
      examples: {
        example1: {
          crew: {
            crewId: 1,
            category: '친목',
            crewTitle: '같이 운동하고 건강한 저녁 함께해요',
            thumbnail: ['url1', 'url2', 'url3'],
            crewDDay: '2023-08-19T03:44:19.661Z',
            crewAddress: '소공동',
          },
          member: [1, 11, 10], // 게스트일 경우 비어있는 배열
          personType: 'person',
        },
        example2: {
          crew: {
            crewId: 1,
            category: '친목',
            crewTitle: '같이 운동하고 건강한 저녁 함께해요',
            thumbnail: ['url1', 'url2', 'url3'],
            crewDDay: '2023-08-19T03:44:19.661Z',
            crewAddress: '소공동',
          },
          member: [1, 11, 10],
          schedule: {
            scheduleTitle: '퇴근 후 40분 걷기',
            scheduleDDay: '2023-08-19T03:44:19.661Z',
            scheduleContent: '일찍 퇴근 하는 분들 모여요!!',
            scheduleAddress: '일산 호수공원',
          },
          personType: 'captain',
        },
        example3: {
          crew: {
            crewId: 1,
            category: '친목',
            crewTitle: '같이 운동하고 건강한 저녁 함께해요',
            thumbnail: ['url1', 'url2', 'url3'],
            crewDDay: '2023-08-19T03:44:19.661Z',
            crewAddress: '소공동',
          },
          member: [1, 11, 10],
          schedule: {
            scheduleTitle: '퇴근 후 40분 걷기',
            scheduleDDay: '2023-08-19T03:44:19.661Z',
            scheduleContent: '일찍 퇴근 하는 분들 모여요!!',
            scheduleAddress: '일산 호수공원',
          },
          personType: 'member',
        },
      },
    },
  })
  async findCrewDetail(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const userId = res.locals.user ? res.locals.user.userId : null;
    const crew = await this.crewService.findCrewDetail(crewId);
    const member = await this.memberService.findAllMember(crewId);

    // 모임이 생긴 기간
    const today: any = new Date();
    const startDate: any = crew.crew_createdAt;
    const timeDifference: number = today - startDate;
    const daysDifference: number = timeDifference / (1000 * 60 * 60 * 24);
    const createdCrewPeriod: number = Math.floor(daysDifference);

    /* userId를 통해 crew 방장 및 member 확인 */
    // 게스트일 경우
    if (userId === null) {
      return res
        .status(HttpStatus.OK)
        .json({ createdCrewPeriod, crew, member, personType: 'person' });
    }

    // crew 일정
    const schedule = await this.scheduleService.findScheduleByCrew(crewId);
    // const signup = await this.signupService.findMySignup(userId, crewId);

    // crew 공지
    const notice = await this.noticeService.findAllNotice(crewId);
    const voteForm = await this.voteFormService.findAllVoteForm(crewId);

    // 방장일 경우
    if (userId === crew.crew_userId) {
      return res.status(HttpStatus.OK).json({
        createdCrewPeriod,
        crew,
        member,
        schedule,
        notice,
        voteForm,
        personType: 'captain',
      });
    }
    for (let i = 0; i < member.length; i++) {
      // member일 경우
      if (userId === member[i].userId) {
        return res.status(HttpStatus.OK).json({
          createdCrewPeriod,
          crew,
          member,
          schedule,
          notice,
          voteForm,
          personType: 'member',
        });
      }
    }
    return res
      .status(HttpStatus.OK)
      .json({ createdCrewPeriod, crew, member, personType: 'person' });
  }

  /* 모임글 수정 */
  @Put(':crewId/edit')
  @ApiOperation({
    summary: '모임 글 수정 API',
    description: '모임의 상세한 내용을 수정합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 상세한 내용을 수정합니다.',
    schema: {
      example: {
        crewId: 1,
        category: '친목',
        crewTitle: '같이 운동하고 건강한 저녁 함께해요',
        thumbnail: ['url1', 'url2', 'url3'],
        crewDDay: '2023-08-19T03:44:19.661Z',
        crewAddress: '소공동',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async editCrew(
    @Param('crewId') crewId: number,
    @Body() editCrewDto: EditCrewDto,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;

    const crew = await this.crewService.findCrewForAuth(crewId);
    if (crew.userId !== userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '모임 수정 권한이 없습니다.' });
    }
    const editCrew = await this.crewService.editCrew(crewId, editCrewDto);
    if (!editCrew) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '모임 수정 실패했습니다.' });
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: '모임 수정 완료했습니다.' });
  }

  /* 모임 글 삭제 */
  @Delete(':crewId/delete')
  @ApiOperation({
    summary: '모임 글 삭제 API',
    description: '모임의 내용을 삭제합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 내용을 삭제합니다.',
    schema: {
      example: {
        message: '모임 삭제 성공했습니다.',
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async deleteCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;
    const crew = await this.crewService.findCrewForAuth(crewId);
    if (crew.userId !== userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '모임 삭제 권한이 없습니다.' });
    }
    const deleteCrew = await this.crewService.deleteCrew(crewId);
    if (!deleteCrew) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '모임 삭제를 실패했습니다.' });
    }
    return res
      .status(HttpStatus.OK)
      .json({ message: '모임 삭제를 성공했습니다.' });
  }
}
