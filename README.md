# Riddle Quest 🧩

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

A gamified riddle-solving platform where users progress through difficulty levels, earn virtual currency (Gems), and experience a premium, mysterious aesthetic. **Riddles, not jokes.**

## 🎯 Overview

Riddle Quest is a Progressive Web App that combines puzzle-solving with game mechanics. Users solve riddles across three difficulty tiers (Easy, Medium, Hard), earn gems for correct answers, and can spend gems on hints to progress when stuck. The platform features user authentication, leaderboards, achievements, and an admin panel for managing riddles and game settings.

## 🎮 How It Works

1. **Start Playing**: Begin with your first riddle (Easy difficulty) - no account required!
2. **Solve Riddles**: Type your answer and submit - get instant feedback!
3. **Earn Gems**:
   - Easy riddle: Configurable (default: 10 gems)
   - Medium riddle: Configurable (default: 20 gems)
   - Hard riddle: Configurable (default: 50 gems)
4. **Use Hints** (when stuck):
   - Hint 1: First letter (configurable cost)
   - Hint 2: Word length (configurable cost)
   - Hint 3: Full answer (configurable cost)
5. **Progress**: Unlock harder difficulties as you complete riddles
6. **Track Progress**: View your stats, achievements, and position on the leaderboard
7. **Guest Mode**: Play without an account, then migrate your progress when you sign up

## ✨ Features

### Core Game Features ✅

- ✅ **Riddle System**: 37+ riddles with randomized distribution across categories
- ✅ **Gem Economy**: Earn gems by solving riddles, spend on hints and skips
- ✅ **Hint System**: Progressive hints (first letter, word length, full answer)
- ✅ **Progression System**: Level-based progression with difficulty tiers
- ✅ **Answer Validation**: Support for multiple valid answers per riddle
- ✅ **Randomized Riddles**: Smart randomization per category/difficulty for varied gameplay

### User Features ✅

- ✅ **User Authentication**: Sign up, login, password reset via email
- ✅ **Guest Mode**: Play without an account, migrate progress later
- ✅ **Profile Page**: View stats, update username/password
- ✅ **Leaderboard**: Global and weekly leaderboards with rankings
- ✅ **Achievements**: Track milestones and unlock achievements
- ✅ **Avatar System**: DiceBear avatars for users and guests
- ✅ **Session Persistence**: Progress saved across devices

### Admin Features ✅

- ✅ **Admin Dashboard**: Real-time statistics and activity monitoring
- ✅ **Riddle Management**: Create, edit, activate/deactivate riddles
- ✅ **User Management**: View users, stats, and activity
- ✅ **Game Settings**: Configure gem rewards, costs, and initial values
- ✅ **Activity Logs**: Track all admin and user activities
- ✅ **Real-time Updates**: Auto-refreshing dashboard with live data

### Technical Features ✅

- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **API**: RESTful API with type-safe client
- ✅ **State Management**: Zustand stores with React Query
- ✅ **Email Service**: Nodemailer integration for password reset
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Rate Limiting**: API protection against abuse
- ✅ **Type Safety**: Full TypeScript coverage

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Variables
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) + [React Query](https://tanstack.com/query)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Celebrations**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Google Fonts (Cinzel, Inter) + Geist Sans/Mono
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (jose) + Supabase (optional)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Validation**: [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/)
- PostgreSQL database (local or hosted)
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/Victorola-coder/riddles.git
cd riddles
```

2. **Install dependencies:**

```bash
# Using npm
npm install

# Using bun
bun install
```

3. **Set up environment variables:**

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/riddle_quest?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/riddle_quest?schema=public"

# Authentication
JWT_SECRET="your-secret-key-change-in-production"
ADMIN_ACCESS_CODE="your-admin-code"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Optional - for password reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Riddle Quest <no-reply@riddle-quest.test>"

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

4. **Set up the database:**

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database with initial data
npm run db:seed
```

5. **Run the development server:**

```bash
# Using npm
npm run dev

# Using bun
bun dev
```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with initial data

## 📁 Project Structure

```
riddles/
├── app/
│   ├── (auth)/                    # Authentication routes
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── (boss)/                    # Admin routes (protected)
│   │   └── admin/
│   │       ├── dashboard/
│   │       ├── riddles/
│   │       ├── users/
│   │       └── settings/
│   │
│   ├── (game)/                    # Game routes
│   │   ├── game/
│   │   ├── leaderboard/
│   │   ├── profile/
│   │   └── achievements/
│   │
│   ├── api/                       # API routes
│   │   ├── auth/
│   │   ├── game/
│   │   ├── admin/
│   │   ├── riddles/
│   │   └── leaderboard/
│   │
│   ├── components/
│   │   ├── atoms/                # Basic building blocks
│   │   ├── molecules/            # Component combinations
│   │   ├── organisms/            # Complex components
│   │   ├── ui/                   # Reusable UI components
│   │   ├── landing/              # Landing page components
│   │   └── providers/            # Context providers
│   │
│   ├── global.css                 # Global styles & CSS variables
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
│
├── lib/
│   ├── api/                       # API client functions
│   │   ├── client.ts             # Base API client
│   │   ├── auth.ts
│   │   ├── game.ts
│   │   ├── admin.ts
│   │   └── riddles.ts
│   │
│   ├── hooks/                     # React Query hooks
│   │   ├── use-auth.ts
│   │   ├── use-game.ts
│   │   └── use-admin.ts
│   │
│   ├── store/                     # Zustand stores
│   │   ├── auth.ts
│   │   ├── game-store.ts
│   │   └── user-store.ts
│   │
│   ├── utils/                     # Utility functions
│   │   ├── avatar.ts             # DiceBear avatar generation
│   │   ├── email.ts              # Email sending
│   │   ├── guest-session.ts     # Guest user management
│   │   └── riddle-validator.ts   # Answer validation
│   │
│   ├── constants/                 # Game configuration
│   │   ├── game-config.ts
│   │   └── riddles.ts
│   │
│   ├── prisma.ts                  # Prisma client
│   └── services.ts                # Business logic services
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
│
├── types.d.ts                     # Global type definitions
└── public/                        # Static assets
```

## 🎨 Design System

### Color Palette - "Midnight Mystery"

- **Background**: Deep charcoal (#0f0f0f) with dark slate accents
- **Primary Accent**: Mysterious purple (#8b5cf6)
- **Secondary Accent**: Gold (#fbbf24)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Text Primary**: White (#ffffff)
- **Text Secondary**: Gray (#9ca3af)

### Typography

- **Headings**: Cinzel (elegant, classic)
- **Body**: Inter/Geist Sans (clean, readable)
- **Monospace**: Geist Mono (for hints/answers)

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/riddles` - Fetch riddles (supports filtering by difficulty/category)
- `GET /api/leaderboard` - Get leaderboard data

### Authentication Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/migrate-guest` - Migrate guest data to user account

### Game Endpoints

- `GET /api/game/session` - Get or create game session
- `POST /api/game/session` - Update game session
- `POST /api/game/solve` - Submit riddle answer
- `POST /api/game/hint` - Get hint for riddle

### Admin Endpoints (Protected)

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/activity` - Get activity logs
- `GET /api/admin/riddles` - List riddles (paginated)
- `POST /api/admin/riddles` - Create riddle
- `PATCH /api/admin/riddles/[id]` - Update riddle
- `DELETE /api/admin/riddles/[id]` - Delete riddle
- `GET /api/admin/users` - List users (paginated)
- `GET /api/admin/settings` - Get game settings
- `POST /api/admin/settings` - Update game settings

## 📋 Development Status

See [TASKS.md](./TASKS.md) for the complete task list and progress tracking.

**Current Phase**: Phase 3 (Backend) - ✅ Completed

### ✅ Completed Features

- **Backend Infrastructure**: PostgreSQL database with Prisma ORM
- **User Authentication**: JWT-based auth with password reset
- **API Layer**: Type-safe API client with React Query hooks
- **Admin Panel**: Full CRUD for riddles, users, and settings
- **Leaderboard**: Global and weekly rankings
- **Achievements**: Achievement tracking system
- **Guest Mode**: Play without account, migrate progress
- **Email Service**: Password reset emails via Nodemailer
- **Avatar System**: DiceBear integration for user avatars
- **Real-time Updates**: Auto-refreshing admin dashboard
- **Randomized Riddles**: Smart randomization per category/difficulty

### 🚧 Future Enhancements

- Daily streak system
- Sound effects
- Dark/Light mode toggle
- More riddles (expand beyond 37)
- Social sharing features
- Mobile app (React Native)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards
- How to submit pull requests
- How to report bugs or suggest features

## 📖 Documentation

- [Product Requirements Document (PRD)](./PRD.md) - Complete product specifications
- [Task List](./TASKS.md) - Development tasks and progress
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to the project
- [`.env.example`](./.env.example) - Environment variables reference

## 🎯 Success Metrics

- Average session duration: 10+ minutes
- Daily Active Users retention: 40%+ after 7 days
- Riddle completion rate: 70%+ for easy, 50%+ for medium
- Gem economy balance: Users earn enough to use hints without feeling blocked

## 🌐 Browser Support

- Chrome/Edge (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Mobile: iOS Safari 14+, Chrome Android 90+

## 🔒 Security

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection protection via Prisma
- CORS configuration
- Environment variable security

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

Thank you to all contributors who help make Riddle Quest better!

## 👤 Author

**Victor** - Product Owner & Maintainer

- GitHub: [@Victorola-coder](https://github.com/Victorola-coder)

---

**Version**: 1.0.0  
**Last Updated**: January 2025

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star on GitHub!

---

**Tagline**: Riddles, not jokes. 🧩
