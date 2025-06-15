import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    public readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async getAllPosts(userId: number) {
    await this.usersService.getUserById(userId);
    const posts = await this.postRepository.find({
      // relations: {
      //   author: true,
      // },
    });
    return posts;
  }

  public getPostById(id: number) {
    return { id };
  }

  public async create(@Body() createpostDto: CreatePostDto) {
    //find the author from the database
    const author = await this.usersService.getUserById(createpostDto.authorId);
    if (author) {
      const post = this.postRepository.create({
        ...createpostDto,
        author: author,
      });
      return await this.postRepository.save(post);
    }
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return { deleted: true, id };
  }
}
