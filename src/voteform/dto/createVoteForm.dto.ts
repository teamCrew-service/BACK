import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoteFormDto {
  //voteTitle
  @ApiProperty({
    example: '일산 호수공원 런닝!!',
    description: 'voteTitle',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  voteTitle: string;

  //voteContent
  @ApiProperty({
    example: '이번주 목요일에 런닝 시간대 투표하겠습니다.',
    description: 'voteContent',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  voteContent: string;

  //voteEndDate
  @ApiProperty({
    example: '2023-08-22T03:44:19.661Z',
    description: 'voteEndDate',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  voteEndDate: Date;

  //voteOption1
  @ApiProperty({
    example: '2시',
    description: 'voteOption1',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  voteOption1: string;

  //voteOption2
  @ApiProperty({
    example: '3시',
    description: 'voteOption2',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  voteOption2: string;

  //voteOption3
  @ApiProperty({
    example: '4시 30분',
    description: 'voteOption3',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteOption3: string;

  //voteOption4
  @ApiProperty({
    example: '6시',
    description: 'voteOption4',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteOption4: string;
}
