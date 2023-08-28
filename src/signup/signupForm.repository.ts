import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signupform } from './entities/signupForm.entity';
import { Repository } from 'typeorm';
import { CreateSignupFormDto } from './dto/create-signupForm.dto';

@Injectable()
export class SignupFormRepository {
  constructor(
    @InjectRepository(Signupform)
    private signupFormRepository: Repository<Signupform>,
  ) {}

  /* form 생성 */
  async createSignupForm(
    crewId: number,
    createSignupFormDto: CreateSignupFormDto,
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
    const signupForm = await this.signupFormRepository.findOne({
      where: { signupFormId },
    });
    return signupForm;
  }
}
