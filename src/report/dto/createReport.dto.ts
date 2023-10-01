import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReportDto {
  // reportContent
  @ApiProperty({
    example: '정모 신고하기',
    description: 'reportContent',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  reportContent: string;
}
