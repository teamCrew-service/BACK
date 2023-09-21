import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  /* (누구나 참여 가능) 모임 가입 */
  async addMember(crewId: number, userId: number): Promise<any> {
    const signup = await this.memberRepository.addMember(crewId, userId);
    return signup;
  }

  /* member 조회 */
  async findAllMember(crewId: number): Promise<any> {
    const member = await this.memberRepository.findAllMember(crewId);
    return member;
  }

  /* user가 member로 참여한 crewId 조회 */
  async findJoinedCrew(userId: number): Promise<any> {
    const joinedCrew = await this.memberRepository.findJoinedCrew(userId);
    return joinedCrew;
  }
}
