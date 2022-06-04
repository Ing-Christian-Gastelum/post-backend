import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/authUser';
import {
  adminOnly,
  onlyDelete,
  onlySeeCreateDelete,
  onlyUpdate,
} from 'src/utils/permissions';
import { CreatePostDto } from '../dto/create-post.dto';
import { postQueryDto } from '../dto/PostQuery.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsService } from '../service/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    onlySeeCreateDelete(req.user?.permission);
    return this.postsService.create(req.user, createPostDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req: any,
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    queryParams: postQueryDto,
  ) {
    onlySeeCreateDelete(req.user?.permission);
    return this.postsService.findAll(queryParams);
  }

  @Get('/logs')
  @UseGuards(JwtAuthGuard)
  findLogsPost(@Request() req: any) {
    adminOnly(req.user?.permission);
    return this.postsService.findLogsPost();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Request() req: any) {
    onlySeeCreateDelete(req.user?.permission);
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    onlyUpdate(req.user?.permission);
    return this.postsService.update(req.user?.username, +id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    onlySeeCreateDelete(req.user?.permission);
    return this.postsService.remove(req.user?.username, +id);
  }
}
