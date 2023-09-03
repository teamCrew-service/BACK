import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TopicDto {
  //userId
  @ApiProperty({
    example: 1,
    description: 'userId',
    required: true,
  })
  @IsNumber()
  readonly userId: number;

  //interestTopic
  @ApiProperty({
    example: '친목',
    description: 'interestTopic',
    required: true,
  })
  @IsString()
  readonly interestTopic: string;
}
