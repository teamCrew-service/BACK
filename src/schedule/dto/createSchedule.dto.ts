import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  scheduleTitle: string;

  @IsString()
  @IsNotEmpty()
  scheduleContent: string;

  @IsDate()
  @IsOptional()
  scheduleDDay: Date;

  @IsString()
  @IsNotEmpty()
  scheduleAddress: string;
}
