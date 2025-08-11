import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('credit_profiles')
export class CreditProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'credit_score' })
  creditScore: number;

  @Column({ name: 'credit_score_range' })
  creditScoreRange: string; // e.g., "300-850"

  @Column({ name: 'report_date' })
  reportDate: Date;

  @Column({ name: 'payment_history', type: 'decimal', precision: 5, scale: 2 })
  paymentHistory: number; // percentage

  @Column({
    name: 'credit_utilization',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  creditUtilization: number; // percentage

  @Column({
    name: 'length_of_credit_history',
    type: 'decimal',
    precision: 5,
    scale: 2,
  })
  lengthOfCreditHistory: number; // percentage

  @Column({ name: 'new_credit', type: 'decimal', precision: 5, scale: 2 })
  newCredit: number; // percentage

  @Column({ name: 'credit_mix', type: 'decimal', precision: 5, scale: 2 })
  creditMix: number; // percentage

  @Column({ name: 'total_accounts' })
  totalAccounts: number;

  @Column({ name: 'open_accounts' })
  openAccounts: number;

  @Column({ name: 'closed_accounts' })
  closedAccounts: number;

  @Column({
    name: 'total_credit_limit',
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  totalCreditLimit: number;

  @Column({ name: 'total_balance', type: 'decimal', precision: 12, scale: 2 })
  totalBalance: number;

  @Column({ name: 'derogatory_marks' })
  derogatoryMarks: number;

  @Column({ name: 'hard_inquiries' })
  hardInquiries: number;

  @Column({ name: 'accounts', type: 'jsonb' })
  accounts: CreditAccount[];

  @Column({ name: 'inquiries', type: 'jsonb' })
  inquiries: CreditInquiry[];

  @Column({ name: 'public_records', type: 'jsonb' })
  publicRecords: PublicRecord[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.creditProfiles)
  @JoinColumn({ name: 'user_id' })
  user: User;
}

export interface CreditAccount {
  id: string;
  accountName: string;
  accountNumber: string; // masked
  accountType:
    | 'credit_card'
    | 'mortgage'
    | 'auto_loan'
    | 'personal_loan'
    | 'student_loan';
  accountStatus: 'open' | 'closed' | 'paid';
  creditLimit?: number;
  currentBalance: number;
  paymentStatus: 'current' | 'late_30' | 'late_60' | 'late_90' | 'charge_off';
  dateOpened: Date;
  dateClosed?: Date;
  monthsReviewed: number;
  paymentHistory: string; // e.g., "●●●●●○○●●●" where ● = on time, ○ = late
}

export interface CreditInquiry {
  id: string;
  inquiryType: 'hard' | 'soft';
  creditorName: string;
  inquiryDate: Date;
  purpose?: string;
}

export interface PublicRecord {
  id: string;
  recordType: 'bankruptcy' | 'tax_lien' | 'judgment' | 'foreclosure';
  status: 'filed' | 'discharged' | 'satisfied' | 'dismissed';
  amount?: number;
  dateFiled: Date;
  dateResolved?: Date;
  court?: string;
}
