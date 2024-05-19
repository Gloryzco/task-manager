import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { Task } from 'src/entities';
import { UserService } from 'src/module/user';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import AppError from 'src/shared/utils/app-error.utils';

describe('TaskService', () => {
  let taskService: TaskService;
  let taskRepository: Repository<Task>;
  let userService: UserService;

  const mockTaskRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const userId = 'userId';
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        content: 'Test content',
      };
      const task = {
        id: '1',
        userId,
        ...createTaskDto,
        toPayload: jest.fn().mockReturnValue({ id: '1', ...createTaskDto }),
      };

      mockUserService.findById.mockResolvedValue(true);
      mockTaskRepository.findOne.mockResolvedValue(null);
      mockTaskRepository.create.mockReturnValue(task);
      mockTaskRepository.insert.mockResolvedValue(undefined);

      const result = await taskService.create(userId, createTaskDto);

      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { userId, title: createTaskDto.title },
      });
      expect(taskRepository.create).toHaveBeenCalledWith({
        userId,
        ...createTaskDto,
      });
      expect(taskRepository.insert).toHaveBeenCalledWith(task);
      expect(result).toEqual({ id: '1', ...createTaskDto });
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 'userId';
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        content: 'Test content',
      };

      mockUserService.findById.mockResolvedValue(null);

      await expect(taskService.create(userId, createTaskDto)).rejects.toThrow(
        new AppError('0002', 'User not found'),
      );
    });

    it('should throw an error if the task with the same title already exists', async () => {
      const userId = 'userId';
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        content: 'Test content',
      };
      const existingTask = { id: '1', userId, ...createTaskDto };

      mockUserService.findById.mockResolvedValue(true);
      mockTaskRepository.findOne.mockResolvedValue(existingTask);

      await expect(taskService.create(userId, createTaskDto)).rejects.toThrow(
        new AppError('0002', 'A task with this title exists for you'),
      );
    });
  });

  describe('getTaskById', () => {
    it('should return a task by ID', async () => {
      const taskId = '1';
      const task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        toPayload: jest.fn().mockReturnValue({
          id: taskId,
          title: 'Test Task',
          description: 'Test Description',
        }),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);

      const result = await taskService.getTaskById(taskId);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(result).toEqual({
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
      });
    });

    // it('should throw an error if the task is not found', async () => {
    //   const taskId = '1';

    //   mockTaskRepository.findOne.mockResolvedValue(null);

    //   await expect(taskService.getTaskById(taskId)).rejects.toThrow(
    //     new AppError('0002', 'Task not found'),
    //   );
    // });
  });

  describe('getAll', () => {
    it('should return all tasks for a user', async () => {
      const userId = 'userId';
      const tasks = [
        {
          id: '1',
          userId,
          title: 'Test Task 1',
          description: 'Test Description 1',
          toPayload: jest.fn().mockReturnValue({
            id: '1',
            title: 'Test Task 1',
            description: 'Test Description 1',
          }),
        },
        {
          id: '2',
          userId,
          title: 'Test Task 2',
          description: 'Test Description 2',
          toPayload: jest.fn().mockReturnValue({
            id: '2',
            title: 'Test Task 2',
            description: 'Test Description 2',
          }),
        },
      ];

      mockTaskRepository.find.mockResolvedValue(tasks);

      const result = await taskService.getAll(userId);

      expect(taskRepository.find).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(tasks.map((task) => task.toPayload()));
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const userId = 'userId';
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      const task = {
        id: taskId,
        userId,
        title: 'Test Task',
        description: 'Test Description',
        toPayload: jest
          .fn()
          .mockReturnValue({ id: taskId, userId, ...updateTaskDto }),
      };

      mockTaskRepository.findOne.mockResolvedValue(task);
      mockTaskRepository.update.mockResolvedValue(undefined);
      mockTaskRepository.findOne.mockResolvedValue({
        ...task,
        ...updateTaskDto,
      });

      const result = await taskService.update(userId, taskId, updateTaskDto);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
      expect(taskRepository.update).toHaveBeenCalledWith(taskId, updateTaskDto);
      expect(result).toEqual({ id: taskId, userId, ...updateTaskDto });
    });

    it('should throw an error if the task is not found', async () => {
      const userId = 'userId';
      const taskId = '1';
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
      };

      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(
        taskService.update(userId, taskId, updateTaskDto),
      ).rejects.toThrow(new AppError('0002', 'Task not found'));
    });
  });

  //   describe('delete', () => {
  //     it('should delete a task successfully', async () => {
  //       const userId = 'userId';
  //       const taskId = '1';
  //       const task = {
  //         id: taskId,
  //         userId,
  //         title: 'Test Task',
  //         description: 'Test Description',
  //       };

  //       mockTaskRepository.findOne.mockResolvedValue(task);
  //       mockTaskRepository.delete.mockResolvedValue({ affected: 1 });

  //       const result = await taskService.delete(userId, taskId);

  //       //   expect(taskRepository.findOne).toHaveBeenCalledWith({
  //       //     where: { id: taskId },
  //       //   });
  //       expect(taskRepository.delete).toHaveBeenCalledWith(taskId);
  //       expect(result).toEqual({ affected: 1 });
  //     });

  //     it('should throw an error if the task is not found', async () => {
  //       const userId = 'userId';
  //       const taskId = '1';

  //       mockTaskRepository.findOne.mockResolvedValue(null);

  //       await expect(taskService.delete(userId, taskId)).rejects.toThrow(
  //         new AppError('0002', 'Task not found'),
  //       );
  //     });
  //   });
});
