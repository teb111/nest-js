import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  public login(): string {
    // Implement your login logic here

    return `SAMPLLE_TOKEN`;
  }

  public isAuthenticated(): boolean {
    // Implement your authentication logic here
    // For example, check if the token is valid
    return true;
  }
}
