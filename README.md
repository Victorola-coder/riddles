# Riddle Quest 🧩

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

A gamified riddle-solving platform where users progress through difficulty levels, earn virtual currency (Gems), and experience a premium, mysterious aesthetic.

## 🎯 Overview

Riddle Quest is a Progressive Web App that combines puzzle-solving with game mechanics. Users solve riddles across three difficulty tiers (Easy, Medium, Hard), earn gems for correct answers, and can spend gems on hints to progress when stuck.

## 🎮 How It Works

1. **Start Playing**: Begin with your first riddle (Easy difficulty)
2. **Solve Riddles**: Type your answer and submit - get instant feedback!
3. **Earn Gems**:
   - Easy riddle: +10 gems
   - Medium riddle: +20 gems
   - Hard riddle: +50 gems
4. **Use Hints** (when stuck):
   - Hint 1: First letter (-15 gems)
   - Hint 2: Word length (-10 gems)
   - Hint 3: Full answer (-50 gems)
5. **Progress**: Unlock harder difficulties as you complete 70% of current tier
6. **Persistence**: Your progress and gems are saved automatically

## ✨ Features

### Phase 1 (MVP) - ✅ Implemented

- ✅ **Riddle System**: Display riddles with difficulty indicators and instant feedback
- ✅ **Gem Economy**: Earn gems by solving riddles, spend on hints and skips
- ✅ **Hint System**: Progressive hints (first letter, word length, full answer)
- ✅ **Progression System**: Level-based progression with auto-unlock mechanics
- ✅ **Local Persistence**: Save progress using Zustand with localStorage persistence
- ✅ **Premium Design**: "Midnight Mystery" theme with glassmorphism effects
- ✅ **Animations**: Success/error feedback with Framer Motion and confetti celebrations
- ✅ **State Management**: Zustand store for game state management
- ✅ **Answer Validation**: Support for multiple valid answers per riddle
- ✅ **Component Library**: Full atomic design component structure (atoms, molecules, organisms)

### Phase 2 (Planned)

- 🔥 Daily streak system
- 🏆 Achievements & badges
- 🔊 Sound effects
- 🌓 Dark/Light mode toggle
- 📱 50+ riddles across categories

### Phase 3 (Future)

- 🔐 User authentication
- 📈 Leaderboard
- 🤝 Social sharing
- 🛠️ Admin panel

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS Variables
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with persistence middleware
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Celebrations**: [Canvas Confetti](https://github.com/catdad/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Google Fonts (Cinzel, Inter) + Geist Sans/Mono
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Animations Library**: [AOS](https://michalsnik.github.io/aos/) (Animate On Scroll)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Coding standards
- How to submit pull requests
- How to report bugs or suggest features

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/)
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Victorola-coder/riddles.git
cd riddles
```

2. Install dependencies:

```bash
# Using npm
npm install

# Using bun
bun install
```

3. Run the development server:

```bash
# Using npm
npm run dev

# Using bun
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
riddles/
├── app/
│   ├── (game)/                    # Route group for game pages
│   │   ├── layout.tsx            # Game-specific layout with header
│   │   └── page.tsx              # Main game page (riddle display & interaction)
│   │
│   ├── (marketing)/               # Route group for public pages (future)
│   │
│   ├── components/
│   │   ├── atoms/                # Basic building blocks
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── molecules/            # Component combinations
│   │   │   ├── difficulty-badge.tsx
│   │   │   ├── gem-counter.tsx
│   │   │   ├── progress-bar.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── organisms/            # Complex components
│   │   │   ├── answer-input.tsx
│   │   │   ├── game-header.tsx
│   │   │   ├── hint-panel.tsx
│   │   │   ├── riddle-card.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── global/               # Global components
│   │   │   ├── animation.tsx
│   │   │   ├── aos.tsx
│   │   │   ├── glow.tsx
│   │   │   ├── loader.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── ui/                   # Reusable UI component library
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── modal.tsx
│   │       └── ... (27 components)
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── use-click-outside.ts
│   │   ├── use-keyboard.ts
│   │   └── index.ts
│   │
│   ├── global.css                 # Global styles & CSS variables
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Homepage
│
├── lib/
│   ├── store/                     # Zustand stores
│   │   └── game-store.ts         # Game state management with persistence
│   │
│   ├── constants/                 # Game configuration
│   │   ├── animations.ts         # Framer Motion variants
│   │   ├── game-config.ts        # Gem costs, rewards, level config
│   │   └── riddles.ts            # Riddle data (15+ riddles)
│   │
│   └── utils/                      # Utility functions
│       ├── gem-calculator.ts      # Calculate gem rewards
│       └── riddle-validator.ts    # Answer validation & hint helpers
│
├── types/                          # TypeScript type definitions
│   ├── game.ts                    # GameState, HintLevel, GameAction
│   ├── riddle.ts                  # Riddle, DifficultyLevel
│   └── user.ts                    # User state (future)
│
└── public/                         # Static assets
    └── images/
        └── logo.svg
```

## 🎨 Design System

### Color Palette - "Midnight Mystery"

- **Background**: Deep charcoal (#0f0f0f) with dark slate accents
- **Primary Accent**: Mysterious purple (#8b5cf6)
- **Gem Color**: Gold (#fbbf24)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)

### Typography

- **Headings**: Cinzel (elegant, classic)
- **Body**: Inter/Geist Sans (clean, readable)
- **Monospace**: Geist Mono (for hints/answers)

## 📋 Development Status

See [TASKS.md](./TASKS.md) for the complete task list and progress tracking.

**Current Phase**: Phase 1 (MVP) - ✅ Core Features Implemented

### ✅ Completed Features

- **Game Foundation**: Zustand store with localStorage persistence
- **Riddle System**: 15 riddles (5 Easy, 5 Medium, 5 Hard) with categories and tags
- **Answer Validation**: Case-insensitive validation with multiple answer support
- **Gem Economy**:
  - Earn: 10 gems (Easy), 20 gems (Medium), 50 gems (Hard)
  - Spend: 15 gems (Hint 1), 10 gems (Hint 2), 50 gems (Hint 3), 30 gems (Skip)
  - Starting gems: 50
- **Hint System**: Three-level progressive hint system (first letter, word length, full answer)
- **UI Components**:
  - Atomic Design structure (atoms, molecules, organisms)
  - 27+ reusable UI components
  - Game-specific components (riddle card, answer input, hint panel, gem counter)
- **Animations**: Success/error animations with confetti celebrations
- **Game Logic**:
  - Riddle progression and auto-unlock mechanics
  - Gem calculation utilities
  - Hint management and tracking
  - Answer validation with multiple answer support
- **Type Safety**: Complete TypeScript type definitions for all game entities
- **Route Groups**: Organized game and marketing route groups

### 🚧 In Progress / Planned

- Level selection page
- More riddles (target: 50+)
- Daily streak system
- Achievements & badges

## 📖 Documentation

- [Product Requirements Document (PRD)](./PRD.md) - Complete product specifications
- [Task List](./TASKS.md) - Development tasks and progress
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute to the project

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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

Thank you to all contributors who help make Riddle Quest better!

<!-- Add contributors list here or use GitHub's contributor feature -->

## 👤 Author

**Victor** - Product Owner & Maintainer

---

**Version**: 1.0  
**Last Updated**: 2026-01-16

## ⭐ Show Your Support

If you find this project helpful, please consider giving it a star on GitHub!
