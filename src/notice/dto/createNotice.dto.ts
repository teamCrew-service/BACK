import { IsNumber, IsString, IsDate, IsNotEmpty } from 'class-validator';

export class CreateNoticeDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  crewId: number;

  @IsNumber()
  @IsNotEmpty()
  noticeId: number;

  @IsString()
  @IsNotEmpty()
  noticeTitle: string;

  @IsString()
  @IsNotEmpty()
  noticeContent: string;

  @IsDate()
  @IsNotEmpty()
  noticeDDay: Date;

  @IsString()
  @IsNotEmpty()
  noticeAddress: string;
}
