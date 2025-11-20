import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() createAuthDto: { email: string; password: string }) {
    return this.authService.validateLocalUser(createAuthDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard) // Only logged-in users can access
  me(@CurrentUser() user): User | null {
    return user;
  }
}
