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
  async findAllMember(crewId: number): Promise<any> {
    try {
      const allMember = await this.memberRepository
        .createQueryBuilder('member')
        .leftJoin('users', 'users', 'users.userId = member.userId')
        .select([
          'member.memberId',
          'member.userId',
          'users.nickname',
          'users.location',
          'users.profileImage',
        ])
        .where('member.crewId = :crewId', { crewId })
        .groupBy('member.memberId')
        .getRawMany();
      return allMember;
    } catch (e) {
      console.error(e);
      throw new Error('MemberRepository/findAllMember');
    }
  }

  /* user가 member로 참여한 crewId 조회 */
  async findJoinedCrew(userId: number): Promise<any> {
    try {
      const joinedCrew = await this.memberRepository
        .createQueryBuilder('member')
        .leftJoin('crew', 'crew', 'crew.crewId = member.crewId')
        .select([
          'crew.crewId',
          'crew.category',
          'crew.crewType',
          'crew.crewAddress',
          'crew.crewTitle',
          'crew.crewDDay',
          'crew.crewContent',
          'crew.crewMaxMember',
          'COUNT(member.crewId) AS crewAttendedMember',
          'crew.thumbnail',
        ])
        .where('member.userId=:userId', { userId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .groupBy('member.memberId')
        .getRawMany();
      return joinedCrew;
    } catch (e) {
      console.error(e);
      throw new Error('MemberRepository/findJoinedCrew');
    }
  }

  /* 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<any> {
    try {
      const exitCrew = await this.memberRepository
        .createQueryBuilder('member')
        .delete()
        .from(Member)
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .execute();
      return exitCrew;
    } catch (e) {
      console.error(e);
      throw new Error('MemberRepository/exitCrew');
    }
  }

  /* member 삭제 */
  async deleteMember(crewId: number): Promise<any> {
    try {
      const deleteMember = await this.memberRepository
        .createQueryBuilder('member')
        .delete()
        .from(Member)
        .where('crewId = :crewId', { crewId })
        .execute();
      return deleteMember;
    } catch (e) {
      console.error(e);
      throw new Error('MemberRepository/deleteMember');
    }
  }
}
