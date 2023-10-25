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
  }

  /* user가 member로 참여한 crewId 조회 */
  async findJoinedCrew(userId: number): Promise<any> {
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
  }

  /* 탈퇴하기 */
  async exitCrew(crewId: number, userId: number): Promise<any> {
    const exitCrew = await this.memberRepository
      .createQueryBuilder('member')
      .delete()
      .from(Member)
      .where('member.crewId = :crewId', { crewId })
      .andWhere('member.userId = :userId', { userId })
      .execute();

    return exitCrew;
  }

  /* member 삭제 */
  async deleteMember(crewId: number): Promise<any> {
    const deleteMember = await this.memberRepository
      .createQueryBuilder('member')
      .delete()
      .from(Member)
      .where('member.crewId = :crewId', { crewId })
      .execute();

    return deleteMember;
  }
}
