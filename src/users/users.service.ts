import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  // user 정보 email로 조회
  async findUserByEmail(email: string): Promise<any> {
    const exUser = await this.usersRepository.findUserByEmail(email);
    return exUser;
  }

  // create
  async create({ email, nickname, provider }): Promise<any> {
    const user = await this.usersRepository.create({
      email,
      nickname,
      provider,
    });
    return user;
  }
}
