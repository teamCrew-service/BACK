import { Module, forwardRef } from '@nestjs/common';
import { UnsubscribeService } from './unsubscribe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnsubscribeRepository } from './unsubscribe.repository';
import { UsersModule } from 'src/users/users.module';
import { Unsubscribe } from './entities/unsubscribe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Unsubscribe]),
    forwardRef(() => UsersModule),
  ],
  providers: [UnsubscribeService, UnsubscribeRepository],
  exports: [UnsubscribeService, UnsubscribeRepository],
})
export class UnsubscribeModule {}
