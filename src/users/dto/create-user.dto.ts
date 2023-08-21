import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  // email 검증: 공백, string인지 확인
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  // 닉네임 검증: 공백, string인지 확인
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  // provider: 검증
  @IsNotEmpty()
  @IsString()
  readonly provider: string;
}
