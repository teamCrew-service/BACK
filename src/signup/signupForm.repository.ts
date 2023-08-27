import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupForm } from './entities/signupForm.entity';
import { Repository } from 'typeorm';
import { CreateSignupFormDto } from './dto/create-signupForm.dto';

@Injectable()
export class SignupFormRepository {
  constructor(
    @InjectRepository(SignupForm)
    private signupFormRepository: Repository<SignupForm>,
  ) {}

  /* form 생성 */
  async createSignupForm(
    crewId: number,
    createSignupFormDto: CreateSignupFormDto,
  ): Promise<any> {
    const signupForm = new SignupForm();
    signupForm.crewId = crewId;
    signupForm.question1 = createSignupFormDto.question1;
    signupForm.question2 = createSignupFormDto.question2;
    await this.signupFormRepository.save(signupForm);
    return signupForm;
  }

  /* form 불러오기 */
  async findOneSignupForm(crewId: number, signupFormId: number): Promise<any> {
    const signupForm = await this.signupFormRepository.findOne({
      where: { crewId, signupFormId },
    });
    return signupForm;
  }
}
