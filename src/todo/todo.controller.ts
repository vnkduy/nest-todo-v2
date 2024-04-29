import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dtos/create.dto';
import { ParamTodoIdDto } from './dtos/param.dto';
import { UpdateTodoDto } from './dtos/update.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('')
  async createTodo(@Body() body: CreateTodoDto): Promise<string> {
    return await this.todoService.createTodo(body);
  }

  @Get('')
  async getAllTodo(): Promise<Todo[]> {
    return await this.todoService.getAllTodo();
  }

  @Get(':id')
  async getTodoById(@Param() params: ParamTodoIdDto): Promise<Todo> {
    return await this.todoService.getTodoById(params.id);
  }

  @Patch(':id')
  async updateTodo(
    @Param() params: ParamTodoIdDto,
    @Body() body: UpdateTodoDto,
  ): Promise<string> {
    return await this.todoService.updateTodo(params.id, body);
  }

  @Delete(':id')
  async deleteTodo(@Param() params: ParamTodoIdDto): Promise<void> {
    return await this.todoService.deleteTodo(params.id);
  }
}
