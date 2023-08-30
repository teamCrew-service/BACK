import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { SignupService } from './signup.service';
import { CreateSignupFormDto } from './dto/create-signupForm.dto';
import { SubmitSignupDto } from './dto/submit-signup.dto';

@Controller()
export class SignupController {
  constructor(private readonly signupService: SignupService) {}

  /* 모임 가입(form 생성) */
  @Post('signup/:crewId/signupform')
  async createSignupForm(
    @Param('crewId') crewId: number,
    @Body() createSignupFormDto: CreateSignupFormDto,
    @Res() res: any,
  ): Promise<any> {
    if (!createSignupFormDto.question1 || !createSignupFormDto.question2) {
      throw new Error('질문을 작성해주세요');
    }
    await this.signupService.createSignupForm(crewId, createSignupFormDto);
    return res
      .status(HttpStatus.CREATED)
      .json({ message: '모임 가입 양식 작성 완료' });
  }

  /* 모임 가입(form 불러오기) */
  @Get('signup/:signupFormId')
  async findOneSignupForm(

    @Param('signupFormId')
    signupFormId: number,
    @Res() res: any,
  ): Promise<any> {
    const signupForm = await this.signupService.findOneSignupForm(signupFormId);
    return res.status(HttpStatus.OK).json(signupForm);
  }

  /* 모임 가입 작성 */
  @Post('signup/:crewId/:signupFormId/submit')
  async submitSignup(
    @Param() crewId: number,
    signupFormId: number,
    @Body() submitSignupDto: SubmitSignupDto,
    @Res() res: any,
  ): Promise<any> {
    if (!submitSignupDto.answer1 || !submitSignupDto.answer2) {
      throw new Error('작성을 완료해주세요');
    }
    await this.signupService.submitSignup(
      crewId,
      signupFormId,
      submitSignupDto,
    );
    return res
      .status(HttpStatus.CREATED)
      .json({ message: '모임 가입 작성 완료' });
  }

  /* 제출한 가입서 조회 */
  @Get('signup/:crewId')
  async findAllSubmitted(
    @Param('crewId') crewId: number,
    @Res() res: any,
  ): Promise<any> {
    const singup = await this.signupService.findAllSubmitted(crewId);
    return res.status(HttpStatus.OK).json(singup);
  }
}
