import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateTodoDto } from './dtos/create.dto';
import { UpdateTodoDto } from './dtos/update.dto';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let todoService: TodoService;
  let prismaService: PrismaService;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodoPrismaService = {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: { todo: mockTodoPrismaService },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('getAllTodo', () => {
    it('should return an array of todo', async () => {
      jest.spyOn(prismaService.todo, 'findMany').mockResolvedValue([mockTodo]);
      const result = await todoService.getAllTodo();
      expect(prismaService.todo.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('getTodoById', () => {
    it('should throw error if todo not found', async () => {
      jest
        .spyOn(prismaService.todo, 'findUniqueOrThrow')
        .mockRejectedValue({ code: 'P2025' });
      await expect(todoService.getTodoById('1')).rejects.toThrow(
        new HttpException(
          {
            message: 'Todo not found',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    it('should return a todo', async () => {
      jest
        .spyOn(prismaService.todo, 'findUniqueOrThrow')
        .mockResolvedValue(mockTodo);
      const result = await todoService.getTodoById(mockTodo.id);
      expect(prismaService.todo.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: mockTodo.id },
      });
      expect(result).toEqual(mockTodo);
    });
  });
  describe('createTodo', () => {
    const mockNewTodo: CreateTodoDto = {
      title: 'Test',
    };
    it('should throw error if todo title has been used', async () => {
      jest
        .spyOn(prismaService.todo, 'create')
        .mockRejectedValue({ code: 'P2002' });

      await expect(todoService.createTodo(mockNewTodo)).rejects.toThrow(
        new HttpException(
          {
            message: 'This title has been used',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    it('should create a new todo', async () => {
      jest.spyOn(prismaService.todo, 'create').mockResolvedValue(mockTodo);
      const result = await todoService.createTodo(mockNewTodo);
      expect(prismaService.todo.create).toHaveBeenCalled();
      expect(result).toEqual(mockTodo.id);
    });
  });

  describe('updateById', () => {
    const mockUpdateTodo = {
      title: 'Test',
    } as UpdateTodoDto;
    it('should throw error if todo title has been used', async () => {
      jest
        .spyOn(prismaService.todo, 'update')
        .mockRejectedValue({ code: 'P2002' });
      await expect(
        todoService.updateTodo(mockTodo.id, mockUpdateTodo),
      ).rejects.toThrow(
        new HttpException(
          {
            message: 'This title has been used',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    it('should throw error if todo id not found', async () => {
      jest
        .spyOn(prismaService.todo, 'update')
        .mockRejectedValue({ code: 'P2025' });
      await expect(
        todoService.updateTodo(mockTodo.id, mockUpdateTodo),
      ).rejects.toThrow(
        new HttpException(
          {
            message: 'Todo not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should throw message something when wrong', async () => {
      jest.spyOn(prismaService.todo, 'update').mockRejectedValue(new Error());
      await expect(
        todoService.updateTodo(mockTodo.id, mockUpdateTodo),
      ).rejects.toThrow(
        new HttpException(
          {
            message: 'Some thing went wrong !',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
    it('should update a todo', async () => {
      jest.spyOn(prismaService.todo, 'update').mockResolvedValue(mockTodo);
      const result = await todoService.updateTodo(mockTodo.id, mockUpdateTodo);
      expect(prismaService.todo.update).toHaveBeenCalledWith({
        where: {
          id: mockTodo.id,
        },
        data: mockUpdateTodo,
      });
      expect(result).toEqual(mockTodo.id);
    });
  });

  describe('deleteTodo', () => {
    it('should delete successfully', async () => {
      jest.spyOn(prismaService.todo, 'delete');

      await todoService.deleteTodo(mockTodo.id);

      expect(prismaService.todo.delete).toHaveBeenCalledWith({
        where: {
          id: mockTodo.id,
        },
      });
    });
    it('should throw error if todo id not found', async () => {
      jest
        .spyOn(prismaService.todo, 'delete')
        .mockRejectedValue({ code: 'P2025' });
      await expect(todoService.deleteTodo(mockTodo.id)).rejects.toThrow(
        new HttpException(
          {
            message: 'Todo not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
    it('should throw message something when wrong', async () => {
      jest.spyOn(prismaService.todo, 'delete').mockRejectedValue(new Error());
      await expect(todoService.deleteTodo(mockTodo.id)).rejects.toThrow(
        new HttpException(
          {
            message: 'Some thing went wrong !',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
