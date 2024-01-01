import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Leavecrew } from '@src/leavecrew/entities/leavecrew.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LeavecrewRepository {
  constructor(
    @InjectRepository(Leavecrew)
    private leavecrewRepository: Repository<Leavecrew>,
  ) {}

  /* 등록한 탈퇴 명단 삭제해주기 */
  async findAllLeaveCrew(): Promise<any> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );
      const toBeLeaveCrew = await this.leavecrewRepository
        .createQueryBuilder('leavecrew')
        .delete()
        .from(Leavecrew)
        .where('leavecrew.leaveDay = :today', { today })
        .execute();
      return toBeLeaveCrew;
    } catch (e) {
      console.error(e);
      throw new Error('LeavecrewRepository/findAllLeaveCrew');
    }
  }

  /* crew 탈퇴 등록하기 */
  async createLeaveCrew(crewId: number, userId: number): Promise<any> {
    try {
      const koreaTimezoneOffset = 9 * 60;
      const currentDate = new Date();
      const today = new Date(
        currentDate.getTime() + koreaTimezoneOffset * 60000,
      );

      // 7일 뒤 계산
      const sevenDaysLater = new Date(today);
      sevenDaysLater.setDate(today.getDate() + 7);

      const leaveUser = new Leavecrew();
      leaveUser.crewId = crewId;
      leaveUser.userId = userId;
      leaveUser.leaveDay = sevenDaysLater;
      await this.leavecrewRepository.save(leaveUser);
      return;
    } catch (e) {
      console.error(e);
      throw new Error('LeavecrewRepository/createLeaveCrew');
    }
  }

  /* crew 탈퇴자 조회하기 */
  async findOneLeaveUser(crewId: number, userId: number): Promise<any> {
    try {
      const leaveUser = await this.leavecrewRepository
        .createQueryBuilder('leavecrew')
        .select(['crewId', 'leaveDay'])
        .where('leavecrew.userId = :userId', { userId })
        .andWhere('leavecrew.crewId = :crewId', { crewId })
        .getRawOne();

      return leaveUser;
    } catch (e) {
      console.error(e);
      throw new Error('LeavecrewRepository/findOneLeaveUser');
    }
  }
}
