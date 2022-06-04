import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  id: number;
}
