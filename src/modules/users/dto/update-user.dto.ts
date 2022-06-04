import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { permitUser } from 'src/enums/rols.enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNotEmpty()
  @Length(5, 16)
  username: string;

  @IsOptional()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEnum(permitUser)
  permission: permitUser;
}
