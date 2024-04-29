import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateTodoDto } from './dtos/create.dto';
import { UpdateTodoDto } from './dtos/update.dto';

@Injectable()
export class TodoService {
  constructor(private primaService: PrismaService) {}

  createTodo = async (todoData: CreateTodoDto): Promise<string> => {
    try {
      const res = await this.primaService.todo.create({
        data: todoData,
      });

      return res.id;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            message: 'This title has been used',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          message: 'Something went wrong !',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  getAllTodo = async (): Promise<Todo[]> => {
    const todo = await this.primaService.todo.findMany();
    return todo;
  };

  getTodoById = async (id: string): Promise<Todo> => {
    try {
      return await this.primaService.todo.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          {
            message: 'Todo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          message: 'Something went wrong !',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  updateTodo = async (
    id: string,
    { completed, title }: UpdateTodoDto,
  ): Promise<string> => {
    try {
      const res = await this.primaService.todo.update({
        where: {
          id,
        },
        data: {
          title,
          completed,
        },
      });
      return res.id;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          {
            message: 'Todo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error.code === 'P2002') {
        throw new HttpException(
          {
            message: 'This title has been used',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          message: 'Something went wrong !',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };

  deleteTodo = async (id: string): Promise<void> => {
    try {
      await this.primaService.todo.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          {
            message: 'Todo not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          message: 'Something went wrong !',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  };
}
