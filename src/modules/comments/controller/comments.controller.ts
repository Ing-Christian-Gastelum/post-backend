import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/authUser';
import { onlyDelete } from 'src/utils/permissions';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentsService } from '../service/comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post('/')
  createCommentComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.createCommentComment(createCommentDto);
  }
  @Post('/post')
  createCommenPost(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.createCommenPost(createCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    onlyDelete(req.user?.permission);
    return this.commentsService.remove(+id);
  }
}
