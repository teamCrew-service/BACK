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

  /* member 조회 */
  async findAllMember(crewId: number): Promise<any> {
    const allMember = await this.memberRepository
      .createQueryBuilder('member')
      .select(['memberId', 'userId'])
      .where('member.crewId = :id', { id: crewId })
      .getRawMany();
    return allMember;
  }
}
