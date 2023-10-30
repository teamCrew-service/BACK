import { Module, forwardRef } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crew } from 'src/crew/entities/crew.entity';
import { HomeRepository } from './home.repository';
import { CrewModule } from 'src/crew/crew.module';
import { scheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Crew]),
    // 순환 의존성
    forwardRef(() => CrewModule),
    forwardRef(() => scheduleModule),
  ],
  controllers: [HomeController],
  providers: [HomeService, HomeRepository],
})
export class HomeModule {}
