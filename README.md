# Credit Profile & Dispute Management System - Backend

A comprehensive NestJS backend API for managing credit profiles and handling credit dispute workflows with AI-powered dispute letter generation.

## 🚀 Features

- **JWT Authentication & Authorization** with role-based access control
- **Credit Profile Management** with mock third-party integration
- **Dispute Lifecycle Management** (pending → submitted → under_review → resolved)
- **AI-Powered Dispute Letters** (OpenAI integration with fallback to mock)
- **Admin Dashboard APIs** for managing users and disputes
- **Dockerized Setup** with PostgreSQL and Redis
- **Comprehensive Seeding** with sample data

## 🏗️ Tech Stack

- **Backend**: NestJS (TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **AI Integration**: OpenAI API (with mock fallback)
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── auth/                 # Authentication & JWT
│   ├── users/                # User management
│   ├── credit-profile/       # Credit profile APIs
│   ├── disputes/             # Dispute management
│   ├── ai/                   # AI letter generation
│   ├── common/              # Shared utilities
│   └── database/            # DB config & seeds
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd backend
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=credit_management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# AI Integration (Optional)
OPENAI_API_KEY=your-openai-api-key
USE_MOCK_AI=true

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 3. Run with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### 4. Run Locally (Alternative)

```bash
# Install dependencies
npm install

# Start PostgreSQL & Redis
docker-compose up -d postgres redis

# Run database migrations & seed
npm run seed

# Start development server
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 🔐 Sample Credentials

After running the seed script, you can use these test accounts:

| Role  | Email                   | Password | Description              |
| ----- | ----------------------- | -------- | ------------------------ |
| Admin | admin@creditmanager.com | admin123 | Full system access       |
| User  | john.doe@example.com    | user123  | Sample user (Score: 720) |
| User  | jane.smith@example.com  | user123  | Sample user (Score: 650) |

## 📡 API Endpoints

### Authentication

```
POST /auth/register          # Register new user
POST /auth/login             # User login
POST /auth/refresh           # Refresh access token
POST /auth/regenerate-token  # Manual token regeneration
GET  /auth/profile           # Get current user profile
POST /auth/logout            # User logout
```

### Credit Profiles

```
GET  /credit-profile/me              # Get my credit profile
GET  /credit-profile/:userId         # Get user profile (admin only)
POST /credit-profile/refresh         # Refresh credit data
GET  /credit-profile/admin/all       # Get all profiles (admin only)
```

### Disputes

```
POST /disputes/create                # Create new dispute
GET  /disputes/history               # Get my disputes
GET  /disputes/:id                   # Get specific dispute
PUT  /disputes/:id/status            # Update dispute status (admin only)
PUT  /disputes/:id/submit            # Submit dispute
DELETE /disputes/:id                 # Delete dispute
GET  /disputes/admin/all             # Get all disputes (admin only)
GET  /disputes/admin/stats           # Get dispute statistics (admin only)
```

### AI Services

```
POST /ai/generate-letter             # Generate AI dispute letter
```

## 🤖 AI Integration

The system supports both real OpenAI integration and mock responses:

### Using OpenAI (Recommended)

```env
OPENAI_API_KEY=sk-your-actual-openai-key
USE_MOCK_AI=false
```

### Using Mock AI (Default)

```env
USE_MOCK_AI=true
```

Mock AI provides professionally crafted templates for different dispute reasons:

- Identity theft
- Inaccurate information
- Paid off accounts
- Duplicate entries
- Outdated information

## 💾 Database Seeding

The system includes comprehensive seed data:

```bash
# Seed database with sample data
npm run seed
```

**Includes:**

- 1 Admin user + 2 Test users
- Sample credit profiles with accounts, inquiries
- 3 Sample disputes in different states
- Realistic credit data and dispute scenarios

## 🔧 Development

### Running Tests

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

### Database Operations

```bash
npm run migration:generate    # Generate migration
npm run migration:run         # Run migrations
npm run migration:revert      # Revert migration
```

### Code Quality

```bash
npm run lint          # ESLint
npm run format        # Prettier
```

## 🏭 Production Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-production-db-host
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-very-secure-jwt-secret
OPENAI_API_KEY=your-openai-key
USE_MOCK_AI=false
```

### Build & Deploy

```bash
# Build production image
docker build -t credit-backend:latest .

# Run production container
docker run -d -p 3000:3000 --env-file .env credit-backend:latest
```

## 📊 System Architecture

### Authentication Flow

1. User registers/logs in → JWT access token (15min) + refresh token (7 days)
2. Protected routes validated via JWT middleware
3. Role-based access control (USER/ADMIN)
4. Manual token regeneration endpoint available

### Credit Data Strategy

- Mock Array API integration for credit bureau data
- Realistic credit profiles with scores, accounts, inquiries
- Auto-generation of credit profiles for new users
- Refresh mechanism to simulate updated credit data

### Dispute Lifecycle

1. **PENDING** → User creates dispute
2. **SUBMITTED** → User submits for review
3. **UNDER_REVIEW** → Admin reviewing
4. **RESOLVED** → Admin closes dispute

### AI Integration

- OpenAI GPT-3.5-turbo for professional dispute letters
- Fallback to pre-crafted templates by dispute type
- Customizable tone (formal, professional, assertive)
- Letter templates for: identity theft, inaccurate info, paid off, duplicates, outdated

## 🚨 Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

Example error response:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    "email must be a valid email",
    "password must be longer than 6 characters"
  ]
}
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Security**: Short-lived access tokens with refresh mechanism
- **Input Validation**: Class-validator for all DTOs
- **SQL Injection Protection**: TypeORM parameterized queries
- **Role-based Access**: Admin/User role separation
- **CORS Configuration**: Configurable for production

