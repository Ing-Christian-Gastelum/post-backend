import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../posts/entities/post.entity';
import { Users } from '../users/entities/user.entity';
import { Comments } from './entities/comment.entity';

import { CommentsController } from './controller/comments.controller';
import { CommentsService } from './service/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Users, Comments])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
