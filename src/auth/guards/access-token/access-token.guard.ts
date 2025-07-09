import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the context
    const request: Request = context.switchToHttp().getRequest();
    // Get the authorization header from the request
    const token = this.extractRequestFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No access token provided');
    }
    try {
      // Verify the JWT token
      const payload: object = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      request[REQUEST_USER_KEY] = payload; // Attach the user payload to the request object
      // console.log('Access token payload:', payload);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
    return true;
  }

  private extractRequestFromHeader(request: Request) {
    const [_, token] = request.headers.authorization?.split(' ') || [];
    return token;
  }
}
