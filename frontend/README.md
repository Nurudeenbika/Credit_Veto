# Credit Management System - Frontend

A Next.js-based frontend application for managing credit profiles and disputes with AI-powered letter generation.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context + Hooks

## 📁 Project Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── profile/        # Profile components
│   │   ├── disputes/       # Dispute components
│   │   └── layout/         # Layout components
│   ├── lib/                # Utilities and configurations
│   ├── hooks/              # Custom React hooks
│   └── context/            # React context providers
├── .env.example            # Environment variables template
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Docker Setup

```bash
# Build and run with docker-compose from root directory
docker-compose up --build
```

## 👤 Sample User Credentials

### Test Users

- **Admin User:**

  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: `admin`

- **Regular User:**
  - Email: `user@example.com`
  - Password: `user123`
  - Role: `user`

## 📊 Mock Credit Data

The application uses mock credit data for demonstration:

### Sample Credit Profile

```json
{
  "creditScore": 720,
  "reportDate": "2024-08-06",
  "accounts": [
    {
      "id": 1,
      "creditor": "Chase Bank",
      "accountType": "Credit Card",
      "balance": 2500,
      "status": "Open"
    }
  ],
  "inquiries": [
    {
      "id": 1,
      "company": "Capital One",
      "date": "2024-07-15",
      "type": "Hard Inquiry"
    }
  ]
}
```

## 🔐 Authentication Flow

1. **Login/Registration:** JWT-based authentication
2. **Token Management:** Automatic refresh token handling
3. **Role-based Access:** Different dashboards for users and admins
4. **Protected Routes:** Middleware for route protection

## 📱 Pages & Features

| Route        | Description                       | Access     |
| ------------ | --------------------------------- | ---------- |
| `/`          | Landing page                      | Public     |
| `/login`     | Login form                        | Public     |
| `/dashboard` | Role-based dashboard              | Private    |
| `/profile`   | Credit profile & dispute creation | User       |
| `/disputes`  | Dispute history & management      | User/Admin |
| `/ai`        | AI-powered letter generation      | User       |

## 🤖 AI Integration

- **Feature:** Generate dispute letters using AI
- **Implementation:** OpenAI API integration with fallback to mock responses
- **Endpoint:** Uses `/ai/generate-letter` backend endpoint

## 🎨 UI Components

### Base Components

- `Button` - Reusable button with variants
- `Card` - Container component
- `Input` - Form input with validation
- `Select` - Dropdown selection
- `Badge` - Status indicators

### Feature Components

- `LoginForm` - Authentication form
- `CreditProfile` - Credit data display
- `DisputeForm` - Create new disputes
- `DisputeList` - View dispute history

## 🔄 State Management

- **AuthContext:** User authentication state
- **Custom Hooks:** API calls and local storage
- **React Query:** (Optional) for server state management

## 🛡️ Security Features

- JWT token management
- Automatic token refresh
- Protected route middleware
- Role-based access control
- XSS protection with proper sanitization

## 🧪 Development Notes

### Mock Data Strategy

- All credit data is mocked for development
- Easy switching between mock and real API
- Consistent data structure for testing

### Optional Features Implemented

- [ ] Real-time WebSocket updates
- [ ] PDF export functionality
- [ ] Pluggable credit provider adapter

## 📞 API Endpoints Used

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Token refresh
- `POST /auth/regenerate-token` - Manual token regeneration

### Credit Profile

- `GET /credit-profile/:userId` - Fetch credit data

### Disputes

- `POST /disputes/create` - Create dispute
- `GET /disputes/history` - Get user disputes
- `PUT /disputes/:id/status` - Update dispute status

### AI

- `POST /ai/generate-letter` - Generate dispute letter

## 🚀 Build & Deployment

```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is for demonstration purposes.
