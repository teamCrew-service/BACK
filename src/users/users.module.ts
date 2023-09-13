import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CrewModule } from 'src/crew/crew.module';
import { TopicModule } from 'src/topic/topic.module';
import { LikeModule } from 'src/like/like.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    forwardRef(() => AuthModule),
    forwardRef(() => CrewModule),
    forwardRef(() => TopicModule),
    forwardRef(() => LikeModule),
    forwardRef(() => MemberModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
