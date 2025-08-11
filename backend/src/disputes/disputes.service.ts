import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispute } from './entities/dispute.entity';
import { User } from '../users/entities/user.entity';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeStatusDto } from './dto/update-dispute-status.dto';
import { DisputeStatus } from '../common/enums/dispute-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DisputesService {
  private readonly logger = new Logger(DisputesService.name);

  constructor(
    @InjectRepository(Dispute)
    private disputeRepository: Repository<Dispute>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createDispute(
    userId: string,
    createDisputeDto: CreateDisputeDto,
  ): Promise<Dispute> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Add IDs to supporting documents
    const supportingDocuments = createDisputeDto.supportingDocuments?.map(
      (doc) => ({
        ...doc,
        id: uuidv4(),
        uploadedAt: new Date(),
      }),
    );

    const dispute = this.disputeRepository.create({
      ...createDisputeDto,
      userId,
      supportingDocuments,
      status: DisputeStatus.PENDING,
      priority: createDisputeDto.priority || 'medium',
    });

    const savedDispute = await this.disputeRepository.save(dispute);
    this.logger.log(
      `New dispute created: ${savedDispute.id} by user ${userId}`,
    );

    const foundDispute = await this.disputeRepository.findOne({
      where: { id: savedDispute.id },
      relations: ['user'],
    });
    if (!foundDispute) {
      throw new NotFoundException('Dispute not found');
    }
    return foundDispute;
  }

  async getDisputesByUser(userId: string): Promise<Dispute[]> {
    return await this.disputeRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDisputeById(
    disputeId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<Dispute> {
    const dispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
      relations: ['user'],
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Users can only view their own disputes, admins can view all
    if (userRole !== UserRole.ADMIN && dispute.userId !== userId) {
      throw new ForbiddenException('You can only view your own disputes');
    }

    return dispute;
  }

  async getAllDisputes(): Promise<Dispute[]> {
    return await this.disputeRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateDisputeStatus(
    disputeId: string,
    updateStatusDto: UpdateDisputeStatusDto,
    adminId: string,
  ): Promise<Dispute> {
    const admin = await this.userRepository.findOne({ where: { id: adminId } });
    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can update dispute status');
    }

    const dispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
      relations: ['user'],
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Update timestamps based on status
    const updateData: Partial<Dispute> = {
      status: updateStatusDto.status,
      adminNotes: updateStatusDto.adminNotes,
      resolutionNotes: updateStatusDto.resolutionNotes,
    };

    if (
      updateStatusDto.status === DisputeStatus.SUBMITTED &&
      !dispute.submittedAt
    ) {
      updateData.submittedAt = new Date();
    }

    if (
      updateStatusDto.status === DisputeStatus.RESOLVED &&
      !dispute.resolvedAt
    ) {
      updateData.resolvedAt = new Date();
    }

    await this.disputeRepository.update(disputeId, updateData);

    this.logger.log(
      `Dispute ${disputeId} status updated to ${updateStatusDto.status} by admin ${adminId}`,
    );

    const updatedDispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
      relations: ['user'],
    });
    if (!updatedDispute) {
      throw new NotFoundException('Dispute not found');
    }
    return updatedDispute;
  }

  async submitDispute(disputeId: string, userId: string): Promise<Dispute> {
    const dispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
      relations: ['user'],
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    if (dispute.userId !== userId) {
      throw new ForbiddenException('You can only submit your own disputes');
    }

    if (dispute.status !== DisputeStatus.PENDING) {
      throw new ForbiddenException('Only pending disputes can be submitted');
    }

    await this.disputeRepository.update(disputeId, {
      status: DisputeStatus.SUBMITTED,
      submittedAt: new Date(),
    });

    this.logger.log(`Dispute ${disputeId} submitted by user ${userId}`);

    const submittedDispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
      relations: ['user'],
    });
    if (!submittedDispute) {
      throw new NotFoundException('Dispute not found');
    }
    return submittedDispute;
  }

  async deleteDispute(
    disputeId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<void> {
    const dispute = await this.disputeRepository.findOne({
      where: { id: disputeId },
    });

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    // Only allow deletion of pending disputes by the owner or any dispute by admin
    if (userRole !== UserRole.ADMIN) {
      if (dispute.userId !== userId) {
        throw new ForbiddenException('You can only delete your own disputes');
      }
      if (dispute.status !== DisputeStatus.PENDING) {
        throw new ForbiddenException('You can only delete pending disputes');
      }
    }

    await this.disputeRepository.delete(disputeId);
    this.logger.log(`Dispute ${disputeId} deleted by ${userRole} ${userId}`);
  }

  async getDisputeStats(): Promise<any> {
    const totalDisputes = await this.disputeRepository.count();
    const pendingDisputes = await this.disputeRepository.count({
      where: { status: DisputeStatus.PENDING },
    });
    const submittedDisputes = await this.disputeRepository.count({
      where: { status: DisputeStatus.SUBMITTED },
    });
    const underReviewDisputes = await this.disputeRepository.count({
      where: { status: DisputeStatus.UNDER_REVIEW },
    });
    const resolvedDisputes = await this.disputeRepository.count({
      where: { status: DisputeStatus.RESOLVED },
    });

    return {
      total: totalDisputes,
      pending: pendingDisputes,
      submitted: submittedDisputes,
      underReview: underReviewDisputes,
      resolved: resolvedDisputes,
      resolutionRate:
        totalDisputes > 0
          ? ((resolvedDisputes / totalDisputes) * 100).toFixed(2)
          : 0,
    };
  }
}
