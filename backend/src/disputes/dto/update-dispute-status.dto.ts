import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { DisputeStatus } from '../../common/enums/dispute-status.enum';

export class UpdateDisputeStatusDto {
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  resolutionNotes?: string;
}
