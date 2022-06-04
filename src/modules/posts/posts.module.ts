import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../users/entities/user.entity';
import { PostsController } from './controller/posts.controller';
import { Posts } from './entities/post.entity';
import { logsPosts } from './entities/logs-post';
import { PostsService } from './service/posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Users, logsPosts])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
