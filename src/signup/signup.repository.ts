import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signup } from './entities/signup.entity';
import { Repository } from 'typeorm';
import { ConfirmSingupDto } from './dto/confirm-singup.dto';
import { EditSignupDto } from './dto/editSubmit-signup.dto';

@Injectable()
export class SignupRepository {
  constructor(
    @InjectRepository(Signup) private signupRepository: Repository<Signup>,
  ) {}

  /* signup submit */
  async submitSignup(
    userId: number,
    crewId: number,
    signupFormId: number,
    submitSignupDto: any,
  ): Promise<any> {
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
      console.error(e);
      throw new Error('SignupRepository/submitSignup');
    }
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<any> {
    try {
      const signup = await this.signupRepository
        .createQueryBuilder('signup')
        .select(['signupId', 'answer1', 'answer2', 'userId', 'permission'])
        .where('signup.userId = :userId', { userId })
        .andWhere('signup.crewId = :crewId', { crewId })
        .getRawOne();
      return signup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/findMySignup');
    }
  }

  /* 본인이 작성한 signup 수정 */
  async editMySubmitted(
    editSignupDto: EditSignupDto,
    crewId: number,
    signupId: number,
  ): Promise<any> {
    try {
      const { answer1, answer2 } = editSignupDto;

      const editSignup = await this.signupRepository.update(
        { crewId, signupId },
        {
          answer1,
          answer2,
        },
      );

      return editSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/editMySubmitted');
    }
  }

  /* 본인이 작성한 signup 삭제 */
  async deleteMySubmitted(crewId: number, signupId: number): Promise<any> {
    try {
      const editSignup = await this.signupRepository
        .createQueryBuilder('signup')
        .delete()
        .from(Signup)
        .where('signup.crewId = :crewId', { crewId })
        .andWhere('signup.signupId = :signupId', { signupId })
        .execute();
      return editSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/deleteMySubmitted');
    }
  }

  /* 본인이 작성한 signup 모두 조회하기 */
  async findMyAllSignup(userId: number): Promise<any> {
    try {
      const allSignup = await this.signupRepository
        .createQueryBuilder('signup')
        .select(['signupId', 'userId', 'crewId'])
        .where('signup.userId = :userId', { userId })
        .andWhere('signup.permission IS NULL')
        .getRawMany();

      return allSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/findMyAllSignup');
    }
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<any> {
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
          'GROUP_CONCAT(topic.interestTopic) AS interestTopics',
        ])
        .groupBy('signup.signupId')
        .orderBy('signup.createdAt', 'ASC')
        .getRawMany();
      return findAllSubmitted;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/findAllSubmitted');
    }
  }

  /* 모임 참여 (방장 승인 여부)API */
  async confirmSingup(
    signupId: number,
    confirmSingupDto: ConfirmSingupDto,
  ): Promise<any> {
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
      signup.permission = confirmSingupDto.permission;
      const confirmedSignup = await this.signupRepository.save(signup);
      return confirmedSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/confirmSingup');
    }
  }

  /* crew 삭제에 따른 signup 삭제 */
  async deleteSignup(crewId: number): Promise<any> {
    try {
      const deleteSignup = await this.signupRepository
        .createQueryBuilder('signup')
        .delete()
        .from(Signup)
        .where('crewId = :crewId', { crewId })
        .execute();
      return deleteSignup;
    } catch (e) {
      console.error(e);
      throw new Error('SignupRepository/deleteSignup');
    }
  }
}
