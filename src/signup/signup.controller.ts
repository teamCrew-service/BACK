import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { SignupService } from './signup.service';
// import { CreateSignupFormDto } from './dto/create-signupForm.dto';
import { SubmitSignupDto } from './dto/submit-signup.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { CrewService } from 'src/crew/crew.service';
import { ConfirmSingupDto } from './dto/confirm-singup.dto';
import { MemberService } from 'src/member/member.service';
import { LeavecrewService } from 'src/leavecrew/leavecrew.service';

@Controller()
@ApiTags('signup API')
export class SignupController {
  constructor(
    private readonly signupService: SignupService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
    private readonly leavecrewService: LeavecrewService,
  ) {}

  /* 모임 가입(form 생성): 버전 업그레이드에 맞춰 사용*/
  // @Post('signupform/:crewId/createform')
  // @ApiOperation({
  //   summary: '모임 가입 form 생성 API',
  //   description: '모임 가입 양식 생성',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '모임 가입 양식 작성 완료',
  // })
  // async createSignupForm(
  //   @Param('crewId') crewId: number,
  //   @Body() createSignupFormDto: CreateSignupFormDto,
  //   @Res() res: any,
  // ): Promise<any> {
  //   if (!createSignupFormDto.question1 || !createSignupFormDto.question2) {
  //     throw new Error('질문을 작성해주세요');
  //   }
  //   await this.signupService.createSignupForm(crewId, createSignupFormDto);
  //   return res
  //     .status(HttpStatus.CREATED)
  //     .json({ message: '모임 가입 양식 작성 완료' });
  // }

