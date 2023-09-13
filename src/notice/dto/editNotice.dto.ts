import { IsDate, IsOptional, IsString } from 'class-validator';

export class EditNoticeDto {
  @IsOptional()
  @IsString()
  noticeTitle: string;

  @IsOptional()
  @IsString()
  noticeAddress: string;

  @IsOptional()
  @IsDate()
  noticeDDay: Date;

  @IsOptional()
  @IsString()
  noticeContent: string;
}
