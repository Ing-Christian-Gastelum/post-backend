import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { events } from 'src/enums/events.enums';
import { Repository } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Posts } from '../entities/post.entity';
import { logsPosts } from '../entities/logs-post';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postEntity: Repository<Posts>,
    @InjectRepository(logsPosts) private logsEntity: Repository<logsPosts>,
  ) {}
  async create(
    user: { id: string; username: string },
    createPostDto: CreatePostDto,
  ) {
    const { id, username } = user;
    const { value } = createPostDto;

    const post = await this.postEntity.save({
      value,
      userId: id,
    });
    await this.logsEntity
      .save({ event: `${username} ${events.CREATE} ${post.value}` })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return { message: 'Post creado.' };
  }

  async findAll() {
    return await this.postEntity.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const post = await this.postEntity.findOne({
      where: [{ id }],
    });
    if (post === undefined) {
      throw new NotFoundException({
        message: 'No se encontró Post.',
      });
    }
    return post;
  }

  async update(user: string, id: number, updatePostDto: UpdatePostDto) {
    const { value } = updatePostDto;
    const postFound = await this.postEntity.findOne({
      where: [{ id }],
    });
    if (postFound === undefined) {
      throw new NotFoundException({
        message: 'No se encontró post.',
      });
    }
    const editPost = Object.assign(postFound, {
      value,
    });
    const post = await this.postEntity.save(editPost);
    await this.logsEntity
      .save({ event: `${user} ${events.UPDATE} ${post.value}` })
      .catch((err) => {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      });
    return {
      message: 'Post actualizado',
    };
  }

  async remove(user: string, id: number) {
    const post = await this.postEntity.findOne({
      where: [{ id }],
    });
    if (post === undefined) {
      throw new NotFoundException({
        message: 'No se encontró post.',
      });
    }
    const deleteCustomer = await this.postEntity.delete(id);
    if (deleteCustomer.affected === 1) {
      await this.logsEntity
        .save({ event: `${user} ${events.DELETE} ${post.value}` })
        .catch((err) => {
          throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        });
      return {
        message: 'Post eliminado',
      };
    } else {
      throw new HttpException(
        'problemas en eliminar post.',
        HttpStatus.CONFLICT,
      );
    }
  }

  async findLogsPost() {
    const logs = await this.logsEntity.find();
    return logs;
  }
}
