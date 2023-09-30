import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SaveImageDto {
  //image
  @ApiProperty({
    example: 'url',
    description: 'image',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