## 📈 Monitoring & Logging

- Comprehensive logging with NestJS Logger
- Health check endpoint: `GET /health`
- Database connection monitoring
- Redis connectivity checks
- Request/response logging in development

## 🧪 Testing Strategy

### Unit Tests

- Service layer testing with mocked dependencies
- Controller testing with mocked services
- Entity validation testing

### Integration Tests

- Database operations testing
- Authentication flow testing
- API endpoint testing with real database

### E2E Tests

- Complete user workflows
- Admin operations testing
- Error scenario coverage

## 📝 API Documentation

### Sample Requests

**Register User:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Create Dispute:**

```bash
curl -X POST http://localhost:3000/disputes/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Inaccurate Account Balance",
    "description": "The balance shown is incorrect",
    "disputeReason": "inaccurate_info",
    "accountName": "Chase Card",
    "disputeAmount": 500
  }'
```

**Generate AI Letter:**

```bash
curl -X POST http://localhost:3000/ai/generate-letter \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "disputeTitle": "Identity Theft Account",
    "disputeReason": "identity_theft",
    "additionalDetails": "I never opened this account",
    "tone": "assertive"
  }'
```

## 🔧 Troubleshooting

### Common Issues

**Database Connection Failed:**

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
npm run seed
```

**JWT Token Issues:**

- Ensure `JWT_SECRET` is set in environment
- Check token expiration times
- Verify token format in Authorization header

**AI Service Not Working:**

- Check `OPENAI_API_KEY` is valid
- Verify `USE_MOCK_AI` setting
- Check OpenAI API quota/billing

### Debug Mode

```bash
# Enable detailed logging
NODE_ENV=development npm run start:dev

# Database query logging
DB_LOGGING=true npm run start:dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- Follow NestJS conventions
- Use TypeScript strict mode
- Write unit tests for services
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. Check this README and troubleshooting section
2. Review the logs: `docker-compose logs backend`
3. Verify environment configuration
4. Check GitHub Issues for similar problems
5. Create new issue with detailed information

---

**Built with ❤️ using NestJS, PostgreSQL, and TypeScript**
