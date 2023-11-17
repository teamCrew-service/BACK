import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { EditUserInfoDto } from './dto/editUserInfo-user.dto';
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  // refresh 토큰 저장
  async setRefreshToken(refreshToken: string, userId: any): Promise<any> {
    try {
      await this.usersRepository.update(userId, {
        refreshToken,
      });
      return 'refresh token 저장 성공';
    } catch (e) {
      console.error(e.message);
      throw new Error('UsersRepository / setRefreshToken');
    }
  }

  // refresh 토큰 확인
  async checkRefreshToken(refreshToken: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { refreshToken },
      });
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository / checkRefreshToken');
    }
  }

  // refresh 토큰 제거
  async deleteRefreshToken(refreshToken: string): Promise<any> {
    try {
      await this.usersRepository.update(refreshToken, { refreshToken: null });
      return '토큰 삭제 성공';
    } catch (e) {
      console.error(e);
      throw new Error('UsersService / deleteRefreshToken');
    }
  }

  // email로 유저 정보 찾기
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    try {
      const exUser = await this.usersRepository.findOne({
        where: { email, provider },
      });
      return exUser;
    } catch (e) {
      console.error(e.message);
      throw new Error('UsersRepository / findUserByEmail');
    }
  }

  // userId로 유저 정보 찾기
  async findUserByPk(userId: number): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { userId } });
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository/findUserByPk');
    }
  }

  // 유저 생성
  async create({ email, nickname, provider }): Promise<any> {
    try {
      const user = new Users();
      user.email = email;
      user.nickname = nickname;
      user.provider = provider;
      await this.usersRepository.save(user);
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository/create');
    }
  }

  // 최초 유저 정보 입력
  async userInfo(addUserInfoDto: AddUserInfoDto, userId: number): Promise<any> {
    try {
      const { nickname, profileImage, age, gender, myMessage, location } =
        addUserInfoDto;
      const user = await this.usersRepository.update(
        { userId },
        { nickname, profileImage, age, gender, myMessage, location },
      );
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository / addUserInfo');
    }
  }

  // 유저 정보 edit
  async editUserInfo(
    editUserInfoDto: EditUserInfoDto,
    userId: number,
  ): Promise<any> {
    try {
      const { nickname, profileImage, age, gender, myMessage, location } =
        editUserInfoDto;
      const editUser = await this.usersRepository.update(
        { userId },
        { nickname, profileImage, age, gender, myMessage, location },
      );
      return editUser;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository / editUserInfo');
    }
  }

  // nickname 체크
  async checkNickname(newNickname: string): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({
        where: { nickname: newNickname },
      });
      const exNickname = user ? user.nickname : null;
      return exNickname;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository/checkNickname');
    }
  }

  /* 탈퇴하기 */
  async deleteAccount(userId: number): Promise<any> {
    try {
      const deleteAccount = await this.usersRepository.delete(userId);
      return deleteAccount;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository/deleteAccount');
    }
  }
}
