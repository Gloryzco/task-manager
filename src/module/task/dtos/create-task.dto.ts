import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Title is required.' })
  @IsString()
  @ApiProperty({
    description: `The title of the task.`,
    example: 'Implement authentication on the Task Management System',
    required: true,
    title: 'Title',
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    description: `The description of the task.`,
    example: 'Develop and integrate authentication modules using JWT tokens.',
    required: true,
    title: 'Description',
  })
  readonly description: string;

  @IsString()
  @IsNotEmpty({ message: 'Content is required.' })
  @ApiProperty({
    description: `The detailed content of the task.`,
    example:
      'This task involves setting up user authentication, creating login and registration endpoints, and securing the application using JWT.',
    required: true,
    title: 'Content',
  })
  readonly content: string;
}
