import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Crew } from '@src/crew/entities/crew.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCrewDto } from '@src/crew/dto/createCrew.dto';
import { EditCrewDto } from '@src/crew/dto/editCrew.dto';
import CrewDetail from '@src/crew/interface/crewDetail';

@Injectable()
export class CrewRepository {
  constructor(
    @InjectRepository(Crew) private crewRepository: Repository<Crew>,
  ) {}

  /* 권한 검사를 위한 crew 조회 */
  async findCrewForAuth(crewId: number): Promise<Crew> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .select(['userId'])
        .where('crewId = :crewId', { crewId })
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findCrewForAuth');
    }
  }

  /* 관심사 별 모임 찾기 */
  async findByCategory(category: string): Promise<Crew[]> {
    try {
      return await this.crewRepository.find({ where: { category } });
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findByCategory');
    }
  }

  /* 모임 생성 */
  async createCrew(
    createCrewDto: CreateCrewDto,
    userId: number,
  ): Promise<Crew> {
    try {
      const crew = new Crew();
      crew.userId = userId;
      // 프론트에서 전달하는 %2F를 /로 바꿔 넣어주기
      if (createCrewDto.category.includes('%2F') === true) {
        const category = createCrewDto.category.replace('%2F', '/');
        crew.category = category;
      } else {
        crew.category = createCrewDto.category;
      }
      crew.crewAddress = createCrewDto.crewAddress;
      crew.crewPlaceName = createCrewDto.crewPlaceName;
      crew.crewType = createCrewDto.crewType;
      crew.crewDDay = createCrewDto.crewDDay;
      crew.crewMemberInfo = createCrewDto.crewMemberInfo;
      crew.crewTimeInfo = createCrewDto.crewTimeInfo;
      crew.crewTitle = createCrewDto.crewTitle;
      crew.crewContent = createCrewDto.crewContent;
      crew.crewAgeInfo = createCrewDto.crewAgeInfo;
      crew.crewSignup = createCrewDto.crewSignup;
      crew.thumbnail = createCrewDto.thumbnail;
      crew.crewMaxMember = createCrewDto.crewMaxMember;
      crew.latitude = createCrewDto.crewLatitude;
      crew.longtitude = createCrewDto.crewLongtitude;
      await this.crewRepository.save(crew);
      return crew;
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/createCrew');
    }
  }

  /* 모임 글 상세 조회 */
  async findCrewDetail(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .select([
          'crew.crewId AS crewId',
          'crew.userId AS captainId',
          'users.age AS captainAge',
          'users.location AS captainLocation',
          'users.myMessage AS captainMessage',
          'users.nickname AS captainNickname',
          'users.profileImage AS captainProfileImage',
          'crew.category AS category',
          'crew.crewAddress AS crewAddress',
          'crew.crewPlaceName AS crewPlaceName',
          'crew.crewType AS crewType',
          'crew.crewDDay AS crewDDay',
          'crew.crewMemberInfo AS crewMemberInfo',
          'crew.crewAgeInfo AS crewAgeInfo',
          'crew.crewSignup AS crewSignup',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.thumbnail AS thumbnail',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'crew.latitude AS latitude',
          'crew.longtitude AS longtitude',
          'crew.createdAt AS createdAt',
          'crew.deletedAt AS deletedAt',
          'signupform.signupFormId AS signupFormId',
        ])
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .leftJoin('users', 'users', 'users.userId = crew.userId')
        .leftJoin('topic', 'topic', 'topic.userId = crew.userId')
        .leftJoin('signupform', 'signupform', 'signupform.crewId = crew.crewId')
        .where('crew.crewId = :crewId', { crewId })
        .andWhere('crew.deletedAt IS NULL')
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findCrewDetail');
    }
  }

  /* 내가 생성한 모임 */
  async findCreatedCrew(userId: number): Promise<CrewDetail[]> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .select([
          'crew.crewId AS crewId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewPlaceName AS crewPlaceName',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
        ])
        .where('crew.userId = :userId', { userId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .groupBy('crew.crewId')
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findCreatedCrew');
    }
  }

  /* 모임 글 수정 */
  //TODO : 수정할 때, 삭제되었는지 확인하는 로직 필요할듯
  async editCrew(
    crewId: number,
    editCrewDto: EditCrewDto,
  ): Promise<UpdateResult> {
    try {
      const {
        category,
        crewAddress,
        crewPlaceName,
        crewMemberInfo,
        crewTimeInfo,
        crewAgeInfo,
        crewSignup,
        crewTitle,
        crewContent,
        crewMaxMember,
      } = editCrewDto;

      return await this.crewRepository.update(
        { crewId },
        {
          category,
          crewAddress,
          crewPlaceName,
          crewMemberInfo,
          crewTimeInfo,
          crewAgeInfo,
          crewSignup,
          crewTitle,
          crewContent,
          crewMaxMember,
          updatedAt: new Date(),
        },
      );
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/editCrew');
    }
  }

  /* 모임 글 삭제 */
  async deleteCrew(crewId: number): Promise<UpdateResult> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      // softDelete 처리
      return await this.crewRepository.update({ crewId }, { deletedAt: today });
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/deleteCrew');
    }
  }

  /* crewId로 조회하기 */
  async findByCrewId(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .select([
          'crew.crewId AS crewId',
          'crew.userId AS userId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewPlaceName AS crewPlaceName',
          'crew.crewDDay AS crewDDay',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
        ])
        .where('crew.crewId = :crewId', { crewId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findByCrewId');
    }
  }

  /* 대기중인 모임을 위한 조회 */
  async findWaitingPermission(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .select([
          'crew.crewId AS crewId',
          'crew.userId AS userId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewPlaceName AS crewPlaceName',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
        ])
        .where('crew.crewId = :crewId', { crewId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findWaitingPermission');
    }
  }

  /* userId를 이용해 내가 생성한 모임 조회하기 */
  async findMyCrew(userId: number): Promise<Crew[]> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .leftJoin(
          'signup',
          'signup',
          'signup.crewId = crew.crewId AND signup.permission IS NULL',
        )
        .select([
          'crew.crewId AS crewId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewPlaceName AS crewPlaceName',
          'crew.crewDDay AS crewDDay',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
          'CASE WHEN COUNT(signup.crewId) > 0 THEN TRUE ELSE FALSE END AS existSignup',
        ])
        .where('crew.userId = :userId', { userId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .groupBy('crew.crewId')
        .getRawMany();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findMyCrew');
    }
  }

  /* crewId로 Detail하게 조회하기 */
  async findCrewDetailByCrewId(crewId: number): Promise<CrewDetail> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .leftJoin('member', 'member', 'member.crewId = crew.crewId')
        .select([
          'crew.crewId AS crewId',
          'crew.category AS category',
          'crew.crewType AS crewType',
          'crew.crewAddress AS crewAddress',
          'crew.crewPlaceName AS crewPlaceName',
          'crew.crewTitle AS crewTitle',
          'crew.crewContent AS crewContent',
          'crew.crewDDay AS crewDDay',
          'crew.crewMaxMember AS crewMaxMember',
          'COUNT(DISTINCT member.userId) AS crewAttendedMember',
          'crew.thumbnail AS thumbnail',
        ])
        .where('crew.crewId = :crewId', { crewId })
        .andWhere('crew.deletedAt IS NULL')
        .orderBy('crew.createdAt', 'DESC')
        .groupBy('crew.crewId')
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findCrewDetailByCrewId');
    }
  }

  /* myCrew를 하나만 조회하기 */
  async findOneCrew(crewId: number, userId: number): Promise<Crew> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .where('crewId = :crewId', { crewId })
        .andWhere('crew.userId = :userId', { userId })
        .select(['crewId', 'userId'])
        .getRawOne();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/findOneCrew');
    }
  }

  /* 모임장 위임하기 */
  async delegateCrew(
    delegator: number,
    crewId: number,
    userId: number,
  ): Promise<UpdateResult> {
    try {
      return await this.crewRepository
        .createQueryBuilder('crew')
        .update(Crew)
        .set({ userId: delegator })
        .where('crewId = :crewId', { crewId })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/delegateCrew');
    }
  }

  /* Thumbnail 수정하기 */
  async editThumbnail(
    crewId: number,
    thumbnail: string,
  ): Promise<UpdateResult> {
    try {
      return await this.crewRepository.update(
        { crewId },
        { thumbnail: thumbnail },
      );
    } catch (e) {
      console.error(e);
      throw new Error('CrewRepository/editThumbnail');
    }
  }
}
