import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DisputeStatus } from '../../common/enums/dispute-status.enum';

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'dispute_reason' })
  disputeReason: string; // e.g., "identity_theft", "not_mine", "inaccurate_info", "paid_off"

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    default: DisputeStatus.PENDING,
  })
  status: DisputeStatus;

  @Column({ name: 'account_name', nullable: true })
  accountName?: string;

  @Column({ name: 'account_number', nullable: true })
  accountNumber?: string; // masked

  @Column({ name: 'creditor_name', nullable: true })
  creditorName?: string;

  @Column({
    name: 'dispute_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  disputeAmount?: number;

  @Column({ name: 'date_of_service', nullable: true })
  dateOfService?: Date;

  @Column({ name: 'supporting_documents', type: 'jsonb', nullable: true })
  supportingDocuments?: SupportingDocument[];

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes?: string;

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes?: string;

  @Column({ name: 'submitted_at', nullable: true })
  submittedAt?: Date;

  @Column({ name: 'resolved_at', nullable: true })
  resolvedAt?: Date;

  @Column({ name: 'dispute_letter', type: 'text', nullable: true })
  disputeLetter?: string;

  @Column({ name: 'priority', default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.disputes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Helper method to get days since creation
  get daysSinceCreated(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Helper method to check if dispute is overdue (example: 30 days)
  get isOverdue(): boolean {
    return this.status !== DisputeStatus.RESOLVED && this.daysSinceCreated > 30;
  }
}

export interface SupportingDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
  description?: string;
}
