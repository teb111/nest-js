import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  private posts = [
    { id: 1, title: 'Post 1', content: 'Content of Post 1' },
    { id: 2, title: 'Post 2', content: 'Content of Post 2' },
    { id: 3, title: 'Post 3', content: 'Content of Post 3' },
  ];

  getAllPosts(userId: string | undefined) {
    const user = this.usersService.getUserById(userId);
    return [
      {
        userId: user,
        posts: this.posts,
      },
    ];
  }

  getPostById(id: number) {
    const result = this.posts.find((post) => post.id === id) ?? {
      id: 0,
      title: 'Post not found',
      content: 'No content available',
    };
    if (result.id === 0) {
      return result;
    } else {
      return result;
    }
  }
}
