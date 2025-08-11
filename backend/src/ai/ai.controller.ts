import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateLetterDto } from './dto/generate-letter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-letter')
  @HttpCode(HttpStatus.OK)
  async generateLetter(@Body() generateLetterDto: GenerateLetterDto) {
    const result =
      await this.aiService.generateDisputeLetter(generateLetterDto);
    return {
      message: 'Dispute letter generated successfully',
      ...result,
    };
  }
}
