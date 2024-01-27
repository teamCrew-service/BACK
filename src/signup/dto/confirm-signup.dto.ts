import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ConfirmSignupDto {
  //permission
  @ApiProperty({
    example: true,
    description: '승인',
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly permission: boolean;
}
