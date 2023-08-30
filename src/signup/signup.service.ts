import { Injectable } from '@nestjs/common';
import { SignupFormRepository } from './signupForm.repository';
import { SingupRepository } from './signup.repository';

@Injectable()
export class SignupService {
  constructor(
    private signupFormRepository: SignupFormRepository,
    private signupRespository: SingupRepository,
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
    crewId: number,
    signupFormId: number,
    submitSignupDto: any,
  ): Promise<any> {
    const submitSignup = await this.signupRespository.submitSignup(
      crewId,
      signupFormId,
      submitSignupDto,
    );
    return submitSignup;
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<any> {
    const findAllSubmitted = await this.signupRespository.findAllSubmitted(
      crewId,
    );
    return findAllSubmitted;
  }
}
