import { Module, forwardRef } from '@nestjs/common';
import { UnsubscribeService } from '@src/unsubscribe/unsubscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsubscribeRepository } from '@src/unsubscribe/unsubscribe.repository';
import { UsersModule } from '@src/users/users.module';
import { Unsubscribe } from '@src/unsubscribe/entities/unsubscribe.entity';
import { TopicModule } from '@src/topic/topic.module';

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
