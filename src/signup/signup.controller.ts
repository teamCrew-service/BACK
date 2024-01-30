import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { SignupService } from '@src/signup/signup.service';
// import { CreateSignupFormDto } from './dto/create-signupForm.dto';
import { SubmitSignupDto } from '@src/signup/dto/submit-signup.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { CrewService } from '@src/crew/crew.service';
import { ConfirmSignupDto } from '@src/signup/dto/confirm-signup.dto';
import { MemberService } from '@src/member/member.service';
import { LeavecrewService } from '@src/leavecrew/leavecrew.service';
import { EditSignupDto } from '@src/signup/dto/editSubmit-signup.dto';
import { ImageService } from '@src/image/image.service';
import { Signup } from '@src/signup/entities/signup.entity';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Controller()
@ApiTags('signup API')
export class SignupController {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly signupService: SignupService,
    private readonly crewService: CrewService,
    private readonly memberService: MemberService,
    private readonly leavecrewService: LeavecrewService,
    private readonly imageService: ImageService,
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
  async signup(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 멤버 조회
      const member = await this.memberService.findAllMember(crewId);
      if (crew.userId === userId) {
        throw new HttpException('모임의 방장입니다.', HttpStatus.BAD_REQUEST);
      }
      // 멤버 숫자 확인, 가입 여부 확인
      if (crew.crewMaxMember === member.length) {
        for (let i = 0; i < member.length; i++) {
          if (member[i].userId === userId) {
            throw new HttpException(
              '모임에 이미 가입했습니다.',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        throw new HttpException(
          '모임 인원이 가득 찼습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.memberService.addMember(crewId, userId);

      return res.status(HttpStatus.CREATED).json({ message: '모임 가입 완료' });
    } catch (e) {
      this.errorHandlingService.handleException('SignupController/signup', e);
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
  ): Promise<Object> {
    try {
      const signupForm = await this.signupService.findOneSignupForm(
        signupFormId,
      );
      return res.status(HttpStatus.OK).json(signupForm);
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupController/findOneSignupForm',
        e,
      );
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
      if (crew.userId === userId) {
        throw new HttpException('모임장입니다.', HttpStatus.FORBIDDEN);
      }
      // 탈퇴 기록 확인
      const leaveUser = await this.leavecrewService.findOneLeaveUser(
        crewId,
        userId,
      );
      if (leaveUser) {
        throw new HttpException(
          '탈퇴 기록이 있습니다. 7일 뒤에 다시 가입할 수 있습니다.',
          HttpStatus.FORBIDDEN,
        );
      }

      // 멤버 조회
      const member = await this.memberService.findAllMember(crewId);
      // 멤버 숫자 확인, 가입 여부 확인
      if (crew.crewMaxMember === member.length) {
        for (let i = 0; i < member.length; i++) {
          if (member[i].userId === userId) {
            throw new HttpException(
              '모임에 이미 가입했습니다.',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
        throw new HttpException(
          '모임 인원이 가득 찼습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 가입서 조회
      const submitedSignup = await this.signupService.findMySignup(
        userId,
        crewId,
      );
      if (submitedSignup) {
        throw new HttpException(
          '이미 가입서를 작성했습니다. 모임장의 승인을 기다려주세요',
          HttpStatus.FORBIDDEN,
        );
      }
      if (!submitSignupDto.answer1 || !submitSignupDto.answer2) {
        throw new Error('작성을 완료해주세요');
      }
      // 가입서 생성
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
      this.errorHandlingService.handleException(
        'SignupController/submitSignup',
        e,
      );
    }
  }

  /* (본인) 제출한 가입서 조회 */
  @Get('signup/mySubmitted/:crewId')
  @ApiOperation({
    summary: '본인이 제출한 가입서 조회 API',
    description: '개인이 제출한 가입서 조회',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiResponse({
    status: 200,
    description: '제출한 가입서 불러오기',
    schema: {
      example: {
        signupId: 2,
        answer1: '안녕안녕 나는 지수야 헬륨가스 먹었더니 요렇게 됐지!',
        answer2: '다정한,정직한,긍정적인',
        userId: '3',
        permission: null,
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async findOneSubmitted(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<Signup> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 정보 확인
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      // 제출한 가입서 조회
      const signup = await this.signupService.findMySignup(userId, crewId);
      if (!signup) {
        throw new HttpException(
          '제출한 가입서가 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      return res.status(HttpStatus.OK).json(signup);
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupController/findOneSubmitted',
        e,
      );
    }
  }

  /* (본인) 제출한 가입서 수정 */
  @Put('signup/mySubmitted/:crewId/edit')
  @ApiOperation({
    summary: '제출한 가입서 수정 API',
    description: '제출한 가입서를 수정합니다.',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiResponse({
    status: 200,
    description: '가입서 수정 성공',
  })
  @ApiBearerAuth('accessToken')
  async editMySubmitted(
    @Body() editSignupDto: EditSignupDto,
    @Res() res: any,
    @Param('crewId') crewId: number,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 제출한 가입서 조회
      const signup = await this.signupService.findMySignup(userId, crewId);
      if (!signup) {
        throw new HttpException(
          '제출한 가입서가 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 작성자 권한
      if (signup.userId !== userId) {
        throw new HttpException('작성자가 아닙니다.', HttpStatus.UNAUTHORIZED);
      }
      const signupId = signup.signupId;
      // 가입서 수정
      const editSignup = await this.signupService.editMySubmitted(
        editSignupDto,
        crewId,
        signupId,
      );
      if (!editSignup) {
        throw new HttpException('가입서 수정 실패', HttpStatus.BAD_REQUEST);
      } else {
        return res.status(HttpStatus.OK).json({ message: '가입서 수정 성공' });
      }
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupController/editMySubmitted',
        e,
      );
    }
  }

  /* (본인) 제출한 가입서 삭제 */
  @Delete('signup/mySubmitted/:crewId/delete')
  @ApiOperation({
    summary: '제출한 가입서 삭제 API',
    description: '제출한 가입서를 삭제합니다.',
  })
  @ApiParam({ name: 'crewId', description: 'crewId' })
  @ApiResponse({
    status: 200,
    description: '가입서 삭제 성공',
  })
  @ApiBearerAuth('accessToken')
  async deleteMySubmitted(
    @Res() res: any,
    @Param('crewId') crewId: number,
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 제출한 가입서 조회
      const signup = await this.signupService.findMySignup(userId, crewId);
      if (!signup) {
        throw new HttpException(
          '제출한 가입서가 없습니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 작성자 권한
      if (signup.userId !== userId) {
        throw new HttpException('작성자가 아닙니다.', HttpStatus.UNAUTHORIZED);
      }
      const signupId = signup.signupId;
      // 가입서 삭제
      const deleteSignup = await this.signupService.deleteMySubmitted(
        crewId,
        signupId,
      );
      if (!deleteSignup) {
        throw new HttpException('가입서 삭제 실패', HttpStatus.BAD_REQUEST);
      } else {
        return res.status(HttpStatus.OK).json({ message: '가입서 삭제 성공' });
      }
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupController/deleteMySubmitted',
        e,
      );
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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      // 권한 확인
      if (crew.userId === userId) {
        const signup = await this.signupService.findAllSubmitted(crewId);
        return res.status(HttpStatus.OK).json(signup);
      } else {
        throw new HttpException(
          '모임장이 아닙니다. 접근 권한이 없습니다.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupController/findAllSubmitted',
        e,
      );
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
  async confirmsignup(
    @Param('signupId') signupId: number,
    @Body() confirmSignupDto: ConfirmSignupDto,
    @Res() res: any,
  ): Promise<Object> {
    try {
      // 가입서 확인
      await this.signupService.confirmsignup(signupId, confirmSignupDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: '모임 가입서 확인 완료' });
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupController/confirmsignup',
        e,
      );
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
  ): Promise<Object> {
    try {
      // user 정보 확인
      const { userId } = res.locals.user;
      // 모임 조회
      const crew = await this.crewService.findByCrewId(crewId);
      if (!crew) {
        throw new HttpException(
          '존재하지 않는 모임입니다.',
          HttpStatus.NOT_FOUND,
        );
      }
      const leaveUser = await this.leavecrewService.findOneLeaveUser(
        crewId,
        userId,
      );
      if (!leaveUser) {
        // 멤버 조회
        const member = await this.memberService.findAllMember(crewId);
        for (let i = 0; i < member.length; i++) {
          if (member[i].userId === userId) {
            await this.signupService.exitCrew(crewId, userId);
            await this.imageService.deleteImageExitCrew(crewId, userId);
            await this.leavecrewService.createLeaveCrew(crewId, userId);
            return res.status(HttpStatus.OK).json({ message: '탈퇴 성공' });
          } else {
            throw new HttpException('탈퇴 실패', HttpStatus.BAD_REQUEST);
          }
        }
      }
    } catch (e) {
      this.errorHandlingService.handleException('SignupController/exitCrew', e);
    }
  }
}
