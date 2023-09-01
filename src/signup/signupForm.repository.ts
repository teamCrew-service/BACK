import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signupform } from './entities/signupForm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SignupFormRepository {
  constructor(
    @InjectRepository(Signupform)
    private signupFormRepository: Repository<Signupform>,
  ) {}

  /* form 생성 */
  async createSignupForm(
    crewId: number,
    createSignupFormDto: any,
  ): Promise<any> {
    const signupForm = new Signupform();
    signupForm.crewId = crewId;
    signupForm.question1 = createSignupFormDto.question1;
    signupForm.question2 = createSignupFormDto.question2;
    await this.signupFormRepository.save(signupForm);
    return signupForm;
  }

  /* form 불러오기 */
  async findOneSignupForm(signupFormId: number): Promise<any> {
    const signupForm = await this.signupFormRepository
      .createQueryBuilder('signupForm')
      .select(['signupFormId', 'question1', 'question2', 'createdAt', 'crewId'])
      .where('signupForm.signupFormId = :id', { id: signupFormId })
      .getRawOne();

    return signupForm;
  }
}
