import { MinLength } from 'class-validator';

export class CreateTodoDto {
  @MinLength(6)
  title: string;
}
