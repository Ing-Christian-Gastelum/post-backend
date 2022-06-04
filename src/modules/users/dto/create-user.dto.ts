import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { permitUser } from 'src/enums/rols.enums';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(5, 16)
  username: string;

  @IsNotEmpty()
  @Length(8, 16)
  password: string;

  @IsNotEmpty()
  @IsEnum(permitUser)
  permission: permitUser;
}
