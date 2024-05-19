import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../services';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { ResponseFormat } from 'src/shared';
import { AccessTokenGuard } from 'src/shared/guards';
import { ExecutionContext } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from 'src/entities';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  const mockTaskService = {
    create: jest.fn(),
    getTaskById: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  const mockUserId = 'userId';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {},
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user['sub'] = mockUserId;
          return true;
        }),
      })
      .compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('create', () => {
    it('should create a task and return success response', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        content: 'Test content',
      };
      const createdTask = { id: '1', ...createTaskDto };

      mockTaskService.create.mockResolvedValue(createdTask);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await taskController.create(mockUserId, mockResponse, createTaskDto);

      expect(taskService.create).toHaveBeenCalledWith(
        mockUserId,
        createTaskDto,
      );
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        createdTask,
        'Task Created Successfully',
      );
    });
  });

  describe('getById', () => {
    it('should fetch a task by id and return success response', async () => {
      const taskId = '1';
      const task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
      };

      mockTaskService.getTaskById.mockResolvedValue(task);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await taskController.getById(mockResponse, taskId);

      expect(taskService.getTaskById).toHaveBeenCalledWith(taskId);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        task,
        'Task fetched successfully',
      );
    });
  });

  describe('getAll', () => {
    it('should fetch all tasks for a user and return success response', async () => {
      const tasks = [
        { id: '1', title: 'Test Task 1', description: 'Test Description 1' },
        { id: '2', title: 'Test Task 2', description: 'Test Description 2' },
      ];

      mockTaskService.getAll.mockResolvedValue(tasks);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await taskController.getAll(mockUserId, mockResponse);

      expect(taskService.getAll).toHaveBeenCalledWith(mockUserId);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        tasks,
        'Task fetched successfully',
      );
    });
  });

  describe('update', () => {
    it('should update a task and return success response', async () => {
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      const updatedTask = { id: taskId, ...updateTaskDto };

      mockTaskService.update.mockResolvedValue(updatedTask);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await taskController.update(
        taskId,
        updateTaskDto,
        mockUserId,
        mockResponse,
      );

      expect(taskService.update).toHaveBeenCalledWith(
        mockUserId,
        taskId,
        updateTaskDto,
      );
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        updatedTask,
        'Task udpdated successfully',
      );
    });
  });

  describe('delete', () => {
    it('should delete a task and return success response', async () => {
      const taskId = '1';
      const deletedTask = {
        id: taskId,
        title: 'Deleted Task',
        description: 'Deleted Description',
      };

      mockTaskService.delete.mockResolvedValue(deletedTask);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await taskController.delete(taskId, mockUserId, mockResponse);

      expect(taskService.delete).toHaveBeenCalledWith(mockUserId, taskId);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        deletedTask,
        'Task deleted successfully',
      );
    });
  });
});
