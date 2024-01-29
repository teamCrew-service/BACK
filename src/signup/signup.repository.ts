import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signup } from '@src/signup/entities/signup.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ConfirmSignupDto } from '@src/signup/dto/confirm-signup.dto';
import { EditSignupDto } from '@src/signup/dto/editSubmit-signup.dto';
import Submitted from '@src/signup/interface/submitted';
import AllSignup from '@src/signup/interface/AllSignup';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SignupRepository {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Signup) private signupRepository: Repository<Signup>,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  /* signup submit */
  async submitSignup(
    userId: number,
    crewId: number,
    signupFormId: number,
    submitSignupDto: any,
  ): Promise<Signup> {
    try {
      const submitSignup = new Signup();
      submitSignup.crewId = crewId;
      submitSignup.userId = userId;
      submitSignup.signupFormId = signupFormId;
      submitSignup.answer1 = submitSignupDto.answer1;
      submitSignup.answer2 = submitSignupDto.answer2;
      await this.signupRepository.save(submitSignup);
      return submitSignup;
    } catch (e) {
      this.handleException('SignupRepository/submitSignup', e);
    }
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<Signup> {
    try {
      return await this.signupRepository
        .createQueryBuilder('signup')
        .select(['signupId', 'answer1', 'answer2', 'userId', 'permission'])
        .where('signup.userId = :userId', { userId })
        .andWhere('signup.crewId = :crewId', { crewId })
        .getRawOne();
    } catch (e) {
      this.handleException('SignupRepository/findMySignup', e);
    }
  }

  /* 본인이 작성한 signup 수정 */
  async editMySubmitted(
    editSignupDto: EditSignupDto,
    crewId: number,
    signupId: number,
  ): Promise<UpdateResult> {
    try {
      const { answer1, answer2 } = editSignupDto;

      return await this.signupRepository.update(
        { crewId, signupId },
        {
          answer1,
          answer2,
        },
      );
    } catch (e) {
      this.handleException('SignupRepository/editMySubmitted', e);
    }
  }

  /* 본인이 작성한 signup 삭제 */
  async deleteMySubmitted(
    crewId: number,
    signupId: number,
  ): Promise<DeleteResult> {
    try {
      return await this.signupRepository
        .createQueryBuilder('signup')
        .delete()
        .from(Signup)
        .where('signup.crewId = :crewId', { crewId })
        .andWhere('signup.signupId = :signupId', { signupId })
        .execute();
    } catch (e) {
      this.handleException('SignupRepository/deleteMySubmitted', e);
    }
  }

  /* 본인이 작성한 signup 모두 조회하기 */
  async findMyAllSignup(userId: number): Promise<AllSignup[]> {
    try {
      return await this.signupRepository
        .createQueryBuilder('signup')
        .select(['signupId', 'userId', 'crewId'])
        .where('signup.userId = :userId', { userId })
        .andWhere('signup.permission IS NULL')
        .getRawMany();
    } catch (e) {
      this.handleException('SignupRepository/findMyAllSignup', e);
    }
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<Submitted[]> {
    try {
      const findAllSubmitted = await this.signupRepository
        .createQueryBuilder('signup')
        .leftJoin('users', 'users', 'users.userId = signup.userId')
        .leftJoin('topic', 'topic', 'topic.userId = users.userId')
        .where('signup.crewId = :crewId', { crewId })
        .andWhere('signup.permission IS NULL')
        .select([
          'users.nickname AS nickname',
          'users.age AS age',
          'users.location AS location',
          'users.myMessage AS myMessage',
          'users.profileImage AS profileImage',
          'signup.signupId AS signupId',
          'signup.crewId AS crewId',
          'signup.userId AS userId',
          'signup.answer1 AS answer1',
          'signup.answer2 AS answer2',
          'signup.permission AS permission',
          'signup.createdAt AS createdAt',
          'GROUP_CONCAT(topic.interestTopic) AS topics',
        ])
        .groupBy('signup.signupId')
        .orderBy('signup.createdAt', 'ASC')
        .getRawMany();
      return findAllSubmitted;
    } catch (e) {
      this.handleException('SignupRepository/findAllSubmitted', e);
    }
  }

  /* 모임 참여 (방장 승인 여부)API */
  async confirmsignup(
    signupId: number,
    confirmSignupDto: ConfirmSignupDto,
  ): Promise<Signup> {
    try {
      const signup = await this.signupRepository
        .createQueryBuilder('signup')
        .select([
          'signupId',
          'answer1',
          'answer2',
          'crewId',
          'userId',
          'permission',
          'signupFormId',
        ])
        .where('signup.signupId = :signupId', { signupId })
        .getRawOne();
      signup.permission = confirmSignupDto.permission;
      const confirmedSignup = await this.signupRepository.save(signup);
      return confirmedSignup;
    } catch (e) {
      this.handleException('SignupRepository/confirmsignup', e);
    }
  }

  /* crew 삭제에 따른 signup 삭제 */
  async deleteSignup(crewId: number): Promise<DeleteResult> {
    try {
      return await this.signupRepository
        .createQueryBuilder('signup')
        .delete()
        .from(Signup)
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.handleException('SignupRepository/deleteSignup', e);
    }
  }
}
