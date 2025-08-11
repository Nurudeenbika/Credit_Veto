import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreditProfile,
  CreditAccount,
  CreditInquiry,
  PublicRecord,
} from './entities/credit-profile.entity';
import { User } from '../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreditProfileService {
  private readonly logger = new Logger(CreditProfileService.name);

  constructor(
    @InjectRepository(CreditProfile)
    private creditProfileRepository: Repository<CreditProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getCreditProfile(userId: string): Promise<CreditProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let creditProfile = await this.creditProfileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!creditProfile) {
      // Generate mock credit profile if not exists
      creditProfile = await this.generateMockCreditProfile(userId);
    }

    return creditProfile;
  }

  async refreshCreditProfile(userId: string): Promise<CreditProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete existing profile
    await this.creditProfileRepository.delete({ userId });

    // Generate new mock profile (simulating API refresh)
    const newProfile = await this.generateMockCreditProfile(userId);

    this.logger.log(`Credit profile refreshed for user ${userId}`);
    return newProfile;
  }

  private async generateMockCreditProfile(
    userId: string,
  ): Promise<CreditProfile> {
    // Mock data that simulates Array API or other credit bureau data
    const mockAccounts: CreditAccount[] = [
      {
        id: uuidv4(),
        accountName: 'Chase Freedom Unlimited',
        accountNumber: '****-****-****-1234',
        accountType: 'credit_card',
        accountStatus: 'open',
        creditLimit: 5000,
        currentBalance: 1200,
        paymentStatus: 'current',
        dateOpened: new Date('2020-03-15'),
        monthsReviewed: 48,
        paymentHistory: '●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●',
      },
      {
        id: uuidv4(),
        accountName: 'Wells Fargo Auto Loan',
        accountNumber: '****-****-5678',
        accountType: 'auto_loan',
        accountStatus: 'open',
        currentBalance: 15000,
        paymentStatus: 'current',
        dateOpened: new Date('2021-06-01'),
        monthsReviewed: 32,
        paymentHistory: '●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●',
      },
      {
        id: uuidv4(),
        accountName: 'Capital One Quicksilver',
        accountNumber: '****-****-****-9999',
        accountType: 'credit_card',
        accountStatus: 'closed',
        creditLimit: 3000,
        currentBalance: 0,
        paymentStatus: 'current',
        dateOpened: new Date('2018-01-10'),
        dateClosed: new Date('2023-05-15'),
        monthsReviewed: 64,
        paymentHistory:
          '●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●',
      },
    ];

    const mockInquiries: CreditInquiry[] = [
      {
        id: uuidv4(),
        inquiryType: 'hard',
        creditorName: 'American Express',
        inquiryDate: new Date('2023-09-15'),
        purpose: 'Credit Card Application',
      },
      {
        id: uuidv4(),
        inquiryType: 'hard',
        creditorName: 'Toyota Financial',
        inquiryDate: new Date('2021-06-01'),
        purpose: 'Auto Loan',
      },
    ];

    const mockPublicRecords: PublicRecord[] = [];

    const totalCreditLimit = mockAccounts
      .filter((acc) => acc.creditLimit)
      .reduce((sum, acc) => sum + (acc.creditLimit || 0), 0);

    const totalBalance = mockAccounts.reduce(
      (sum, acc) => sum + acc.currentBalance,
      0,
    );

    const creditUtilization =
      totalCreditLimit > 0 ? (totalBalance / totalCreditLimit) * 100 : 0;

    // Generate credit score based on utilization and payment history
    let baseScore = 720;
    if (creditUtilization > 30) baseScore -= 30;
    else if (creditUtilization > 10) baseScore -= 10;

    // Add some randomness
    const creditScore = Math.max(
      300,
      Math.min(850, baseScore + Math.floor(Math.random() * 40) - 20),
    );

    const creditProfile = this.creditProfileRepository.create({
      userId,
      creditScore,
      creditScoreRange: '300-850',
      reportDate: new Date(),
      paymentHistory: 95,
      creditUtilization: Math.round(creditUtilization * 100) / 100,
      lengthOfCreditHistory: 85,
      newCredit: 90,
      creditMix: 80,
      totalAccounts: mockAccounts.length,
      openAccounts: mockAccounts.filter((acc) => acc.accountStatus === 'open')
        .length,
      closedAccounts: mockAccounts.filter(
        (acc) => acc.accountStatus === 'closed',
      ).length,
      totalCreditLimit,
      totalBalance,
      derogatoryMarks: 0,
      hardInquiries: mockInquiries.filter((inq) => inq.inquiryType === 'hard')
        .length,
      accounts: mockAccounts,
      inquiries: mockInquiries,
      publicRecords: mockPublicRecords,
    });

    return await this.creditProfileRepository.save(creditProfile);
  }

  async getAllCreditProfiles(): Promise<CreditProfile[]> {
    return await this.creditProfileRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  getCreditScoreRange(score: number): string {
    if (score >= 800) return 'Exceptional';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  }
}
