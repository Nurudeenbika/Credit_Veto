import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  IsNumber,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateLetterDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  disputeTitle: string;

  @IsString()
  @IsEnum([
    'identity_theft',
    'not_mine',
    'inaccurate_info',
    'paid_off',
    'duplicate',
    'outdated',
    'other',
  ])
  disputeReason: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  accountName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  creditorName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  accountNumber?: string;

  @IsOptional()
  @IsNumber()
  disputeAmount?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfService?: Date;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  additionalDetails: string;

  @IsOptional()
  @IsString()
  @IsEnum(['formal', 'professional', 'assertive'])
  tone?: 'formal' | 'professional' | 'assertive';
}

export class GenerateLetterResponse {
  letter: string;
  generatedAt: Date;
  disputeReason: string;
  estimatedReadingTime: number; // in minutes
}
