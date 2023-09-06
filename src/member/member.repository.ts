import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  /* member 추가 */
  async addMember(crewId: number, userId: number): Promise<any> {
    const member = new Member();
    member.userId = userId;
    member.crewId = crewId;
    const addMember = await this.memberRepository.save(member);
    return addMember;
  }
}
