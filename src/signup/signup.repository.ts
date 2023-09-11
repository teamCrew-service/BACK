import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signup } from './entities/signup.entity';
import { Repository } from 'typeorm';
import { ConfirmSingupDto } from './dto/confirm-singup.dto';

@Injectable()
export class SingupRepository {
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
    const submitSignup = new Signup();
    submitSignup.crewId = crewId;
    submitSignup.userId = userId;
    submitSignup.signupFormId = signupFormId;
    submitSignup.answer1 = submitSignupDto.answer1;
    submitSignup.answer2 = submitSignupDto.answer2;
    await this.signupRepository.save(submitSignup);
    return submitSignup;
  }

  /* 본인이 작성한 signup확인 */
  async findMySignup(userId: number, crewId: number): Promise<any> {
    const signup = this.signupRepository
      .createQueryBuilder('signup')
      .select(['userId'])
      .where('signup.userId = :userId', { userId })
      .andWhere('signup.crewId = :crewId', { crewId })
      .getRawOne();
    return signup;
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<any> {
    const findAllSubmitted = await this.signupRepository
      .createQueryBuilder('signup')
      .select([
        'signupFormId',
        'answer1',
        'answer2',
        'createdAt',
        'crewId',
        'permission',
        'updatedAt',
        'userId',
      ])
      .where('signup.crewId = :id', { id: crewId })
      .getRawMany();
    return findAllSubmitted;
  }

  /* 모임 참여 (방장 승인 여부)API */
  async confirmSingup(
    signupId: number,
    confirmSingupDto: ConfirmSingupDto,
  ): Promise<any> {
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
      .where('signup.signupId = :id', { id: signupId })
      .getRawOne();
    signup.permission = confirmSingupDto.permission;
    const confirmedSignup = await this.signupRepository.save(signup);
    return confirmedSignup;
  }
}
