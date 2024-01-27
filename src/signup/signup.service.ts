import { Injectable } from '@nestjs/common';
import { SignupFormRepository } from '@src/signup/signupForm.repository';
import { SignupRepository } from '@src/signup/signup.repository';
import { ConfirmSignupDto } from '@src/signup/dto/confirm-signup.dto';
import { MemberRepository } from '@src/member/member.repository';
import { EditSignupDto } from '@src/signup/dto/editSubmit-signup.dto';
import { Signupform } from '@src/signup/entities/signupForm.entity';
import { Signup } from '@src/signup/entities/signup.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import Submitted from '@src/signup/interface/submitted';
import AllSignup from './interface/AllSignup';

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
  ): Promise<Signupform> {
    try {
      return await this.signupFormRepository.createSignupForm(
        crewId,
        createSignupFormDto,
      );
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/createSignupForm');
    }
  }

  /* form 불러오기 */
  async findOneSignupForm(signupFormId: number): Promise<Signupform> {
    try {
      return await this.signupFormRepository.findOneSignupForm(signupFormId);
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
  ): Promise<Signup> {
    try {
      return await this.signupRespository.submitSignup(
        userId,
        crewId,
        signupFormId,
        submitSignupDto,
      );
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/submitSignup');
    }
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<Signup> {
    try {
      return await this.signupRespository.findMySignup(userId, crewId);
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
  ): Promise<UpdateResult> {
    try {
      return await this.signupRespository.editMySubmitted(
        editSignupDto,
        crewId,
        signupId,
      );
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/editMySubmitted');
    }
  }

  /* 본인이 작성한 signup 삭제 */
  async deleteMySubmitted(
    crewId: number,
    signupId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.signupRespository.deleteMySubmitted(crewId, signupId);
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/deleteMySubmitted');
    }
  }

  /* 본인이 작성한 signup 모두 조회 */
  async findMyAllSignup(userId: number): Promise<AllSignup[]> {
    try {
      return await this.signupRespository.findMyAllSignup(userId);
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/findMyAllSignup');
    }
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<Submitted[]> {
    try {
      const findAllSubmitted = await this.signupRespository.findAllSubmitted(
        crewId,
      );
      findAllSubmitted.forEach((a) => {
        a.interestTopics = [];
        if (a.topics) {
          a.interestTopics = a.topics.split(',');
        }
      });
      return findAllSubmitted;
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/findAllSubmitted');
    }
  }

  /* 모임 참여 (방장 승인 여부)API */
  async confirmsignup(
    signupId: number,
    confirmSignupDto: ConfirmSignupDto,
  ): Promise<Signup | Object> {
    try {
      const confirmedSignup = await this.signupRespository.confirmsignup(
        signupId,
        confirmSignupDto,
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
      throw new Error('SignupService/confirmsignup');
    }
  }

  /* 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.memberRepository.exitCrew(crewId, userId);
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/exitCrew');
    }
  }

  /* crew 삭제에 따른 signup, signupForm 삭제 */
  async deleteSignupAndSignupForm(crewId: number): Promise<Array<Object>> {
    try {
      return await Promise.all([
        this.signupRespository.deleteSignup(crewId),
        this.signupFormRepository.deleteSignupForm(crewId),
      ]);
    } catch (e) {
      console.error(e);
      throw new Error('SignupService/deleteSignupAndSignupForm');
    }
  }
}
