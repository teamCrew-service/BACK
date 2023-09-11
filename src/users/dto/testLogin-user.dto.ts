import { IsString } from 'class-validator';

export class TestLoginDto {
  @IsString()
  readonly email: string;

  @IsString()
  readonly provider: string;
}
