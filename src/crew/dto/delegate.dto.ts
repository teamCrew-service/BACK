import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DelegateDto {
  //delegator
  @ApiProperty({
    example: 1,
    description: 'delegator',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  delegator: number;
}
