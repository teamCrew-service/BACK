import { Injectable } from '@nestjs/common';
import { SignupFormRepository } from './signupForm.repository';
import { SingupRepository } from './signup.repository';
import { ConfirmSingupDto } from './dto/confirm-singup.dto';
import { MemberRepository } from 'src/member/member.repository';

@Injectable()
export class SignupService {
  constructor(
    private signupFormRepository: SignupFormRepository,
    private signupRespository: SingupRepository,
    private memberRepository: MemberRepository,
  ) {}

  /* form 생성 */
  async createSignupForm(
    crewId: number,
    createSignupFormDto: any,
  ): Promise<any> {
    const createSignupForm = await this.signupFormRepository.createSignupForm(
      crewId,
      createSignupFormDto,
    );
    return createSignupForm;
  }

  /* form 불러오기 */
  async findOneSignupForm(signupFormId: number): Promise<any> {
    const signupForm = await this.signupFormRepository.findOneSignupForm(
      signupFormId,
    );
    return signupForm;
  }

  /* form 작성 후 제출 */
  async submitSignup(
    userId: number,
    crewId: number,
    signupFormId: number,
    submitSignupDto: any,
  ): Promise<any> {
    const submitSignup = await this.signupRespository.submitSignup(
      userId,
      crewId,
      signupFormId,
      submitSignupDto,
    );
    return submitSignup;
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<any> {
    const signup = this.signupRespository.findMySignup(userId, crewId);
    return signup;
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<any> {
    const findAllSubmitted = await this.signupRespository.findAllSubmitted(
      crewId,
    );
    return findAllSubmitted;
  }

  /* 모임 참여 (방장 승인 여부)API */
  async confirmSingup(
    signupId: number,
    confirmSingupDto: ConfirmSingupDto,
  ): Promise<any> {
    const confirmedSignup = await this.signupRespository.confirmSingup(
      signupId,
      confirmSingupDto,
    );
    if (confirmedSignup.permission === true) {
      const crewId = confirmedSignup.crewId;
      const userId = confirmedSignup.userId;
      const addMember = await this.memberRepository.addMember(crewId, userId);
      return { confirmedSignup, addMember };
    }
    if (confirmedSignup.permission === false) {
      return confirmedSignup;
    }
  }
}
