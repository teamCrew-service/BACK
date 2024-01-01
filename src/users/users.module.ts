import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from '@src/users/users.controller';
import { UsersService } from '@src/users/users.service';
import { UsersRepository } from '@src/users/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@src/users/entities/user.entity';
import { AuthModule } from '@src/auth/auth.module';
import { CrewModule } from '@src/crew/crew.module';
import { TopicModule } from '@src/topic/topic.module';
import { LikeModule } from '@src/like/like.module';
import { MemberModule } from '@src/member/member.module';
import { SignupModule } from '@src/signup/signup.module';
import { UnsubscribeModule } from '@src/unsubscribe/unsubscribe.module';
import { scheduleModule } from '@src/schedule/schedule.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    // 순환 의존성
    forwardRef(() => AuthModule),
    forwardRef(() => CrewModule),
    forwardRef(() => TopicModule),
    forwardRef(() => LikeModule),
    forwardRef(() => MemberModule),
    forwardRef(() => SignupModule),
    forwardRef(() => UnsubscribeModule),
    forwardRef(() => scheduleModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
