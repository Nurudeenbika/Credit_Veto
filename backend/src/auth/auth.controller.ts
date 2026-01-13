import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
//import { access } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return {
      message: 'User registered successfully',
      user: {
        id: user.user.id,
        email: user.user.email,
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        role: user.user.role,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      message: 'Login successful',
      ...result,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const result = await this.authService.refreshToken(
      refreshTokenDto.refreshToken,
    );
    return {
      message: 'Token refreshed successfully',
      ...result,
    };
  }

  @Post('regenerate-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async regenerateToken(
    @Request() req: Request & { user: { userId: string } },
  ) {
    const result = await this.authService.regenerateToken(req.user.userId);
    return {
      message: 'Token regenerated successfully',
      ...result,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: Request & { user: { userId: string } }) {
    await this.authService.logout(req.user.userId);
    return {
      message: 'Logout successful',
    };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getDashboard(@Request() req: Request & { user: { userId: string } }) {
    const dashboardData = await this.authService.getDashboard(req.user.userId);
    return {
      user: {
        //id: dashboardData.id,
        email: dashboardData.email,
        firstName: dashboardData.firstName,
        lastName: dashboardData.lastName,
        role: dashboardData.role,
        //createdAt: dashboardData.createdAt,
      },
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: Request & { user: { userId: string } }) {
    const user = await this.authService.getProfile(req.user.userId);
    return {
      user: {
        //id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        //createdAt: user.createdAt,
      },
    };
  }
}
