import {
  IsUUID,
  IsNumber,
  IsString,
  IsDate,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreditProfileDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(300)
  @Max(850)
  creditScore: number;

  @IsString()
  creditScoreRange: string;

  @IsDate()
  @Type(() => Date)
  reportDate: Date;

  @IsNumber()
  @Min(0)
  @Max(100)
  paymentHistory: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  creditUtilization: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  lengthOfCreditHistory: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  newCredit: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  creditMix: number;

  @IsNumber()
  @Min(0)
  totalAccounts: number;

  @IsNumber()
  @Min(0)
  openAccounts: number;

  @IsNumber()
  @Min(0)
  closedAccounts: number;

  @IsNumber()
  @Min(0)
  totalCreditLimit: number;

  @IsNumber()
  @Min(0)
  totalBalance: number;

  @IsNumber()
  @Min(0)
  derogatoryMarks: number;

  @IsNumber()
  @Min(0)
  hardInquiries: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditAccountDto)
  accounts: CreditAccountDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreditInquiryDto)
  inquiries: CreditInquiryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicRecordDto)
  publicRecords: PublicRecordDto[];
}

export class CreditAccountDto {
  @IsString()
  id: string;

  @IsString()
  accountName: string;

  @IsString()
  accountNumber: string;

  @IsEnum([
    'credit_card',
    'mortgage',
    'auto_loan',
    'personal_loan',
    'student_loan',
  ])
  accountType: string;

  @IsEnum(['open', 'closed', 'paid'])
  accountStatus: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @IsNumber()
  @Min(0)
  currentBalance: number;

  @IsEnum(['current', 'late_30', 'late_60', 'late_90', 'charge_off'])
  paymentStatus: string;

  @IsDate()
  @Type(() => Date)
  dateOpened: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateClosed?: Date;

  @IsNumber()
  @Min(0)
  monthsReviewed: number;

  @IsString()
  paymentHistory: string;
}

export class CreditInquiryDto {
  @IsString()
  id: string;

  @IsEnum(['hard', 'soft'])
  inquiryType: string;

  @IsString()
  creditorName: string;

  @IsDate()
  @Type(() => Date)
  inquiryDate: Date;

  @IsOptional()
  @IsString()
  purpose?: string;
}

export class PublicRecordDto {
  @IsString()
  id: string;

  @IsEnum(['bankruptcy', 'tax_lien', 'judgment', 'foreclosure'])
  recordType: string;

  @IsEnum(['filed', 'discharged', 'satisfied', 'dismissed'])
  status: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsDate()
  @Type(() => Date)
  dateFiled: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateResolved?: Date;

  @IsOptional()
  @IsString()
  court?: string;
}
