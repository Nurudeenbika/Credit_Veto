import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CreditProfile } from '../../credit-profile/entities/credit-profile.entity';
import { Dispute } from '../../disputes/entities/dispute.entity';
import { UserRole } from '../../common/enums/user-role.enum';
import { DisputeStatus } from '../../common/enums/dispute-status.enum';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export class InitialDataSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const creditProfileRepository = dataSource.getRepository(CreditProfile);
    const disputeRepository = dataSource.getRepository(Dispute);

    // Clear existing data
    await disputeRepository.delete({});
    await creditProfileRepository.delete({});
    await userRepository.delete({});

    // Create admin user
    const hashedAdminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = userRepository.create({
      email: 'admin@creditmanager.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      //isActive: true,
    });
    await userRepository.save(adminUser);

    // Create test users
    const hashedUserPassword = await bcrypt.hash('user123', 12);

    const user1 = userRepository.create({
      email: 'john.doe@example.com',
      password: hashedUserPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
      //isActive: true,
    });
    await userRepository.save(user1);

    const user2 = userRepository.create({
      email: 'jane.smith@example.com',
      password: hashedUserPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.USER,
      //isActive: true,
    });
    await userRepository.save(user2);

    // Create credit profiles for test users
    const user1CreditProfile = creditProfileRepository.create({
      userId: user1.id,
      creditScore: 720,
      creditScoreRange: '300-850',
      reportDate: new Date(),
      paymentHistory: 95,
      creditUtilization: 15.5,
      lengthOfCreditHistory: 85,
      newCredit: 90,
      creditMix: 80,
      totalAccounts: 5,
      openAccounts: 3,
      closedAccounts: 2,
      totalCreditLimit: 25000,
      totalBalance: 3875,
      derogatoryMarks: 0,
      hardInquiries: 2,
      accounts: [
        {
          id: uuidv4(),
          accountName: 'Chase Freedom Unlimited',
          accountNumber: '****-****-****-1234',
          accountType: 'credit_card',
          accountStatus: 'open',
          creditLimit: 8000,
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
      ],
      inquiries: [
        {
          id: uuidv4(),
          inquiryType: 'hard',
          creditorName: 'American Express',
          inquiryDate: new Date('2023-09-15'),
          purpose: 'Credit Card Application',
        },
      ],
      publicRecords: [],
    });
    await creditProfileRepository.save(user1CreditProfile);

    const user2CreditProfile = creditProfileRepository.create({
      userId: user2.id,
      creditScore: 650,
      creditScoreRange: '300-850',
      reportDate: new Date(),
      paymentHistory: 80,
      creditUtilization: 45.2,
      lengthOfCreditHistory: 70,
      newCredit: 75,
      creditMix: 60,
      totalAccounts: 7,
      openAccounts: 4,
      closedAccounts: 3,
      totalCreditLimit: 18000,
      totalBalance: 8140,
      derogatoryMarks: 1,
      hardInquiries: 4,
      accounts: [
        {
          id: uuidv4(),
          accountName: 'Capital One Quicksilver',
          accountNumber: '****-****-****-9999',
          accountType: 'credit_card',
          accountStatus: 'open',
          creditLimit: 3000,
          currentBalance: 2700,
          paymentStatus: 'late_30',
          dateOpened: new Date('2019-01-10'),
          monthsReviewed: 60,
          paymentHistory:
            '●●●●●●○○●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●',
        },
      ],
      inquiries: [
        {
          id: uuidv4(),
          inquiryType: 'hard',
          creditorName: 'Best Buy',
          inquiryDate: new Date('2023-11-20'),
          purpose: 'Store Card Application',
        },
      ],
      publicRecords: [],
    });
    await creditProfileRepository.save(user2CreditProfile);

    // Create sample disputes
    const dispute1 = disputeRepository.create({
      userId: user1.id,
      title: 'Inaccurate Credit Card Balance',
      description:
        'The balance shown for my Chase Freedom card is incorrect. The current balance should be $800, not $1,200.',
      disputeReason: 'inaccurate_info',
      accountName: 'Chase Freedom Unlimited',
      accountNumber: '****-****-****-1234',
      creditorName: 'Chase Bank',
      disputeAmount: 400,
      status: DisputeStatus.UNDER_REVIEW,
      priority: 'medium',
      submittedAt: new Date('2024-01-15'),
      adminNotes: 'Reviewing documentation provided by user.',
    });
    await disputeRepository.save(dispute1);

    const dispute2 = disputeRepository.create({
      userId: user1.id,
      title: 'Unknown Account on Report',
      description:
        'There is an account from XYZ Credit that I never opened. This appears to be fraudulent.',
      disputeReason: 'identity_theft',
      accountName: 'XYZ Credit Card',
      accountNumber: '****-****-****-5555',
      creditorName: 'XYZ Financial',
      disputeAmount: 2500,
      status: DisputeStatus.PENDING,
      priority: 'high',
    });
    await disputeRepository.save(dispute2);

    const dispute3 = disputeRepository.create({
      userId: user2.id,
      title: 'Paid Off Student Loan Still Showing Balance',
      description:
        'My student loan was paid off in full in December 2023, but it still shows an outstanding balance.',
      disputeReason: 'paid_off',
      accountName: 'Federal Student Loan',
      accountNumber: '****-****-7890',
      creditorName: 'Department of Education',
      disputeAmount: 15000,
      status: DisputeStatus.RESOLVED,
      priority: 'medium',
      submittedAt: new Date('2023-12-01'),
      resolvedAt: new Date('2024-01-10'),
      resolutionNotes:
        'Account verified as paid in full. Removed from credit report.',
    });
    await disputeRepository.save(dispute3);

    console.log('✅ Initial data seeded successfully!');
    console.log('👤 Admin User: admin@creditmanager.com / admin123');
    console.log('👤 Test User 1: john.doe@example.com / user123');
    console.log('👤 Test User 2: jane.smith@example.com / user123');
  }
}

// If running directly
if (require.main === module) {
  const { DataSource } = require('typeorm');
  const { ConfigModule, ConfigService } = require('@nestjs/config');

  async function runSeed() {
    ConfigModule.forRoot();
    const configService = new ConfigService();

    const dataSource = new DataSource({
      type: 'postgres',
      host: configService.get('DB_HOST', 'localhost'),
      port: configService.get('DB_PORT', 5433),
      username: configService.get('DB_USERNAME', 'postgres'),
      password: configService.get('DB_PASSWORD', 'Nurumasko'),
      database: configService.get('DB_NAME', 'credit_management'),
      entities: [User, CreditProfile, Dispute],
      synchronize: true,
    });

    try {
      await dataSource.initialize();
      console.log('📦 Database connected');

      const seed = new InitialDataSeed();
      await seed.run(dataSource);

      await dataSource.destroy();
      console.log('🏁 Seeding completed');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  }

  runSeed();
}
