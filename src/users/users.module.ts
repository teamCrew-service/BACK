import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Topic } from './entities/topic.entity';
import { TopicRepository } from './topic.repository';
import { CrewModule } from 'src/crew/crew.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Topic]),
    forwardRef(() => AuthModule),
    forwardRef(() => CrewModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, TopicRepository],
  exports: [UsersService, UsersRepository, TopicRepository],
})
export class UsersModule {}
