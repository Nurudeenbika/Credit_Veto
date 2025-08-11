import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditProfileController } from './credit-profile.controller';
import { CreditProfileService } from './credit-profile.service';
import { CreditProfile } from './entities/credit-profile.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditProfile, User])],
  controllers: [CreditProfileController],
  providers: [CreditProfileService],
  exports: [CreditProfileService],
})
export class CreditProfileModule {}
