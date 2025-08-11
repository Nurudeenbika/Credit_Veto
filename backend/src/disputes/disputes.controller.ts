import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('disputes')
@UseGuards(JwtAuthGuard)
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createDispute(
    @Request() req,
    @Body() createDisputeDto: CreateDisputeDto,
  ) {
    const dispute = await this.disputesService.createDispute(
      req.user.userId,
      createDisputeDto,
    );
    return {
      message: 'Dispute created successfully',
      dispute,
    };
  }

  @Get('history')
  async getMyDisputes(@Request() req) {
    const disputes = await this.disputesService.getDisputesByUser(
      req.user.userId,
    );
    return {
      message: 'Dispute history retrieved successfully',
      disputes,
    };
  }

  @Get(':id')
  async getDispute(@Param('id') id: string, @Request() req) {
    const dispute = await this.disputesService.getDisputeById(
      id,
      req.user.userId,
      req.user.role,
    );
    return {
      message: 'Dispute retrieved successfully',
      dispute,
    };
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateDisputeStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDisputeStatusDto,
    @Request() req,
  ) {
    const dispute = await this.disputesService.updateDisputeStatus(
      id,
      updateStatusDto,
      req.user.userId,
    );
    return {
      message: 'Dispute status updated successfully',
      dispute,
    };
  }

  @Put(':id/submit')
  @HttpCode(HttpStatus.OK)
  async submitDispute(@Param('id') id: string, @Request() req) {
    const dispute = await this.disputesService.submitDispute(
      id,
      req.user.userId,
    );
    return {
      message: 'Dispute submitted successfully',
      dispute,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDispute(@Param('id') id: string, @Request() req) {
    await this.disputesService.deleteDispute(
      id,
      req.user.userId,
      req.user.role,
    );
    return {
      message: 'Dispute deleted successfully',
    };
  }

  // Admin routes
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllDisputes() {
    const disputes = await this.disputesService.getAllDisputes();
    return {
      message: 'All disputes retrieved successfully',
      disputes,
    };
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getDisputeStats() {
    const stats = await this.disputesService.getDisputeStats();
    return {
      message: 'Dispute statistics retrieved successfully',
      stats,
    };
  }
}
