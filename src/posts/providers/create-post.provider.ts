import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interfaces';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly tagsService: TagsService,
  ) {}
  public async create(createpostDto: CreatePostDto, user: ActiveUserData) {
    //find the author from the database
    let author;
    let tags: Tag[] = [];
    try {
      author = await this.usersService.getUserById(user.sub);

      if (createpostDto.tags) {
        tags = await this.tagsService.findMultipleTags(createpostDto.tags);
      }
    } catch (error) {
      throw new ConflictException(error);
    }
    if (createpostDto.tags?.length !== tags.length) {
      throw new BadRequestException('Please check your tags');
    }
    if (author) {
      const post = this.postRepository.create({
        ...createpostDto,
        author: author,
        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tags: tags,
      });
      try {
        return await this.postRepository.save(post);
      } catch (error) {
        throw new ConflictException(error);
      }
    }
  }
}
