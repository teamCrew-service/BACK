import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class TopicDto {
  //interestTopic
  @ApiProperty({
    example: '친목',
    description: 'interestTopic',
    required: true,
  })
  @IsString()
  readonly interestTopic: string;
}
