import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dtos/create.dto';
import { UpdateTodoDto } from './dtos/update.dto';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodoService = {
    createTodo: jest.fn(),
    getAllTodo: jest.fn(),
    getTodoById: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('createTodo', () => {
    const mockNewTodo: CreateTodoDto = {
      title: 'Test New Todo',
    };
    it('should return error when title existed', async () => {
      jest.spyOn(todoService, 'createTodo').mockRejectedValue(
        new HttpException(
          {
            message: 'This title has been used',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
      await expect(todoController.createTodo(mockNewTodo)).rejects.toThrow(
        HttpException,
      );
    });
    it('should create a new todo', async () => {
      jest.spyOn(todoService, 'createTodo').mockResolvedValue(mockTodo.id);
      const result = await todoController.createTodo(mockNewTodo);
      expect(todoService.createTodo).toHaveBeenCalled();
      expect(result).toEqual(mockTodo.id);
    });
  });

  describe('getAllTodos', () => {
    it('should get all todos', async () => {
      jest.spyOn(todoService, 'getAllTodo').mockResolvedValue([mockTodo]);
      const result = await todoController.getAllTodo();
      expect(todoService.getAllTodo).toHaveBeenCalled();
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('getTodoById', () => {
    it('should return error when todo not found ', async () => {
      jest.spyOn(todoService, 'getTodoById').mockRejectedValue(
        new HttpException(
          {
            message: 'This todo not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
      await expect(
        todoController.getTodoById({
          id: '2',
        }),
      ).rejects.toThrow(HttpException);
    });
    it('should get a todo by id', async () => {
      jest.spyOn(todoService, 'getTodoById').mockResolvedValue(mockTodo);
      const result = await todoController.getTodoById({ id: mockTodo.id });
      expect(todoService.getTodoById).toHaveBeenCalled();
      expect(result).toEqual(mockTodo);
    });
  });

  describe('updateTodo', () => {
    const mockUpdateTodo: UpdateTodoDto = {
      ...mockTodo,
      title: 'Test Update Todo',
    };
    it('should return error when todo not found ', async () => {
      jest.spyOn(todoService, 'updateTodo').mockRejectedValue(
        new HttpException(
          {
            message: 'This todo not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
      await expect(
        todoController.updateTodo(
          {
            id: '2',
          },
          mockUpdateTodo,
        ),
      ).rejects.toThrow(HttpException);
    });
    it('should update a todo by id', async () => {
      jest.spyOn(todoService, 'updateTodo').mockResolvedValue(mockTodo.id);
      const result = await todoController.updateTodo(
        { id: mockTodo.id },
        mockUpdateTodo,
      );
      expect(todoService.updateTodo).toHaveBeenCalled();
      expect(result).toEqual(mockTodo.id);
    });
  });
  describe('deleteTodo', () => {
    it('should delete a todo by id', async () => {
      jest.spyOn(todoService, 'deleteTodo');
      await todoController.deleteTodo({ id: mockTodo.id });
      expect(todoService.deleteTodo).toHaveBeenCalled();
    });
    it('should return error when todo not found ', async () => {
      jest.spyOn(todoService, 'deleteTodo').mockRejectedValue(
        new HttpException(
          {
            message: 'This todo not found',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
      await expect(
        todoController.deleteTodo({
          id: '2',
        }),
      ).rejects.toThrow(HttpException);
    });
  });
});