  /* (누구나 참여 가능) 모임 가입 */
  @Post('signup/:crewId')
  @ApiOperation({
    summary: '(누구나 참여 가능) 모임 가입 API',
    description: '(누구나 참여 가능) 모임 가입',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiResponse({
    status: 200,
    description: '모임 가입 완료',
  })
  @ApiBearerAuth('accessToken')
  async signup(@Param('crewId') crewId: number, @Res() res: any): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      const member = await this.memberService.findAllMember(crewId);
      if (crew.userId === userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '모임의 방장입니다.' });
      }
      if (crew.crewMaxMember === member.length) {
        for (let i = 0; i < member.length; i++) {
          if (member[i].member_userId === userId) {
            return res
              .status(HttpStatus.BAD_REQUEST)
              .json({ message: '모임에 이미 가입했습니다.' });
          }
        }
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: '모임 인원이 가득 찼습니다.' });
      }
      await this.memberService.addMember(crewId, userId);
      return res.status(HttpStatus.CREATED).json({ message: '모임 가입 완료' });
    } catch (e) {
      console.error(e);
      throw new Error('SignupController/signup');
    }
  }

  /* 모임 가입(form 불러오기) */
  @Get('signupform/:signupFormId')
  @ApiOperation({
    summary: '모임 가입 form 불러오기 API',
    description: '모임 가입 form 불러오기',
  })
  @ApiParam({ name: 'signupFormId', description: 'signupFormId' })
  @ApiResponse({
    status: 200,
    description: '모임 가입 양식 불러오기',
    schema: {
      example: {
        signupFormId: 1,
        question1: '자기소개 또는 가입 동기',
        question2: '나를 표현하는 형용사 3가지는?',
        crewId: 1,
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findOneSignupForm(
    @Param('signupFormId')
    signupFormId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const signupForm = await this.signupService.findOneSignupForm(
        signupFormId,
      );
      return res.status(HttpStatus.OK).json(signupForm);
    } catch (e) {
      console.error(e);
      throw new Error('SignupController/findOneSignupForm');
    }
  }

  /* 모임 가입 작성 */
  @Post('signup/:signupFormId/:crewId/submit')
  @ApiOperation({
    summary: '모임 가입 작성 API',
    description: '모임 가입 작성',
  })
  @ApiResponse({
    status: 200,
    description: '모임 가입 작성 완료',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiParam({ name: 'signupFormId', description: 'signupFormId' })
  @ApiBearerAuth('accessToken')
  async submitSignup(
    @Param('crewId') crewId: number,
    @Param('signupFormId') signupFormId: number,
    @Body() submitSignupDto: SubmitSignupDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      if (crew.userId === userId) {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: '모임장입니다.' });
      }
      const leaveUser = await this.leavecrewService.findOneLeaveUser(
        crewId,
        userId,
      );
      if (leaveUser) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: '탈퇴 기록이 있습니다. 7일 뒤에 다시 가입할 수 있습니다.',
        });
      }
      const submitedSignup = await this.signupService.findMySignup(
        userId,
        crewId,
      );
      if (submitedSignup) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: '이미 가입서를 작성했습니다. 모임장의 승인을 기다려주세요',
        });
      }
      if (!submitSignupDto.answer1 || !submitSignupDto.answer2) {
        throw new Error('작성을 완료해주세요');
      }
      await this.signupService.submitSignup(
        userId,
        crewId,
        signupFormId,
        submitSignupDto,
      );
      return res
        .status(HttpStatus.CREATED)
        .json({ message: '모임 가입서 작성 완료' });
    } catch (e) {
      console.error(e);
      throw new Error('SignupController/submitSignup');
    }
  }

  /* (모임장) 제출한 가입서 조회 */
  @Get('signup/:crewId')
  @ApiOperation({
    summary: '제출한 가입서 조회 API',
    description: '제출한 가입서 불러오기',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiResponse({
    status: 200,
    description: '제출한 가입서 불러오기',
    schema: {
      example: {
        nickname: 'CJW',
        age: 1995,
        location: '서울 종로구 서린동 136',
        myMessage: '안녕하세요. 고양이를 키우고 있는 사람입니다.',
        signupId: 1,
        crewId: '35',
        userId: '1',
        answer1: 'asdf',
        answer2: 'asdf',
        permission: null,
        createdAt: '2023-10-02T21:59:37.097Z',
        interestTopics: ['친목', '음료', '책/글'],
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findAllSubmitted(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      if (crew.userId === userId) {
        const signup = await this.signupService.findAllSubmitted(crewId);
        return res.status(HttpStatus.OK).json(signup);
      } else {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: '모임장이 아닙니다. 접근 권한이 없습니다.' });
      }
    } catch (e) {
      console.error(e);
      throw new Error('SignupController/findAllSubmitted');
    }
  }

  /* 모임 참여 (방장 승인 여부)API */
  @Put('signup/:signupId/confirmsignup')
  @ApiOperation({
    summary: '모임 참여 승인 여부 API',
    description: '제출한 가입서에 대한 승인 여부',
  })
  @ApiParam({ name: 'signupId', description: 'signupId' })
  @ApiResponse({
    status: 200,
    description: '모임 가입서 확인 완료',
  })
  @ApiBearerAuth('accessToken')
  async confirmSingup(
    @Param('signupId') singupId: number,
    @Body() confirmSingupDto: ConfirmSingupDto,
    @Res() res: any,
  ): Promise<any> {
    try {
      await this.signupService.confirmSingup(singupId, confirmSingupDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: '모임 가입서 확인 완료' });
    } catch (e) {
      console.error(e);
      throw new Error('SignupController/confirmSingup');
    }
  }

  /* 탈퇴하기 */
  @Post('exitCrew/:crewId')
  @ApiOperation({
    summary: '모임 탈퇴하기 API',
    description: '모임을 탈퇴하기',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiResponse({
    status: 200,
    description: '모임 탈퇴하기 완료',
  })
  @ApiBearerAuth('accessToken')
  async exitCrew(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    try {
      const { userId } = res.locals.user;
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: '존재하지 않는 모임입니다.' });
      }
      const member = await this.memberService.findAllMember(crewId);
      for (let i = 0; i < member.length; i++) {
        if (member[i].member_userId === userId) {
          await this.signupService.exitCrew(crewId, userId);
          return res.status(HttpStatus.OK).json({ message: '탈퇴 성공' });
        }
      }
    } catch (e) {
      console.error(e);
      throw new Error('SignupController/exitCrew');
    }
  }
}
