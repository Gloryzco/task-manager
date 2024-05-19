// dto/update-task.dto.ts

import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(['new', 'in-progress', 'completed'])
  status?: string;
}
