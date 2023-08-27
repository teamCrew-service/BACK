import { IsString } from 'class-validator';

export class SubmitSignupDto {
  // answer1
  @IsString()
  readonly answer1: string;

  //answer2
  @IsString()
  readonly answer2: string;
}
