import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { TopicDto } from '../topic/dto/topic.dto';
import { TopicService } from 'src/topic/topic.service';
import { EditTopicDto } from 'src/topic/dto/editTopic.dto';
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';
import { EditUserInfoDto } from './dto/editUserInfo-user.dto';
import * as AWS from 'aws-sdk';
@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private topicService: TopicService,
  ) {}

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

  /* s3에 저장된 image 삭제 */
  async deleteS3Image(key: string): Promise<any> {
    const bucket = process.env.AWS_BUCKET_NAME || 'YOUR_BUCKET_NAME'; // 환경 변수 또는 직접 값을 입력
    //key(filename) = 'YOUR_S3_OBJECT_KEY_HERE'; // 예: 'images/2020/08/01/abcdef.jpg'

    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY || 'YOUR_ACCESS_KEY',
      secretAccessKey: process.env.AWS_SECRET_KEY || 'YOUR_SECRET_KEY',
      region: process.env.AWS_REGION || 'YOUR_REGION', // 예: 'us-west-1'
    });

    const s3 = new AWS.S3();

    const deleteParams = {
      Bucket: bucket,
      Key: 'profile/' + key,
    };

    const deleteResult = await s3.deleteObject(deleteParams).promise();
    return deleteResult;
  }
}
