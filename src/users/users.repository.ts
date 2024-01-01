import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { EditUserInfoDto } from '@src/users/dto/editUserInfo-user.dto';
import { AddUserInfoDto } from '@src/users/dto/addUserInfo-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

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
