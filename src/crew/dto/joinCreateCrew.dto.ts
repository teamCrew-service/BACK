import { ApiProperty } from '@nestjs/swagger';
import { CreateCrewDto } from './createCrew.dto';
import { CreateSignupFormDto } from 'src/signup/dto/create-signupForm.dto';

export class JoinCreateCrewDto {
  @ApiProperty({
    description: '크루 생성에 관련된 DTO',
    type: CreateCrewDto,
  })
  createCrewDto: CreateCrewDto;

  @ApiProperty({
    description: '크루 가입에 관련된 DTO',
    type: CreateSignupFormDto,
  })
  createSignupFormDto: CreateSignupFormDto;
}
