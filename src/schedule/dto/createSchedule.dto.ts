import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateScheduleDto {
  // scheduleTitle
  @ApiProperty({
    example: '일요일 달리기!!',
    description: 'scheduleTitle',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  scheduleTitle: string;

  // scheduleContent
  @ApiProperty({
    example: '일요일 달리기 정모가 있습니다!! 많이 나와주세요!!',
    description: 'scheduleTitle',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  scheduleContent: string;

  // scheduleDDay
  @ApiProperty({
    example: '24일 오후 4시',
    description: 'scheduleDDay',
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  scheduleDDay: Date;

  // scheduleAddress
  @ApiProperty({
    example: '일산 호수공원',
    description: 'scheduleAddress',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  scheduleAddress: string;

  //schedulePlaceName
  @ApiProperty({
    example: '고양체육관',
    description: 'schedulePlaceName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  schedulePlaceName: string;

  // scheduleLatitude
  @ApiProperty({
    example: 23.010203,
    description: 'scheduleLatitude',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  scheduleLatitude: number;

  // scheduleLongitude
  @ApiProperty({
    example: 106.102032,
    description: 'scheduleLongitude',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  scheduleLongitude: number;
}
