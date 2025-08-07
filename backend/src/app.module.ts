import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';

// Feature modules
import { AuthModule } from '/auth/auth.module';
import { UsersModule } from './users/users.module';
import { CreditProfileModule } from './credit-profile/credit-profile.module';
import { DisputesModule } from './disputes/disputes.module';
import { AiModule } from './ai/ai.module';
import { DatabaseModule } from './database/database.module';

// Entities
import { User } from './users/entities/user.entity';
import { CreditProfile } from './credit-profile/entities/credit-profile.entity';
import { Dispute } from './disputes/entities/dispute.entity';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'password'),
        database: configService.get('DATABASE_NAME', 'credit_management'),
        entities: [User, CreditProfile, Dispute],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        retryAttempts: 3,
        retryDelay: 3000,
        autoLoadEntities: true,
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),

    // Redis Cache
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get('REDIS_HOST', 'localhost');
        const redisPort = configService.get('REDIS_PORT', 6379);
        const redisPassword = configService.get('REDIS_PASSWORD');

        return {
          store: redisStore as any,
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          ttl: 300, // 5 minutes default TTL
          max: 100, // Maximum number of items in cache
        };
      },
      inject: [ConfigService],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          name: 'short',
          ttl: 1000, // 1 second
          limit: 10, // 10 requests per second
        },
        {
          name: 'medium',
          ttl: 60000, // 1 minute
          limit: configService.get('THROTTLE_LIMIT', 100),
        },
        {
          name: 'long',
          ttl: 3600000, // 1 hour
          limit: 1000,
        },
      ],
      inject: [ConfigService],
    }),

    // Feature modules
    DatabaseModule,
    AuthModule,
    UsersModule,
    CreditProfileModule,
    DisputesModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    // Log the current environment
    console.log(
      `Running in ${this.configService.get('NODE_ENV', 'development')} mode`,
    );
  }
}
