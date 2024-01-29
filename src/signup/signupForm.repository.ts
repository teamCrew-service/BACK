import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Signupform } from '@src/signup/entities/signupForm.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class SignupFormRepository {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Signupform)
    private signupFormRepository: Repository<Signupform>,
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
      const signupForm = new Signupform();
      signupForm.crewId = crewId;
      signupForm.question1 = createSignupFormDto.question1;
      signupForm.question2 = createSignupFormDto.question2;
      await this.signupFormRepository.save(signupForm);
      return signupForm;
    } catch (e) {
      this.handleException('SignupFormRepository/createSignupForm', e);
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
      this.handleException('SignupFormRepository/findOneSignupForm', e);
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
      this.handleException('SignupFormRepository/deleteSignupForm', e);
    }
  }
}
