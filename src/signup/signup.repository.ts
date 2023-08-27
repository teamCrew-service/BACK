import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signup } from './entities/signup.entity';
import { Repository } from 'typeorm';
import { SubmitSignupDto } from './dto/submit-signup.dto';

@Injectable()
export class SingupRepository {
  constructor(
    @InjectRepository(Signup) private signupRepository: Repository<Signup>,
  ) {}

  /* signup submit */
  async submitSignup(
    crewId: number,
    signupFormId: number,
    submitSignupDto: SubmitSignupDto,
  ): Promise<any> {
    const submitSignup = new Signup();
    submitSignup.crewId = crewId;
    submitSignup.signupFormId = signupFormId;
    submitSignup.answer1 = submitSignupDto.answer1;
    submitSignup.answer2 = submitSignupDto.answer2;
    await this.signupRepository.save(submitSignup);
    return submitSignup;
  }

  /* 제출한 가입서 조회 */
  async findAllSubmitted(crewId: number): Promise<any> {
    const findAllSubmitted = await this.signupRepository.find({
      where: { crewId },
      relations: ['users'],
    });
    return findAllSubmitted;
  }
}