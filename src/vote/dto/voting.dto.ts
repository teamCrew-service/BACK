import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VotingDto {
  //vote
  @ApiProperty({
    example: '25일 (금) 8시',
    description: 'vote',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  vote: string;
}
