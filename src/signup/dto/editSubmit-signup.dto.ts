import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditSignupDto {
  // answer1
  @ApiProperty({
    example: '운정 물주먹입니다.',
    description: 'answer1',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly answer1: string;

  //answer2
  @ApiProperty({
    example: '책임감 있는, 부지런한, 웃긴',
    description: 'answer2',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly answer2: string;
}
