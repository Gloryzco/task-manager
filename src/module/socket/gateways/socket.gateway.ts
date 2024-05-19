import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/module/task/services';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class SocketGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly taskService: TaskService) {
    this.taskService.taskEvent.on('task.created', (task) => {
      this.server.emit('task.created', task);
    });

    this.taskService.taskEvent.on('task.updated', (updatedTask) => {
      this.server.emit('task.updated', updatedTask);
    });

    this.taskService.taskEvent.on('task.deleted', ({ taskId }) => {
      this.server.emit('task.deleted', { taskId });
    });
  }
}
