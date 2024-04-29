import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [TodoModule, TestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
