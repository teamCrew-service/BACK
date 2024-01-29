import { HttpStatus, Inject, Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '@src/member/entities/member.entity';
import { DeleteResult, Repository } from 'typeorm';
import JoinedCrew from '@src/member/interface/joinedCrew';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class MemberRepository {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  // 에러 처리
  private handleException(context: string, error: Error) {
    this.logger.error(`${context}: ${error.message}`);
    throw {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `An error occurred in ${context}`,
    };
  }

  /* member 추가 */
  async addMember(crewId: number, userId: number): Promise<Member> {
    try {
      const member = new Member();
      member.userId = userId;
      member.crewId = crewId;
      const addMember = await this.memberRepository.save(member);
      return addMember;
    } catch (e) {
      this.handleException('MemberRepository/addMember', e);
    }
  }

  /* member 조회 */
  async findAllMember(crewId: number): Promise<Member[]> {
    try {
      return await this.memberRepository
        .createQueryBuilder('member')
        .leftJoin('users', 'users', 'users.userId = member.userId')
        .select([
          'member.memberId AS memberId',
          'member.userId AS userId',
          'users.nickname AS nickname',
          'users.location AS location',
          'users.profileImage AS profileImage',
        ])
        .where('member.crewId = :crewId', { crewId })
        .groupBy('member.memberId')
        .getRawMany();
    } catch (e) {
      this.handleException('MemberRepository/findAllMember', e);
    }
  }

  /* user가 member로 참여한 crewId 조회 */
  async findJoinedCrew(userId: number): Promise<JoinedCrew[]> {
    try {
      return await this.memberRepository
        .createQueryBuilder('member')
        .leftJoin('crew', 'crew', 'crew.crewId = member.crewId')
        .select([
          'crew.crewId AS crewId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewTitle AS crewTitle',
          'crew.crewDDay AS crewDDay',
          'crew.crewContent AS crewContent',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(member.crewId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
        ])
        .where('member.userId=:userId', { userId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .groupBy('member.memberId')
        .getRawMany();
    } catch (e) {
      this.handleException('MemberRepository/findJoinedCrew', e);
    }
  }

  /* 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<DeleteResult> {
    try {
      return await this.memberRepository
        .createQueryBuilder('member')
        .delete()
        .from(Member)
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (e) {
      this.handleException('MemberRepository/exitCrew', e);
    }
  }

  /* member 삭제 */
  async deleteMember(crewId: number): Promise<DeleteResult> {
    try {
      return await this.memberRepository
        .createQueryBuilder('member')
        .delete()
        .from(Member)
        .where('crewId = :crewId', { crewId })
        .execute();
    } catch (e) {
      this.handleException('MemberRepository/deleteMember', e);
    }
  }
}
