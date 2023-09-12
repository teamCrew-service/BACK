import { ApiProperty } from '@nestjs/swagger/dist';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCrewDto {
  //category
  @ApiProperty({
    example: '운동',
    description: 'category',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  //crewAddress
  @ApiProperty({
    example: '홍대입구역 1번 출구',
    description: 'crewAddress',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewAddress: string;

  //crewType
  @ApiProperty({
    example: '번개',
    description: 'crewType',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewType: string;

  //crewDDay
  @ApiProperty({
    example: '2023-08-19T03:44:19.661Z',
    description: 'crewDDay',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  crewDDay: Date;

  //crewMemberInfo
  @ApiProperty({
    example: '털털한 분',
    description: 'crewMemberInfo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewMemberInfo: string;

  //crewTimeInfo
  @ApiProperty({
    example: '2시간',
    description: 'crewTimeInfo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewTimeInfo: string;

  //crewAgeInfo
  @ApiProperty({
    example: '20대 초반 ~ 30대 후반',
    description: 'crewAgeInfo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewAgeInfo: string;

  //crewSignUp
  @ApiProperty({
    example: 1,
    description: 'crewSignUp',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  crewSignup: boolean;

  //crewTitle
  @ApiProperty({
    example: '오늘은 꼭 뛰어야 한다!!',
    description: 'crewTitle',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewTitle: string;

  //crewContent
  @ApiProperty({
    example: '오늘 꼭 뛰고 싶은 사람들 모이세요',
    description: 'crewContent',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  crewContent: string;

  //thumbnail
  @ApiProperty({
    example:
      'https://www.sportsw.kr/news/data/20230627/p1065588600851429_657_thum.jpg',
    description: 'thumbnail',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  thumbnail: string;

  //crewMaxMember
  @ApiProperty({
    example: 8,
    description: 'crewMaxMember',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  crewMaxMember: number;

  //latitude
  @ApiProperty({
    example: 23.010203,
    description: 'latitude',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  //longtitude
  @ApiProperty({
    example: 106.102032,
    description: 'longtitude',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  longtitude: number;
}
