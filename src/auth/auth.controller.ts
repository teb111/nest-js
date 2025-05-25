import { Controller } from '@nestjs/common';
import { AuthService } from './providers/auth.service';

@Controller('auth')
export class AuthController {
  // This controller will handle authentication-related routes
  // For example, login, logout, register, etc.
  constructor(private readonly authService: AuthService) {}
}
