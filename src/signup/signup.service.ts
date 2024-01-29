import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
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
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SignupService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private signupFormRepository: SignupFormRepository,
    private signupRespository: SignupRepository,
    private memberRepository: MemberRepository,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

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
      this.handleException('SignupService/createSignupForm', e);
    }
  }

  /* form 불러오기 */
  async findOneSignupForm(signupFormId: number): Promise<Signupform> {
    try {
      return await this.signupFormRepository.findOneSignupForm(signupFormId);
    } catch (e) {
      this.handleException('SignupService/findOneSignupForm', e);
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
      this.handleException('SignupService/submitSignup', e);
    }
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<Signup> {
    try {
      return await this.signupRespository.findMySignup(userId, crewId);
    } catch (e) {
      this.handleException('SignupService/findMySignup', e);
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
      this.handleException('SignupService/editMySubmitted', e);
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
      this.handleException('SignupService/deleteMySubmitted', e);
    }
  }

  /* 본인이 작성한 signup 모두 조회 */
  async findMyAllSignup(userId: number): Promise<AllSignup[]> {
    try {
      return await this.signupRespository.findMyAllSignup(userId);
    } catch (e) {
      this.handleException('SignupService/findMyAllSignup', e);
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
      this.handleException('SignupService/findAllSubmitted', e);
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
      this.handleException('SignupService/confirmsignup', e);
    }
  }

  /* 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.memberRepository.exitCrew(crewId, userId);
    } catch (e) {
      this.handleException('SignupService/exitCrew', e);
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
      this.handleException('SignupService/deleteSignupAndSignupForm', e);
    }
  }
}
