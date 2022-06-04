import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { permitUser } from 'src/enums/rols.enums';
import { JwtAuthGuard } from 'src/jwt/authUser';
import { adminOnly } from 'src/utils/permissions';
import { ValidationIdUser } from 'src/utils/validation';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  login(@Body() dto: LoginDto): Promise<{
    message: string;
    token: string;
  }> {
    return this.usersService.login(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto, @Request() req: any) {
    adminOnly(req.user?.permission);
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    adminOnly(req.user?.permission);
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req: any) {
    adminOnly(req.user?.permission);
    ValidationIdUser(id);
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    adminOnly(req.user?.permission);
    ValidationIdUser(id);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    adminOnly(req.user?.permission);
    ValidationIdUser(id);
    return this.usersService.remove(id);
  }
}
