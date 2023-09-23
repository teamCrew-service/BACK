import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditTopicDto {
  //interestTopic
  @ApiProperty({
    example: '친목',
    description: 'interestTopic',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly interestTopic: string;
}
