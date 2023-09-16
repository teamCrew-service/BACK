import { ApiProperty } from '@nestjs/swagger/dist';
import { IsOptional, IsString } from 'class-validator';

export class CreateSignupFormDto {
  // question1
  @ApiProperty({
    example: '자기소개 또는 가입 동기',
    description: '질문 1',
    required: true,
  })
  @IsString()
  @IsOptional() // 값이 없어도 통과되도록 설정
  readonly question1: string;

  // question2
  @ApiProperty({
    example: '나를 표현하는 형용사 3가지는?',
    description: '질문 2',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly question2: string;
}
