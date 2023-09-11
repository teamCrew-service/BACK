import { ApiProperty } from '@nestjs/swagger/dist';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitSignupDto {
  // answer1
  @ApiProperty({
    example: '운정 물주먹입니다.',
    description: '답1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly answer1: string;

  //answer2
  @ApiProperty({
    example: '책임감 있는, 부지런한, 웃긴',
    description: '답2',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly answer2: string;
}
