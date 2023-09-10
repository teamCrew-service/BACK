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
import { CreateCrewDto } from './dto/createCrew.dto';
import { EditCrewDto } from './dto/editCrew.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger/dist';
import { SignupService } from 'src/signup/signup.service';
import { CreateSignupFormDto } from 'src/signup/dto/create-signupForm.dto';
import { MemberService } from 'src/member/member.service';
import { NoticeService } from 'src/notice/notice.service';

@Controller('crew')
@ApiTags('Crew API')
export class CrewController {
  constructor(
    private readonly crewService: CrewService,
    private readonly signupService: SignupService,
    private readonly memberService: MemberService,
    private readonly noticeService: NoticeService,
  ) {}

  @Post('createcrew')
  @ApiOperation({
    summary: '모임 생성 API',
    description: '모임을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '모임 생성 성공',
  })
  async createCrew(
    @Body() createCrewDto: CreateCrewDto,
    @Body() createSignupFormDto: CreateSignupFormDto,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;
    const newCrew = await this.crewService.createCrew(createCrewDto, userId);
    if (createCrewDto.crewSignup === true) {
      await this.signupService.createSignupForm(
        newCrew.crewId,
        createSignupFormDto,
      );
    }
    return res.status(HttpStatus.CREATED).json({ message: '모임 생성 성공' });
  }
  /* 모임 글 상세 조회*/
  @Get(':crewId')
  @ApiOperation({
    summary: '모임 글 상세 조회(참여 전) API',
    description: '모임의 상세한 내용을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '모임의 상세한 내용을 조회합니다.',
    schema: {
      example: {
        message: '모임 수정 성공',
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
    const notice = await this.noticeService.findNoticeByCrew(crewId);

    /* userId를 통해 crew 방장 및 member 확인 */
    // 게스트일 경우
    if (!userId) {
      return res
        .status(HttpStatus.OK)
        .json({ crew, member, personType: 'person' });
    }
    // 방장일 경우
    if (userId === crew.userId) {
      return res
        .status(HttpStatus.OK)
        .json({ crew, member, notice, personType: 'captain' });
    }
    for (let i = 0; i < member.length; i++) {
      // member일 경우
      if (userId === member[i].member_userId) {
        return res
          .status(HttpStatus.OK)
          .json({ crew, member, notice, personType: 'member' });
      }
    }
    return res
      .status(HttpStatus.OK)
      .json({ crew, member, personType: 'person' });
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
  async editCrew(
    @Param('crewId') crewId: number,
    @Body() editCrewDto: EditCrewDto,
    @Res()
    res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;
    const crew = await this.crewService.findCrewForAuth(crewId);
    if (crew.userId !== userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '글 수정 권한이 없습니다.' });
    }
    const editCrew = await this.crewService.editCrew(crewId, editCrewDto);
    if (!editCrew) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '글 수정 실패' });
    }
    return res.status(HttpStatus.OK).json({ message: '글 수정 완료' });
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
        message: '모임 삭제 성공',
      },
    },
  })
  async deleteCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const { userId } = res.locals.user;
    const crew = await this.crewService.findCrewForAuth(crewId);
    if (crew.userId !== userId) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: '글 삭제 권한이 없습니다.' });
    }
    const deleteCrew = await this.crewService.deleteCrew(crewId);
    if (!deleteCrew) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: '글 삭제 실패' });
    }
    return res.status(HttpStatus.OK).json({ message: '글 삭제 완료' });
  }
}
