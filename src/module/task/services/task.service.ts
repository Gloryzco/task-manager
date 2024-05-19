import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from 'src/entities';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { UserService } from 'src/module/user';
import AppError from 'src/shared/utils/app-error.utils';
import { EventEmitter } from 'events';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}
  readonly taskCreatedEvent = new EventEmitter();
  readonly taskUpdatedEvent = new EventEmitter();
  readonly taskDeletedEvent = new EventEmitter();

  async create(userId, createTaskDto: CreateTaskDto): Promise<Partial<Task>> {
    const userExists = await this.userService.findById(userId);
    if (!userExists) {
      throw new AppError('0002', 'User not found');
    }
    const existingTask = await this.taskRepository.findOne({
      where: {
        userId: userId,
        title: createTaskDto.title,
      },
    });
    if (existingTask) {
      throw new AppError('0002', 'A task with this title exists for you');
    }
    const task = await this.taskRepository.create({
      userId: userId,
      ...createTaskDto,
    });
    await this.taskRepository.insert(task);
    this.taskCreatedEvent.emit(task as any);
    return task.toPayload();
  }

  async getTaskById(taskId: string): Promise<Partial<Task>> {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new AppError('0002', `Task not found`);
    }
    return task.toPayload();
  }

  async getAll(userId: string): Promise<Partial<Task>[]> {
    const tasks = await this.taskRepository.find({
      where: { userId: userId },
    });
    return tasks.map((task) => task.toPayload());
  }

  async update(
    userId: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Partial<Task>> {
    const task = await this.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new AppError('0002', 'Task not found');
    }
    await this.taskRepository.update(taskId, updateTaskDto);
    const updatedTask = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    this.taskUpdatedEvent.emit(updatedTask as any);
    if (!updatedTask) {
      throw new AppError('0002', 'Failed to update task');
    }
    return updatedTask.toPayload();
  }

  async delete(userId: string, taskId: string): Promise<unknown> {
    const task = await this.getTaskById(taskId);
    if (!task || task.userId !== userId) {
      throw new AppError('0002', 'Task not found');
    }
    this.taskDeletedEvent.emit({ taskId } as any);
    return this.taskRepository.delete(taskId);
  }
}
