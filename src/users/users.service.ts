import { Injectable, Body } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';
import { TopicDto } from '../topic/dto/topic.dto';
import { TopicService } from 'src/topic/topic.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private topicService: TopicService,
  ) {}

  // user 정보 email로 조회
  async findUserByEmail(email: string, provider: string): Promise<any> {
    const exUser = await this.usersRepository.findUserByEmail(email, provider);
    return exUser;
  }

  // urser 정보 findByPk
  async findUserByPk(userId: number): Promise<any> {
    const user = await this.usersRepository.findUserByPk(userId);
    return user;
  }

  // newUser create
  async create({ email, nickname, provider }): Promise<any> {
    const user = await this.usersRepository.create({
      email,
      nickname,
      provider,
    });
    return user;
  }

  // 새로운 유저 추가 정보 입력
  async addUserInfo(
    @Body() addUserInfoDto: AddUserInfoDto,
    userId: number,
  ): Promise<any> {
    const addUserInfo = await this.usersRepository.addUserInfo(
      addUserInfoDto,
      userId,
    );
    return addUserInfo;
  }

  //topic 정보 입력
  async addTopic(@Body() topicDto: TopicDto, userId: number): Promise<any> {
    const addTopic = await this.topicService.addTopic(topicDto, userId);
    return addTopic;
  }
}
