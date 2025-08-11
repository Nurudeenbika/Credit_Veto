import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsEnum,
  ValidateNested,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDisputeDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description: string;

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
  @MaxLength(50)
  accountNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  creditorName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  disputeAmount?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfService?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupportingDocumentDto)
  supportingDocuments?: SupportingDocumentDto[];

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}

export class SupportingDocumentDto {
  @IsString()
  fileName: string;

  @IsString()
  fileType: string;

  @IsNumber()
  @Min(0)
  fileSize: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
