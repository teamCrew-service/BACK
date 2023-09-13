import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AddUserInfoDto } from './dto/addUserInfo-user.dto';

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
    const user = await this.usersRepository.findOne({ where: { userId } });
    return user;
  }

  // 유저 생성
  async create({ email, nickname, provider }): Promise<any> {
    const user = new Users();
    user.email = email;
    user.nickname = nickname;
    user.provider = provider;
    await this.usersRepository.save(user);
    return user;
  }

  // 최초 유저 정보 입력
  async userInfo(
    @Body() addUserInfoDto: AddUserInfoDto,
    userId: number,
  ): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { userId } });
      user.nickname = addUserInfoDto.nickname;
      user.age = addUserInfoDto.age;
      user.gender = addUserInfoDto.gender;
      user.profileImage = addUserInfoDto.profileImage;
      user.myMessage = addUserInfoDto.myMessage;
      user.location = addUserInfoDto.location;
      await this.usersRepository.save(user);
      return user;
    } catch (e) {
      console.error(e);
      throw new Error('UsersRepository / addUserInfo');
    }
  }

  // nickname 체크
  async checkNickname(newNickname: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { nickname: newNickname },
    });
    const exNickname = user ? user.nickname : null;
    return exNickname;
  }
}
