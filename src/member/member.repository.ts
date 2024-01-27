import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '@src/member/entities/member.entity';
import { DeleteResult, Repository } from 'typeorm';
import JoinedCrew from '@src/member/interface/joinedCrew';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}

  /* member 추가 */
  async addMember(crewId: number, userId: number): Promise<Member> {
    try {
      const member = new Member();
      member.userId = userId;
      member.crewId = crewId;
      const addMember = await this.memberRepository.save(member);
      return addMember;
    } catch (e) {
      console.error(e);
      throw new Error('MemberRepository/addMember');
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
      console.error(e);
      throw new Error('MemberRepository/findAllMember');
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
      console.error(e);
      throw new Error('MemberRepository/findJoinedCrew');
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
      console.error(e);
      throw new Error('MemberRepository/exitCrew');
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
      console.error(e);
      throw new Error('MemberRepository/deleteMember');
    }
  }
}
