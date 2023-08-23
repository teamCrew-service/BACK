import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddUserInfoDto {
  //userId
  @IsNumber()
  readonly userId: number;

  // nickname
  @IsNotEmpty()
  @IsString()
  readonly nickname: string;

  // age
  @IsNotEmpty()
  @IsNumber()
  readonly age: number;

  // gender
  @IsNotEmpty()
  @IsString()
  readonly gender: string;

  // profileImage
  @IsString()
  readonly profileImage: string;

  // myMessage
  @IsString()
  readonly myMessage: string;

  // location
  @IsString()
  readonly location: string;
}
