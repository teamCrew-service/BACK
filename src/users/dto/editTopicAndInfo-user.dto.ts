import { ApiProperty } from '@nestjs/swagger';
import { EditUserInfoDto } from './editUserInfo-user.dto';
import { EditTopicDto } from 'src/topic/dto/editTopic.dto';

export class EditTopicAndInfoDto {
  @ApiProperty({
    description: '회원 수정 정보 입력에 대한 DTO',
    type: EditUserInfoDto,
  })
  editUserInfoDto: EditUserInfoDto;

  @ApiProperty({
    description: '회원 수정 정보 입력 topic에 대한 DTO',
    type: EditTopicDto,
  })
  editTopicDto: EditTopicDto;
}
