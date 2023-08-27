import { IsNumber, IsString } from 'class-validator';

export class CreateSignupFormDto {
  // signupFormId
  @IsNumber()
  readonly signupFormId: number;

  // question1
  @IsString()
  readonly question1: string;

  // question2
  @IsString()
  readonly question2: string;
}
