import { Injectable } from '@nestjs/common';
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
  async userInfo(addUserInfoDto: AddUserInfoDto, userId: number): Promise<any> {
    const addUserInfo = await this.usersRepository.userInfo(
      addUserInfoDto,
      userId,
    );
    return addUserInfo;
  }

  //topic 정보 입력
  async addTopic(topicDto: TopicDto, userId: number): Promise<any> {
    const addTopic = await this.topicService.addTopic(topicDto, userId);
    return addTopic;
  }

  // userId로 topic 정보 받기
  async findTopicById(userId: number): Promise<any> {
    const topic = await this.topicService.findTopicById(userId);
    return topic;
  }

  //edit topic
  async editTopic(topicDto: TopicDto, userId: number): Promise<any> {
    const editTopic = await this.topicService.editTopic(topicDto, userId);
    return editTopic;
  }

  // nickname으로 체크하기
  async checkNickname(newNickname: string): Promise<any> {
    const exNickname = await this.usersRepository.checkNickname(newNickname);
    if (!exNickname) {
      return null;
    }
    return exNickname;
  }
}
