import {
  Controller,
  Body,
  Response,
  Post,
  UseGuards,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserId, ResponseFormat, TaskResponseDto } from 'src/shared';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { TaskService } from '../services';
import { AccessTokenGuard } from 'src/shared/guards';

@ApiBearerAuth('JWT')
@UseGuards(AccessTokenGuard)
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiCreatedResponse({
    description: 'Succesfully created task',
    type: TaskResponseDto,
  })
  @Post()
  async create(
    @GetCurrentUserId() userId: string,
    @Response() res,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const userLogin = await this.taskService.create(userId, createTaskDto);
    ResponseFormat.successResponse(
      res,
      userLogin,
      'Task Created Successfully',
      201,
    );
  }

  @ApiOkResponse({
    description: 'Successfully fetched task',
    type: TaskResponseDto,
  })
  @Get(':id')
  async getById(@Response() res, @Query('taskId') taskId: string) {
    const task = await this.taskService.getTaskById(taskId);
    ResponseFormat.successResponse(res, task, 'Task fetched successfully');
  }

  @ApiOkResponse({
    description: 'Successfully fetched tasks',
    type: [TaskResponseDto],
  })
  @Get()
  async getAll(@GetCurrentUserId() userId: string, @Response() res) {
    const task = await this.taskService.getAll(userId);
    ResponseFormat.successResponse(res, task, 'Task fetched successfully');
  }

  @ApiOkResponse({
    description: 'Successfully updated task',
    type: TaskResponseDto,
  })
  @Put(':id')
  async update(
    @Query('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetCurrentUserId() userId: string,
    @Response() res,
  ) {
    const task = await this.taskService.update(userId, taskId, updateTaskDto);
    ResponseFormat.successResponse(res, task, 'Task udpdated successfully');
  }

  @ApiOkResponse({ description: 'Successfully deleted task' })
  @Delete(':id')
  async delete(
    @Query('taskId') taskId: string,
    @GetCurrentUserId() userId: string,
    @Response() res,
  ) {
    const task = await this.taskService.delete(userId, taskId);
    ResponseFormat.successResponse(res, task, 'Task deleted successfully');
  }
}
