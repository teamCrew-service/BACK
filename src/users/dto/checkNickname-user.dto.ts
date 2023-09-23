import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckNicknameDto {
  // nickname 체크
  @ApiProperty({
    example: '돌핀맨',
    description: 'nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly nickname: string;
}
