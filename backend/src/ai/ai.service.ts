import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GenerateLetterDto,
  GenerateLetterResponse,
} from './dto/generate-letter.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openaiApiKey: string;
  private readonly useMockAi: boolean;

  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.useMockAi =
      !this.openaiApiKey ||
      this.configService.get<string>('USE_MOCK_AI') === 'true';

    if (this.useMockAi) {
      this.logger.warn(
        'Using mock AI service - OpenAI API key not provided or USE_MOCK_AI is true',
      );
    }
  }

  async generateDisputeLetter(
    generateLetterDto: GenerateLetterDto,
  ): Promise<GenerateLetterResponse> {
    if (this.useMockAi) {
      return this.generateMockLetter(generateLetterDto);
    }

    try {
      return await this.generateRealLetter(generateLetterDto);
    } catch (error) {
      this.logger.error(
        'Failed to generate letter with OpenAI, falling back to mock',
        error,
      );
      return this.generateMockLetter(generateLetterDto);
    }
  }

  private async generateRealLetter(
    generateLetterDto: GenerateLetterDto,
  ): Promise<GenerateLetterResponse> {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: this.openaiApiKey,
    });

    const prompt = this.buildPrompt(generateLetterDto);

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional credit dispute letter writer. Generate formal, legally sound dispute letters based on the provided information.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const letter = completion.choices[0]?.message?.content || '';

    return {
      letter,
      generatedAt: new Date(),
      disputeReason: generateLetterDto.disputeReason,
      estimatedReadingTime: Math.ceil(letter.split(' ').length / 200), // 200 words per minute
    };
  }

  private generateMockLetter(
    generateLetterDto: GenerateLetterDto,
  ): GenerateLetterResponse {
    const templates = this.getLetterTemplates();
    const template =
      templates[generateLetterDto.disputeReason] || templates.default;

    const currentDate = new Date().toLocaleDateString();
    const letter = template
      .replace('[DATE]', currentDate)
      .replace('[DISPUTE_TITLE]', generateLetterDto.disputeTitle)
      .replace(
        '[ACCOUNT_NAME]',
        generateLetterDto.accountName || 'the account in question',
      )
      .replace(
        '[CREDITOR_NAME]',
        generateLetterDto.creditorName || 'the creditor',
      )
      .replace(
        '[ACCOUNT_NUMBER]',
        generateLetterDto.accountNumber || 'the account number',
      )
      .replace(
        '[DISPUTE_AMOUNT]',
        generateLetterDto.disputeAmount
          ? `$${generateLetterDto.disputeAmount.toLocaleString()}`
          : 'the disputed amount',
      )
      .replace('[ADDITIONAL_DETAILS]', generateLetterDto.additionalDetails)
      .replace('[TONE_CLOSING]', this.getToneClosing(generateLetterDto.tone));

    return {
      letter,
      generatedAt: new Date(),
      disputeReason: generateLetterDto.disputeReason,
      estimatedReadingTime: Math.ceil(letter.split(' ').length / 200),
    };
  }

  private buildPrompt(generateLetterDto: GenerateLetterDto): string {
    return `
Generate a professional credit dispute letter with the following details:

Dispute Title: ${generateLetterDto.disputeTitle}
Dispute Reason: ${generateLetterDto.disputeReason}
Account Name: ${generateLetterDto.accountName || 'N/A'}
Creditor Name: ${generateLetterDto.creditorName || 'N/A'}
Account Number: ${generateLetterDto.accountNumber || 'N/A'}
Dispute Amount: ${generateLetterDto.disputeAmount ? `${generateLetterDto.disputeAmount}` : 'N/A'}
Additional Details: ${generateLetterDto.additionalDetails}
Tone: ${generateLetterDto.tone || 'professional'}

Please generate a formal dispute letter that:
1. Follows proper business letter format
2. Clearly states the dispute reason
3. Requests investigation and correction
4. Maintains a ${generateLetterDto.tone || 'professional'} tone
5. Includes proper legal language for credit disputes
    `;
  }

  private getLetterTemplates(): Record<string, string> {
    return {
      identity_theft: `[DATE]

To Whom It May Concern:

I am writing to dispute the following information in my credit file. I have been a victim of identity theft, and the account listed below was fraudulently opened without my knowledge or consent.

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

This account was opened through identity theft. I have never had any business relationship with this creditor, nor did I authorize anyone to open this account on my behalf. I request that this fraudulent account be immediately removed from my credit report.

Under the Fair Credit Reporting Act (FCRA), I have the right to have inaccurate or fraudulent information removed from my credit report. Please conduct a thorough investigation of this matter and remove this item from my credit file.

I have attached supporting documentation including a police report and identity theft affidavit. Please contact me if you need any additional information.

[TONE_CLOSING]

Sincerely,
[Your Name]`,

      not_mine: `[DATE]

To Whom It May Concern:

I am writing to dispute the following account that appears on my credit report. This account does not belong to me and should be removed immediately.

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

I have never opened an account with this creditor, nor have I authorized anyone to do so on my behalf. This account is not mine and appears to be reported in error or may be the result of identity theft or mixed credit files.

Under the Fair Credit Reporting Act, I request that you investigate this matter and remove this inaccurate information from my credit report within 30 days.

Please provide me with written confirmation once this item has been removed from my credit file.

[TONE_CLOSING]

Sincerely,
[Your Name]`,

      inaccurate_info: `[DATE]

To Whom It May Concern:

I am writing to dispute inaccurate information appearing on my credit report regarding the following account:

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

The information currently reported is inaccurate and does not reflect the true status of this account. I request that you investigate this matter and correct the inaccurate information or remove it entirely if it cannot be verified.

Under the Fair Credit Reporting Act, you are required to investigate disputed items and either verify their accuracy or remove them from my credit report within 30 days of receiving this dispute.

I have attached supporting documentation that demonstrates the inaccuracy of the reported information. Please update my credit file to reflect accurate information.

[TONE_CLOSING]

Sincerely,
[Your Name]`,

      paid_off: `[DATE]

To Whom It May Concern:

I am writing to dispute the following account that appears on my credit report as unpaid when it has actually been satisfied in full:

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

This account was paid in full and should be updated to reflect a zero balance or removed from my credit report entirely. The current reporting is inaccurate and negatively impacts my credit score.

I have attached proof of payment including receipts, bank statements, and any correspondence confirming the account was satisfied. Please update this account status immediately or remove it from my credit file.

Under the Fair Credit Reporting Act, I request that you investigate this matter and correct this inaccurate information within 30 days.

[TONE_CLOSING]

Sincerely,
[Your Name]`,

      duplicate: `[DATE]

To Whom It May Concern:

I am writing to dispute a duplicate entry on my credit report. The following account appears to be reported multiple times:

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

This account is being reported more than once, which artificially inflates the negative impact on my credit score. Only one entry should appear for this account.

Please investigate this matter and remove the duplicate entries, keeping only the most accurate and up-to-date information.

Under the Fair Credit Reporting Act, duplicate reporting is considered inaccurate and must be corrected within 30 days of this dispute.

[TONE_CLOSING]

Sincerely,
[Your Name]`,

      outdated: `[DATE]

To Whom It May Concern:

I am writing to dispute outdated information on my credit report that should be removed according to the Fair Credit Reporting Act:

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

This information is beyond the legal reporting period and should be automatically removed from my credit report. Negative information generally cannot be reported for more than seven years from the date of first delinquency.

Please remove this outdated information immediately as it is negatively impacting my credit score unlawfully.

[TONE_CLOSING]

Sincerely,
[Your Name]`,

      default: `[DATE]

To Whom It May Concern:

I am writing to dispute the following information on my credit report:

Account Details:
- Account Name: [ACCOUNT_NAME]
- Creditor: [CREDITOR_NAME]
- Account Number: [ACCOUNT_NUMBER]
- Amount: [DISPUTE_AMOUNT]

[ADDITIONAL_DETAILS]

I believe this information is inaccurate and request that you investigate this matter. Under the Fair Credit Reporting Act, you are required to investigate disputed items and either verify their accuracy or remove them from my credit report within 30 days.

Please provide me with written confirmation of the results of your investigation.

[TONE_CLOSING]

Sincerely,
[Your Name]`,
    };
  }

  private getToneClosing(tone?: string): string {
    switch (tone) {
      case 'formal':
        return 'I expect prompt attention to this matter and look forward to your timely response.';
      case 'assertive':
        return 'I demand immediate action on this matter and will pursue all legal remedies available if this is not resolved promptly.';
      default:
        return 'Thank you for your prompt attention to this matter. I look forward to hearing from you soon.';
    }
  }
}
