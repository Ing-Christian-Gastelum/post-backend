import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  value: string;
}
