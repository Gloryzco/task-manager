import { Controller, Get, Response } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ResponseFormat } from './shared/utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('Health')
  @ApiResponse({
    status: 200,
    description: 'Service Health',
  })
  @ApiOkResponse()
  @Get('health')
  public getHealth(@Response() res) {
    ResponseFormat.successResponse(res, {}, 'Health OK From Task Manager');
  }
}
