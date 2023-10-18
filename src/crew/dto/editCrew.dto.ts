import { ApiProperty } from '@nestjs/swagger/dist';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class EditCrewDto {
  //category
  @ApiProperty({
    example: '운동',
    description: 'category',
    required: true,
  })
  @IsString()
  @IsOptional()
  category: string;

  //crewAddress
  @ApiProperty({
    example: '홍대입구역 1번 출구',
    description: 'crewAddress',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewAddress: string;

  //crewPlaceName
  @ApiProperty({
    example: '고양체육관',
    description: 'crewPlaceName',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewPlaceName: string;

  //crewMemberInfo
  @ApiProperty({
    example: '털털한 분',
    description: 'crewMemberInfo',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewMemberInfo: string;

  //crewTimeInfo
  @ApiProperty({
    example: '2시간',
    description: 'crewTimeInfo',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewTimeInfo: string;

  //crewAgeInfo
  @ApiProperty({
    example: '20대 초반 ~ 30대 후반',
    description: 'crewAgeInfo',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewAgeInfo: string;

  //crewSignUp
  @ApiProperty({
    example: 1,
    description: 'crewSignUp',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  crewSignup: boolean;

  //crewTitle
  @ApiProperty({
    example: '오늘은 꼭 뛰어야 한다!!',
    description: 'crewTitle',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewTitle: string;

  //crewContent
  @ApiProperty({
    example: '오늘 꼭 뛰고 싶은 사람들 모이세요',
    description: 'crewContent',
    required: true,
  })
  @IsString()
  @IsOptional()
  crewContent: string;

  //crewMaxMember
  @ApiProperty({
    example: 8,
    description: 'crewMaxMember',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  crewMaxMember: number;
}
