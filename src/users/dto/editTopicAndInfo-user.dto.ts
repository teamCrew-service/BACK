import { ApiProperty } from '@nestjs/swagger';
import { EditUserInfoDto } from '@src/users/dto/editUserInfo-user.dto';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { IsOptional } from 'class-validator';

export class EditTopicAndInfoDto {
  @ApiProperty({
    description: '회원 수정 정보 입력에 대한 DTO',
    type: EditUserInfoDto,
  })
  @IsOptional()
  editUserInfoDto: EditUserInfoDto;

  @ApiProperty({
    description: '회원 수정 정보 입력 topic에 대한 DTO',
    type: EditTopicDto,
  })
  @IsOptional()
  editTopicDto: EditTopicDto;
}
