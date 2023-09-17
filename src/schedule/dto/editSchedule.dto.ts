import { IsDate, IsOptional, IsString } from 'class-validator';

export class EditScheduleDto {
  @IsOptional()
  @IsString()
  scheduleTitle: string;

  @IsOptional()
  @IsString()
  scheduleAddress: string;

  @IsOptional()
  @IsDate()
  scheduleDDay: Date;

  @IsOptional()
  @IsString()
  scheduleContent: string;
}
