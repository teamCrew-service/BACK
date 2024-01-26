import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@src/users/users.repository';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { TopicService } from '@src/topic/topic.service';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { AddUserInfoDto } from '@src/users/dto/addUserInfo-user.dto';
import { EditUserInfoDto } from '@src/users/dto/editUserInfo-user.dto';
import { Users } from '@src/users/entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private topicService: TopicService,
  ) {}

  // user 정보 email로 조회
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    try {
      return await this.usersRepository.findUserByEmail(email, provider);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/findUserByEmail');
    }
  }

  // user 정보 findByPk
  async findUserByPk(userId: number): Promise<Users | undefined> {
    try {
      return await this.usersRepository.findUserByPk(userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/findUserByPk');
    }
  }

  // newUser create
  async create({ email, nickname, provider }): Promise<Users> {
    try {
      return await this.usersRepository.create({
        email,
        nickname,
        provider,
      });
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/create');
    }
  }

  // 새로운 유저 추가 정보 입력
  async userInfo(
    addUserInfoDto: AddUserInfoDto,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      return await this.usersRepository.userInfo(addUserInfoDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/userInfo');
    }
  }

  // 유저 정보 edit
  async editUserInfo(
    editUserInfoDto: EditUserInfoDto,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      return await this.usersRepository.editUserInfo(editUserInfoDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/editUserInfo');
    }
  }

  //topic 정보 입력
  async addTopic(topicDto: TopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicService.addTopic(topicDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/addTopic');
    }
  }

  // userId로 topic 정보 받기
  async findTopicById(userId: number): Promise<Object[]> {
    try {
      return await this.topicService.findTopicById(userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/findTopicById');
    }
  }

  //edit topic
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicService.editTopic(editTopicDto, userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/editTopic');
    }
  }

  // nickname으로 체크하기
  async checkNickname(newNickname: string): Promise<string | null> {
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
  async deleteAccount(userId: number): Promise<DeleteResult> {
    try {
      return await this.usersRepository.deleteAccount(userId);
    } catch (e) {
      console.error(e);
      throw new Error('UsersService/deleteAccount');
    }
  }
}
