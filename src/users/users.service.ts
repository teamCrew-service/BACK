import { Injectable, Body } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';
import { TopicDto } from './dto/topic-user.dto';
import { TopicRepository } from './topic.repository';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private topicRepository: TopicRepository,
  ) {}

  // user 정보 email로 조회
  async findUserByEmail(email: string): Promise<any> {
    const exUser = await this.usersRepository.findUserByEmail(email);
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
  async addUserInfo(@Body() addUserInfoDto: AddUserInfoDto): Promise<any> {
    const addUserInfo = await this.usersRepository.addUserInfo(addUserInfoDto);
    return addUserInfo;
  }

  //topic 정보 입력
  async addTopic(@Body() topicDto: TopicDto): Promise<any> {
    const addTopic = await this.topicRepository.addTopic(topicDto);
    return addTopic;
  }
}
