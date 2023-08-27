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
  ) {
    await this.signupService.createSignupForm(crewId, createSignupFormDto);
  }

  /* 모임 가입(form 불러오기) */
  @Get('signup/:crewId/:signupFormId')
  async findOneSignupForm(
    @Param() crewId: number,
    signupFormId: number,
    @Res() res: any,
  ): Promise<any> {
    const signupForm = await this.signupService.findOneSignupForm(
      crewId,
      signupFormId,
    );
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
