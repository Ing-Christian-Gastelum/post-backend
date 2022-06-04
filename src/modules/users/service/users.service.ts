import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../entities/user.entity';
import { permitUser } from 'src/enums/rols.enums';
import { LoginDto } from '../dto/login-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(Users) private userEntity: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    const userSearch = await this.userEntity.findOne({
      where: { username: process.env.USER_ADMIN },
    });
    if (userSearch) {
      this.logger.log('Admin listo ');
      return;
    }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(process.env.PASSWORD_ADMIN, saltOrRounds);
    await this.userEntity
      .save({
        username: process.env.USER_ADMIN,
        password: hash,
        permission: permitUser.ADMIN,
      })
      .catch((err) => {
        this.logger.error(err.message);
      });
    this.logger.log('Admin creado ');
  }
  async login(data: LoginDto): Promise<{ message: string; token: string }> {
    const { username, password } = data;

    const user = await this.userEntity.findOne({
      where: [{ username }],
    });
    if (!user)
      throw new HttpException('usuario no registrado', HttpStatus.NOT_FOUND);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new HttpException(
        'usuario o contraseña invalidos.',
        HttpStatus.UNAUTHORIZED,
      );
    const payload = {
      id: user.id,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    return {
      message: 'El Usuario ha iniciado sesión con éxito.',
      token: token,
    };
  }
  async create(
    data: CreateUserDto,
  ): Promise<{ message: string; userId: string }> {
    const { username, password, permission } = data;
    const userSearch = await this.userEntity.findOne({
      where: { username },
    });
    if (userSearch)
      throw new HttpException(
        'User ya se encuentra registrado.',
        HttpStatus.BAD_REQUEST,
      );
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const user = await this.userEntity
      .save({
        username,
        password: hash,
        permission: permission,
      })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return { message: 'El Usuario fue registrado.', userId: user.id };
  }

  async findAll(): Promise<Users[]> {
    return await this.userEntity.find({
      where: [{ permission: Not(permitUser.ADMIN) }],
    });
  }

  async findOne(id: string): Promise<Users> {
    const user = await this.userEntity.findOne({
      where: [{ id }],
    });
    if (user === undefined) {
      throw new NotFoundException({
        message: 'No se encontró Usuario.',
      });
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    const { username, password, permission } = updateUserDto;
    const userFound = await this.userEntity.findOne({
      where: [{ id }],
    });
    if (userFound === undefined) {
      throw new NotFoundException({
        message: 'No se encontró usuario.',
      });
    }
    let editUser;
    if (username) {
      const userFound = await this.userEntity.findOne({
        where: [{ username }],
      });
      if (userFound !== undefined) {
        throw new ConflictException({
          message: 'Usuario ya existe',
        });
      }
      editUser = Object.assign(userFound, {
        username,
      });
    }
    if (password) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      editUser = Object.assign(userFound, {
        password: hash,
      });
    }
    if (permission) {
      editUser = Object.assign(userFound, {
        permission,
      });
    }
    return await this.userEntity.save(editUser);
  }

  async remove(id: string): Promise<{
    message: string;
  }> {
    const user = await this.userEntity.findOne({
      where: [{ id }],
    });
    if (user === undefined) {
      throw new NotFoundException({
        message: 'No se encontró Usuario.',
      });
    }
    const deleteCustomer = await this.userEntity.delete(id);
    if (deleteCustomer.affected === 1) {
      return {
        message: 'Usuario Eliminado',
      };
    } else {
      throw new HttpException(
        'problemas en eliminar Usuario.',
        HttpStatus.CONFLICT,
      );
    }
  }

  async validateUserToken(userId: string) {
    const user = await this.userEntity.findOne({
      select: ['id', 'permission', 'username'],
      where: { id: userId },
    });
    if (!user) throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    return user;
  }
}
