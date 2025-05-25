import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dtos/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('{/:userId}')
  getAllPosts(@Param('userId', new ParseIntPipe()) userId: string | undefined) {
    return this.postsService.getAllPosts(userId);
  }

  @Get(':id')
  getPostById(@Param('id', new ParseIntPipe()) id: number) {
    return this.postsService.getPostById(id);
  }

  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    console.log(createPostDto);
  }
}
