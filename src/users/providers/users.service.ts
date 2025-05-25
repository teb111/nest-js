import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public getUsers(
    getUsersParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    console.log(getUsersParamDto, limit, page);
    const isAuth = this.authService.isAuthenticated();
    console.log('Is Authenticated:', isAuth);
    return [
      {
        id: 1,
        name: 'John Doe',
      },
      {
        id: 2,
        name: 'Jane Doe',
      },
    ];
  }

  public getUserById(userId: string | undefined) {
    if (!userId) {
      return { id: 0, name: 'User not found' };
    }
    return { id: parseInt(userId, 10), name: `User ${userId}` };
  }
}
