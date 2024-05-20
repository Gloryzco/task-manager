import { Module } from '@nestjs/common';
import { TaskController } from './controllers';
import { TaskService } from './services';
import { UserModule } from '../user';
import { Task } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
