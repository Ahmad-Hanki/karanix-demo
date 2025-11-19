import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify } from 'argon2';
import { AuthJwtPayload } from 'src/types';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async validateLocalUser(createAuthDto: { email: string; password: string }) {
    const { email, password } = createAuthDto;
    console.log('AuthService.validateLocalUser called2 ');

    if (!email || !password) {
      throw new HttpException(
        {
          message: 'Email and password are required',
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new HttpException(
        {
          message: 'Invalid email or password',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const isPasswordValid = await verify(user?.password ?? '', password);
      if (!isPasswordValid) {
        throw new HttpException(
          {
            message: 'Invalid email or password',
            error: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } catch (err) {
      throw new HttpException(
        {
          message: 'Error verifying password',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.login(user);
  }

  async login(user: User) {
    const tokens = await this.generateToken(user.id);
    return { ...user, ...tokens };
  }

  async generateToken(userId: string) {
    const payload: AuthJwtPayload = { userId: userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '24h',
    });

    return { accessToken };
  }

  async validateJwtUser(userId: string) {
    // Passport JWT validate callback
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new HttpException(
        {
          message: 'User not found',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { password, ...rest } = user;
    return rest;
  }
}
