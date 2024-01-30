import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';
import { Signupform } from '@src/signup/entities/signupForm.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SignupFormRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Signupform)
    private signupFormRepository: Repository<Signupform>,
  ) {}

  /* form 생성 */
  async createSignupForm(
    crewId: number,
    createSignupFormDto: any,
  ): Promise<Signupform> {
    try {
      const signupForm = new Signupform();
      signupForm.crewId = crewId;
      signupForm.question1 = createSignupFormDto.question1;
      signupForm.question2 = createSignupFormDto.question2;
      await this.signupFormRepository.save(signupForm);
      return signupForm;
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupFormRepository/createSignupForm',
        e,
      );
    }
  }

  /* form 불러오기 */
  async findOneSignupForm(signupFormId: number): Promise<Signupform> {
    try {
      return await this.signupFormRepository
        .createQueryBuilder('signupform')
        .select([
          'signupFormId',
          'question1',
          'question2',
          'createdAt',
          'crewId',
        ])
        .where('signupform.signupFormId = :signupFormId', { signupFormId })
        .getRawOne();
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupFormRepository/findOneSignupForm',
        e,
      );
    }
  }

  /* crew 삭제에 따른 signupForm 삭제 */
  async deleteSignupForm(crewId: number): Promise<DeleteResult> {
    try {
      return await this.signupFormRepository
        .createQueryBuilder('signupform')
        .delete()
        .from(Signupform)
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.errorHandlingService.handleException(
        'SignupFormRepository/deleteSignupForm',
        e,
      );
    }
  }
}
