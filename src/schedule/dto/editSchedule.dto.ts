import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditScheduleDto {
  // scheduleTitle
  @ApiProperty({
    example: '일요일 달리기!!',
    description: 'scheduleTitle',
    required: true,
  })
  @IsString()
  @IsOptional()
  scheduleTitle: string;

  // scheduleContent
  @ApiProperty({
    example: '일요일 달리기 정모가 있습니다!! 많이 나와주세요!!',
    description: 'scheduleTitle',
    required: true,
  })
  @IsString()
  @IsOptional()
  scheduleContent: string;

  // scheduleDDay
  @ApiProperty({
    example: '24일 오후 4시',
    description: 'scheduleDDay',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  scheduleDDay: Date;

  // scheduleAddress
  @ApiProperty({
    example: '일산 호수공원',
    description: 'scheduleAddress',
    required: true,
  })
  @IsString()
  @IsOptional()
  scheduleAddress: string;

  // scheduleLatitude
  @ApiProperty({
    example: 23.010203,
    description: 'scheduleLatitude',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  scheduleLatitude: number;

  // scheduleLongitude
  @ApiProperty({
    example: 106.102032,
    description: 'scheduleLongitude',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  scheduleLongitude: number;
}
