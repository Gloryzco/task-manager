import { Module } from '@nestjs/common';
import { SocketGateway } from './gateways';
import { TaskModule } from '../task';

@Module({
  imports: [TaskModule],
  providers: [SocketGateway],
})
export class SocketModule {}
