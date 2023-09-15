import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TopicDto {
  //interestTopic
  @ApiProperty({
    example: '친목',
    description: 'interestTopic',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly interestTopic: string;
}
