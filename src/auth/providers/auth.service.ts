import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) // Use forwardRef to avoid circular dependency
    private readonly usersService: UsersService,
  ) {}

  public login(username: string, password: string): string {
    // Implement your login logic here
    const user = this.usersService.getUserById('1234');
    return `SAMPLLE_TOKEN`;
  }

  public isAuthenticated(): boolean {
    // Implement your authentication logic here
    // For example, check if the token is valid
    return true;
  }
}
