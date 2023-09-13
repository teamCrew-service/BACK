import { IsString } from 'class-validator';

export class CheckNicknameDto {
  @IsString()
  readonly nickname: string;
}
