import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { TopicDto } from '../topic/dto/topic.dto';
import { TopicService } from 'src/topic/topic.service';
import { EditTopicDto } from 'src/topic/dto/editTopic.dto';
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';
import { EditUserInfoDto } from './dto/editUserInfo-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private topicService: TopicService,
  ) {}

  // refresh 토큰 저장
  async setRefreshToken(refreshToken: string, userId: any): Promise<any> {
    try {
      await this.usersRepository.setRefreshToken(refreshToken, userId);
      return 'refresh token 저장 성공';
    } catch (e) {
      console.error(e.message);
      throw new Error('UsersService / setRefreshToken');
    }
  }

  // refresh 토큰 확인
  async checkRefreshToken(refreshToken: string): Promise<any> {
    try {
      const user = await this.usersRepository.checkRefreshToken(refreshToken);
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService / checkRefreshToken');
    }
  }

  // refresh 토큰 제거
  async deleteRefreshToken(refreshToken: string): Promise<any> {
    try {
      await this.usersRepository.deleteRefreshToken(refreshToken);
      return '토큰 삭제 성공';
    } catch (e) {
      console.error(e);
      throw new Error('UsersService / deleteRefreshToken');
    }
  }

  // user 정보 email로 조회
  async findUserByEmail(email: string, provider: string): Promise<any> {
    try {
      const exUser = await this.usersRepository.findUserByEmail(
        email,
        provider,
      );
      return exUser;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/findUserByEmail');
    }
  }

  // urser 정보 findByPk
  async findUserByPk(userId: number): Promise<any> {
    try {
      const user = await this.usersRepository.findUserByPk(userId);
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/findUserByPk');
    }
  }

  // newUser create
  async create({ email, nickname, provider }): Promise<any> {
    try {
      const user = await this.usersRepository.create({
        email,
        nickname,
        provider,
      });
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/create');
    }
  }

  // 새로운 유저 추가 정보 입력
  async userInfo(addUserInfoDto: AddUserInfoDto, userId: number): Promise<any> {
    try {
      const addUserInfo = await this.usersRepository.userInfo(
        addUserInfoDto,
        userId,
      );
      return addUserInfo;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/userInfo');
    }
  }

  // 유저 정보 edit
  async editUserInfo(
    editUserInfoDto: EditUserInfoDto,
    userId: number,
  ): Promise<any> {
    try {
      const editUserInfo = await this.usersRepository.editUserInfo(
        editUserInfoDto,
        userId,
      );
      return editUserInfo;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/editUserInfo');
    }
  }

  //topic 정보 입력
  async addTopic(topicDto: TopicDto, userId: number): Promise<any> {
    try {
      const addTopic = await this.topicService.addTopic(topicDto, userId);
      return addTopic;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/addTopic');
    }
  }

  // userId로 topic 정보 받기
  async findTopicById(userId: number): Promise<any> {
    try {
      const topic = await this.topicService.findTopicById(userId);
      return topic;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/findTopicById');
    }
  }

  //edit topic
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<any> {
    try {
      const editTopic = await this.topicService.editTopic(editTopicDto, userId);
      return editTopic;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/editTopic');
    }
  }

  // nickname으로 체크하기
  async checkNickname(newNickname: string): Promise<any> {
    try {
      const exNickname = await this.usersRepository.checkNickname(newNickname);
      if (!exNickname) {
        return null;
      }
      return exNickname;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/checkNickname');
    }
  }

  /* 탈퇴하기 */
  async deleteAccount(userId: number): Promise<any> {
    try {
      const deleteAccount = await this.usersRepository.deleteAccount(userId);
      return deleteAccount;
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/deleteAccount');
    }
  }
}
