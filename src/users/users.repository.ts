import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@src/users/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { EditUserInfoDto } from '@src/users/dto/editUserInfo-user.dto';
import { AddUserInfoDto } from '@src/users/dto/addUserInfo-user.dto';
import { ErrorHandlingService } from '@src/error-handling/error-handling.service';

@Injectable()
export class UsersRepository {
  constructor(
    private readonly errorHandlingService: ErrorHandlingService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  // email로 유저 정보 찾기
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    try {
      return await this.usersRepository.findOne({
        where: { email, provider },
      });
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/findUserByEmail',
        e,
      );
    }
  }

  // userId로 유저 정보 찾기
  async findUserByPk(userId: number): Promise<Users | undefined> {
    try {
      return await this.usersRepository.findOne({ where: { userId } });
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/findUserByPk',
        e,
      );
    }
  }

  // 유저 생성
  async createUser({ email, nickname, provider }): Promise<Users> {
    try {
      const user = new Users();
      user.email = email;
      user.nickname = nickname;
      user.provider = provider;
      await this.usersRepository.save(user);
      return user;
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/createUser',
        e,
      );
    }
  }

  // 최초 유저 정보 입력
  async userInfo(
    addUserInfoDto: AddUserInfoDto,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      const { nickname, profileImage, age, gender, myMessage, location } =
        addUserInfoDto;
      return await this.usersRepository.update(
        { userId },
        { nickname, profileImage, age, gender, myMessage, location },
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/addUserInfo',
        e,
      );
    }
  }

  // 유저 정보 edit
  async editUserInfo(
    editUserInfoDto: EditUserInfoDto,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      const { nickname, profileImage, age, gender, myMessage, location } =
        editUserInfoDto;
      return await this.usersRepository.update(
        { userId },
        { nickname, profileImage, age, gender, myMessage, location },
      );
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/editUserInfo',
        e,
      );
    }
  }

  // nickname 체크
  async checkNickname(newNickname: string): Promise<string | null> {
    try {
      const user = await this.usersRepository.findOne({
        where: { nickname: newNickname },
      });
      return user ? user.nickname : null;
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/checkNickname',
        e,
      );
    }
  }

  /* 탈퇴하기 */
  async deleteAccount(userId: number): Promise<DeleteResult> {
    try {
      return await this.usersRepository.delete(userId);
    } catch (e) {
      this.errorHandlingService.handleException(
        'UsersRepository/deleteAccount',
        e,
      );
    }
  }
}
