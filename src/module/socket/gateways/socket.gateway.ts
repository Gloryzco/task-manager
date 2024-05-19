import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { TaskService } from 'src/module/task/services';

@WebSocketGateway()
@Injectable()
export class SocketGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly taskService: TaskService) {
    // Listen for task events from TaskService and broadcast updates
    this.taskService.taskCreatedEvent.on('taskCreated', (task) => {
      this.server.emit('taskCreated', task);
    });
    this.taskService.taskUpdatedEvent.on('taskUpdated', (updatedTask) => {
      this.server.emit('taskUpdated', updatedTask);
    });
    this.taskService.taskDeletedEvent.on('taskDeleted', ({ taskId }) => {
      this.server.emit('taskDeleted', { taskId });
    });
  }
}
