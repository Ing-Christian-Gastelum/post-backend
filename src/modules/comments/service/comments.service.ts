import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/modules/posts/entities/post.entity';
import { Comments } from '../entities/comment.entity';

import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Posts) private postEntity: Repository<Posts>,
    @InjectRepository(Comments) private commentEntity: Repository<Comments>,
  ) {}
  async createCommenPost(dto: CreateCommentDto) {
    const { value, id } = dto;
    let newComment = { value };

    const postFound = await this.postEntity.findOne({
      where: [{ id }],
    });
    if (postFound === undefined) {
      throw new ConflictException({
        message: 'No existe post',
      });
    }
    newComment = Object.assign(newComment, {
      postId: postFound.id,
    });

    await this.commentEntity.save(newComment);

    return { message: 'comentario creado.' };
  }
  async createCommentComment(dto: CreateCommentDto) {
    const { value, id } = dto;
    let newComment = { value };

    const commentFound = await this.commentEntity.findOne({
      where: [{ id }],
    });
    if (commentFound === undefined) {
      throw new ConflictException({
        message: 'No existe Comentario',
      });
    }
    newComment = Object.assign(newComment, {
      commentId: commentFound.id,
    });

    await this.commentEntity.save(newComment);

    return { message: 'comentario creado.' };
  }

  async remove(id: number) {
    const comment = await this.commentEntity.findOne({
      where: [{ id }],
    });
    if (comment === undefined) {
      throw new NotFoundException({
        message: 'No se encontró comentario.',
      });
    }
    const deleteCustomer = await this.commentEntity.delete(id);
    if (deleteCustomer.affected === 1) {
      return {
        message: 'Comentario eliminado',
      };
    } else {
      throw new HttpException(
        'problemas en eliminar comentario.',
        HttpStatus.CONFLICT,
      );
    }
  }
}
