import { Module, forwardRef } from '@nestjs/common';
import { UnsubscribeService } from './unsubscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsubscribeRepository } from './unsubscribe.repository';
import { UsersModule } from 'src/users/users.module';
import { Unsubscribe } from './entities/unsubscribe.entity';
import { TopicModule } from 'src/topic/topic.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unsubscribe]),
    // 순환 의존성
    forwardRef(() => UsersModule),
    forwardRef(() => TopicModule),
  ],
  providers: [UnsubscribeService, UnsubscribeRepository],
  exports: [UnsubscribeService, UnsubscribeRepository],
})
export class UnsubscribeModule {}
