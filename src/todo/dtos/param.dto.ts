import { IsUUID } from 'class-validator';

export class ParamTodoIdDto {
  @IsUUID()
  id: string;
}
