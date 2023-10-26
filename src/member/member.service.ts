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

  /* 모임장 위임에 따라 member 테이블에서 모임장은 member로 위임 받은 사람은 member 테이블에서 삭제 */
  async delegateMember(
    delegator: number,
    crewId: number,
    userId: number,
  ): Promise<any> {
    await this.memberRepository.addMember(crewId, userId);
    await this.memberRepository.exitCrew(crewId, delegator);
    return 'member 테이블 위임 완료';
  }

  /* crew 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<any> {
    const exitCrew = await this.memberRepository.exitCrew(crewId, userId);
    return exitCrew;
  }

  /* member 삭제 */
  async deleteMember(crewId: number): Promise<any> {
    const deleteMember = await this.memberRepository.deleteMember(crewId);
    return deleteMember;
  }
}
