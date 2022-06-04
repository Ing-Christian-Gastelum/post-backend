import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../service/users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/jwt/jwtStrategy';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Users]),
        JwtModule.register({
          secret: process.env.JWT_SECRET_KEY,
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, JwtStrategy],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
