import { ApiProperty } from '@nestjs/swagger';
import { AddUserInfoDto } from './addUserInfo-user.dto';
import { TopicDto } from 'src/topic/dto/topic.dto';

export class TopicAndInfoDto {
  @ApiProperty({
    description: '회원 최초 정보 입력에 대한 DTO',
    type: AddUserInfoDto,
  })
  addUserInfoDto: AddUserInfoDto;

  @ApiProperty({
    description: '회원 최초 정보 입력 topic에 대한 DTO',
    type: TopicDto,
  })
  topicDto: TopicDto;
}
