import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  /* crew에 있는 Memeber 조회 */
  async findAllMember(crewId: number): Promise<any> {
    const allMember = await this.memberRepository.findAllMember(crewId);
    return allMember;
  }
}
