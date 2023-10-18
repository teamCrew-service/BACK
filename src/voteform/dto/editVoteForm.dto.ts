import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class EditVoteFormDto {
  //voteTitle
  @ApiProperty({
    example: '일산 호수공원 런닝!!',
    description: 'voteTitle',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormTitle: string;

  //voteContent
  @ApiProperty({
    example: '이번주 목요일에 런닝 시간대 투표하겠습니다.',
    description: 'voteContent',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormContent: string;

  //voteEndDate
  @ApiProperty({
    example: '2023-08-22T03:44:19.661Z',
    description: 'voteEndDate',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  voteFormEndDate: Date;

  //multipleVotes
  @ApiProperty({
    example: true,
    description: 'multipleVotes',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  multipleVotes: boolean;

  //anonymousVote
  @ApiProperty({
    example: true,
    description: 'anonymousVote',
    required: true,
  })
  @IsBoolean()
  @IsOptional()
  anonymousVote: boolean;

  //voteOption1
  @ApiProperty({
    example: '2시',
    description: 'voteOption1',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormOption1: string;

  //voteOption2
  @ApiProperty({
    example: '3시',
    description: 'voteOption2',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormOption2: string;

  //voteOption3
  @ApiProperty({
    example: '4시 30분',
    description: 'voteOption3',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormOption3: string;

  //voteOption4
  @ApiProperty({
    example: '6시',
    description: 'voteOption4',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormOption4: string;

  //voteOption4
  @ApiProperty({
    example: '6시',
    description: 'voteOption4',
    required: true,
  })
  @IsString()
  @IsOptional()
  voteFormOption5: string;
}
