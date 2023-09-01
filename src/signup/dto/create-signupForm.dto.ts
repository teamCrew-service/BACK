import { ApiProperty } from '@nestjs/swagger/dist';
import { IsNumber, IsString } from 'class-validator';

export class CreateSignupFormDto {
  // question1
  @ApiProperty({
    example: '자기소개 또는 가입 동기',
    description: '질문 1',
    required: true,
  })
  @IsString()
  readonly question1: string;

  // question2
  @ApiProperty({
    example: '나를 표현하는 형용사 3가지는?',
    description: '질문 2',
    required: true,
  })
  @IsString()
  readonly question2: string;
}
