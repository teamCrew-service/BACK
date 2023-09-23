import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditUserInfoDto {
  // nickname
  @ApiProperty({
    example: '돌핀맨',
    description: 'nickname',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly nickname: string;

  // age
  @ApiProperty({
    example: 20,
    description: '나이',
    required: true,
  })
  @IsOptional()
  @IsNumber()
  readonly age: number;

  // gender
  @ApiProperty({
    example: '남자',
    description: '성별',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly gender: string;

  // profileImage
  @ApiProperty({
    example: 'url',
    description: '프로필 이미지',
    required: true,
  })
  @IsOptional()
  @IsString()
  readonly profileImage: string;

  // myMessage
  @ApiProperty({
    example: '돌핀 파워!!',
    description: '상태 메시지',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly myMessage: string;

  // location
  @ApiProperty({
    example: '파주시 해솔마을',
    description: '자신의 위치',
    required: true,
  })
  @IsString()
  @IsOptional()
  readonly location: string;
}
