import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { AuthModule, SocketModule, TaskModule, UserModule } from './module';
import { dataSourceOptions } from './database/datasource';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './shared/utils';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TaskModule,
    AuthModule,
    UserModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
