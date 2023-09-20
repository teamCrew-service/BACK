import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditVotingDto {
  //vote
  @ApiProperty({
    example: '25일 (금) 8시',
    description: 'vote',
    required: true,
  })
  @IsString()
  @IsOptional()
  vote: string;
}
