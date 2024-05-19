import { Module } from '@nestjs/common';
import { SocketService } from './services';
import { SocketGateway } from './gateways';

@Module({
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
