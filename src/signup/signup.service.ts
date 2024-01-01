import { Injectable } from '@nestjs/common';
import { SignupFormRepository } from '@src/signup/signupForm.repository';
import { SignupRepository } from '@src/signup/signup.repository';
import { ConfirmSingupDto } from '@src/signup/dto/confirm-singup.dto';
import { MemberRepository } from '@src/member/member.repository';
import { EditSignupDto } from '@src/signup/dto/editSubmit-signup.dto';

@Injectable()
export class SignupService {
  constructor(
    private signupFormRepository: SignupFormRepository,
    private signupRespository: SignupRepository,
    private memberRepository: MemberRepository,
  ) {}

  /* form 생성 */
  async createSignupForm(
    crewId: number,
    createSignupFormDto: any,
  ): Promise<any> {
    try {
      const createSignupForm = await this.signupFormRepository.createSignupForm(
        crewId,
        createSignupFormDto,
      );
      return createSignupForm;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/createSignupForm');
    }
  }

  /* form 불러오기 */
  async findOneSignupForm(signupFormId: number): Promise<any> {
    try {
      const signupForm = await this.signupFormRepository.findOneSignupForm(
        signupFormId,
      );
      return signupForm;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/findOneSignupForm');
    }
  }

  /* form 작성 후 제출 */
  async submitSignup(
    userId: number,
    crewId: number,
    signupFormId: number,
    submitSignupDto: any,
  ): Promise<any> {
    try {
      const submitSignup = await this.signupRespository.submitSignup(
        userId,
        crewId,
        signupFormId,
        submitSignupDto,
      );
      return submitSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/submitSignup');
    }
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<any> {
    try {
      const signup = await this.signupRespository.findMySignup(userId, crewId);
      return signup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/findMySignup');
    }
  }

  /* 본인이 작성한 signup 수정 */
  async editMySubmitted(
    editSignupDto: EditSignupDto,
    crewId: number,
    signupId: number,
  ): Promise<any> {
    try {
      const editSignup = await this.signupRespository.editMySubmitted(
        editSignupDto,
        crewId,
        signupId,
      );
      return editSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/editMySubmitted');
    }
  }

  /* 본인이 작성한 signup 삭제 */
  async deleteMySubmitted(crewId: number, signupId: number): Promise<any> {
    try {
      const editSignup = await this.signupRespository.deleteMySubmitted(
        crewId,
        signupId,
      );
      return editSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/deleteMySubmitted');
    }
  }

  /* 본인이 작성한 signup 모두 조회 */
  async findMyAllSignup(userId: number): Promise<any> {
    try {
      const allSignup = await this.signupRespository.findMyAllSignup(userId);
      return allSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/findMyAllSignup');
    }
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<any> {
    try {
      const findAllSubmitted = await this.signupRespository.findAllSubmitted(
        crewId,
      );
      findAllSubmitted.forEach((a) => {
        if (a.interestTopics) {
          a.interestTopics = a.interestTopics.split(',');
        }
      });
      return findAllSubmitted;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/findAllSubmitted');
    }
  }

  /* 모임 참여 (방장 승인 여부)API */
  async confirmSingup(
    signupId: number,
    confirmSingupDto: ConfirmSingupDto,
  ): Promise<any> {
    try {
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
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/confirmSingup');
    }
  }

  /* 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<any> {
    try {
      const exitCrew = await this.memberRepository.exitCrew(crewId, userId);
      return exitCrew;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/exitCrew');
    }
  }

  /* crew 삭제에 따른 signup, signupForm 삭제 */
  async deleteSignupAndSignupForm(crewId: number): Promise<any> {
    try {
      const deleteSignup = await Promise.all([
        this.signupRespository.deleteSignup(crewId),
        this.signupFormRepository.deleteSignupForm(crewId),
      ]);

      return deleteSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/deleteSignupAndSignupForm');
    }
  }
}
