import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { MemberRepository } from '@src/member/member.repository';
import { Member } from '@src/member/entities/member.entity';
import JoinedCrew from '@src/member/interface/joinedCrew';
import { DeleteResult } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MemberService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private memberRepository: MemberRepository,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  /* (누구나 참여 가능) 모임 가입 */
  async addMember(crewId: number, userId: number): Promise<Member> {
    try {
      return await this.memberRepository.addMember(crewId, userId);
    } catch (e) {
      this.handleException('MemberService/addMember', e);
    }
  }

  /* member 조회 */
  async findAllMember(crewId: number): Promise<Member[]> {
    try {
      return await this.memberRepository.findAllMember(crewId);
    } catch (e) {
      this.handleException('MemberService/findAllMember', e);
    }
  }

  /* user가 member로 참여한 crewId 조회 */
  async findJoinedCrew(userId: number): Promise<JoinedCrew[]> {
    try {
      return await this.memberRepository.findJoinedCrew(userId);
    } catch (e) {
      this.handleException('MemberService/findJoinedCrew', e);
    }
  }

  /* 모임장 위임에 따라 member 테이블에서 모임장은 member로 위임 받은 사람은 member 테이블에서 삭제 */
  async delegateMember(
    delegator: number,
    crewId: number,
    userId: number,
  ): Promise<string> {
    try {
      await Promise.all([
        this.memberRepository.addMember(crewId, userId),
        this.memberRepository.exitCrew(crewId, delegator),
      ]);

      return 'member 테이블 위임 완료';
    } catch (e) {
      this.handleException('MemberService/delegateMember', e);
    }
  }

  /* crew 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.memberRepository.exitCrew(crewId, userId);
    } catch (e) {
      this.handleException('MemberService/exitCrew', e);
    }
  }

  /* member 삭제 */
  async deleteMember(crewId: number): Promise<DeleteResult> {
    try {
      return await this.memberRepository.deleteMember(crewId);
    } catch (e) {
      this.handleException('MemberService/deleteMember', e);
    }
  }
}
