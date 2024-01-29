import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { UsersRepository } from '@src/users/users.repository';
import { TopicDto } from '@src/topic/dto/topic.dto';
import { TopicService } from '@src/topic/topic.service';
import { EditTopicDto } from '@src/topic/dto/editTopic.dto';
import { AddUserInfoDto } from '@src/users/dto/addUserInfo-user.dto';
import { EditUserInfoDto } from '@src/users/dto/editUserInfo-user.dto';
import { Users } from '@src/users/entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class UsersService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private usersRepository: UsersRepository,
    private topicService: TopicService,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  // user 정보 email로 조회
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    try {
      return await this.usersRepository.findUserByEmail(email, provider);
    } catch (e) {
      this.handleException('UsersService/findUserByEmail', e);
    }
  }

  // user 정보 findByPk
  async findUserByPk(userId: number): Promise<Users | undefined> {
    try {
      return await this.usersRepository.findUserByPk(userId);
    } catch (e) {
      this.handleException('UsersService/findUserByPk', e);
    }
  }

  // newUser create
  async createUser({ email, nickname, provider }): Promise<Users> {
    try {
      return await this.usersRepository.createUser({
        email,
        nickname,
        provider,
      });
    } catch (e) {
      this.handleException('UsersService/create', e);
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
      this.handleException('UsersService/userInfo', e);
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
      this.handleException('UsersService/editUserInfo', e);
    }
  }

  //topic 정보 입력
  async addTopic(topicDto: TopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicService.addTopic(topicDto, userId);
    } catch (e) {
      this.handleException('UsersService/addTopic', e);
    }
  }

  // userId로 topic 정보 받기
  async findTopicById(userId: number): Promise<Object[]> {
    try {
      return await this.topicService.findTopicById(userId);
    } catch (e) {
      this.handleException('UsersService/findTopicById', e);
    }
  }

  //edit topic
  async editTopic(editTopicDto: EditTopicDto, userId: number): Promise<Object> {
    try {
      return await this.topicService.editTopic(editTopicDto, userId);
    } catch (e) {
      this.handleException('UsersService/editTopic', e);
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
      this.handleException('UsersService/checkNickname', e);
    }
  }

  /* 탈퇴하기 */
  async deleteAccount(userId: number): Promise<DeleteResult> {
    try {
      return await this.usersRepository.deleteAccount(userId);
    } catch (e) {
      this.handleException('UsersService/deleteAccount', e);
    }
  }
}
