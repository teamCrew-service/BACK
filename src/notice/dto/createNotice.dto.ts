import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @IsNotEmpty()
  noticeTitle: string;

  @IsString()
  @IsNotEmpty()
  noticeContent: string;

  @IsDate()
  @IsOptional()
  noticeDDay: Date;

  @IsString()
  @IsNotEmpty()
  noticeAddress: string;
}
