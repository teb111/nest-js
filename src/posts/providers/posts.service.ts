import { Body, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
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
    let tags;
    if (createpostDto.tags) {
      tags = await this.tagsService.findMultipleTags(createpostDto.tags);
    }
    if (author) {
      const post = this.postRepository.create({
        ...createpostDto,
        author: author,
        //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tags: tags,
      });
      return await this.postRepository.save(post);
    }
  }

  public async delete(id: number) {
    await this.postRepository.delete(id);
    return { deleted: true, id };
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags;
    if (patchPostDto.tags) {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags);
    }

    const post = await this.postRepository.findOneBy({ id: patchPostDto.id });
    if (post) {
      post.title = patchPostDto.title ?? post?.title;
      post.content = patchPostDto.content ?? post?.content;
      post.postStatus = patchPostDto.status ?? post?.postStatus;
      post.postType = patchPostDto.postType ?? post?.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;
      //eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      post.tags = tags;
      return await this.postRepository.save(post);
    }
  }
}
