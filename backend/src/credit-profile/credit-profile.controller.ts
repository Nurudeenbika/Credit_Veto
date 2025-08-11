import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreditProfileService } from './credit-profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('credit-profile')
@UseGuards(JwtAuthGuard)
export class CreditProfileController {
  constructor(private readonly creditProfileService: CreditProfileService) {}

  @Get('me')
  async getMyCreditProfile(@Request() req) {
    const creditProfile = await this.creditProfileService.getCreditProfile(
      req.user.userId,
    );
    return {
      message: 'Credit profile retrieved successfully',
      creditProfile: {
        ...creditProfile,
        scoreRange: await this.creditProfileService.getCreditScoreRange(
          creditProfile.creditScore,
        ),
      },
    };
  }

  @Get(':userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getCreditProfileByUserId(@Param('userId') userId: string) {
    const creditProfile =
      await this.creditProfileService.getCreditProfile(userId);
    return {
      message: 'Credit profile retrieved successfully',
      creditProfile: {
        ...creditProfile,
        scoreRange: await this.creditProfileService.getCreditScoreRange(
          creditProfile.creditScore,
        ),
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshMyCreditProfile(@Request() req) {
    const creditProfile = await this.creditProfileService.refreshCreditProfile(
      req.user.userId,
    );
    return {
      message: 'Credit profile refreshed successfully',
      creditProfile: {
        ...creditProfile,
        scoreRange: await this.creditProfileService.getCreditScoreRange(
          creditProfile.creditScore,
        ),
      },
    };
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllCreditProfiles() {
    const creditProfiles =
      await this.creditProfileService.getAllCreditProfiles();
    return {
      message: 'All credit profiles retrieved successfully',
      creditProfiles,
    };
  }
}
