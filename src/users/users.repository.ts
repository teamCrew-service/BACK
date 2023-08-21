import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepositroy: Repository<Users>,
  ) {}

  // email로 유저 정보 찾기
  async findUserByEmail(email: string): Promise<Users | undefined> {
    try {
      const exUser = this.usersRepositroy.findOne({ where: { email } });
      return exUser;
    } catch (e) {
      console.error(e.message);
      throw new Error('UsersRepository / findUserByEmail');
    }
  }

  // 유저 생성
  async create({ email, nickname, provider }): Promise<any> {
    const user = new Users();
    user.email = email;
    user.nickname = nickname;
    user.provider = provider;
    await this.usersRepositroy.save(user);
    return user;
  }
}
