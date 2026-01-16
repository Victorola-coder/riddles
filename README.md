# Riddle Quest 🧩

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

A gamified riddle-solving platform where users progress through difficulty levels, earn virtual currency (Gems), and experience a premium, mysterious aesthetic.

## 🎯 Overview

Riddle Quest is a Progressive Web App that combines puzzle-solving with game mechanics. Users solve riddles across three difficulty tiers (Easy, Medium, Hard), earn gems for correct answers, and can spend gems on hints to progress when stuck.

## ✨ Features

### Phase 1 (MVP) - Current

- 🎮 **Riddle System**: Display riddles with difficulty indicators and instant feedback
- 💎 **Gem Economy**: Earn gems by solving riddles, spend on hints and skips
- 💡 **Hint System**: Progressive hints (first letter, word length, full answer)
- 📊 **Progression System**: Level-based progression with auto-unlock mechanics
- 💾 **Local Persistence**: Save progress using localStorage
- 🎨 **Premium Design**: "Midnight Mystery" theme with glassmorphism effects
- ✨ **Animations**: Success/error feedback with Framer Motion

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
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (to be added)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Google Fonts (Cinzel, Inter)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

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
app/
├── (game)/                    # Route group for game pages
│   ├── layout.tsx            # Game-specific layout
│   ├── page.tsx              # Main game page
│   └── levels/
│       └── page.tsx          # Level selection
│
├── components/
│   ├── atoms/                # Basic building blocks
│   ├── molecules/            # Component combinations
│   ├── organisms/            # Complex components
│   └── templates/            # Page layouts
│
├── lib/
│   ├── store/                # Zustand stores
│   ├── utils/                # Utility functions
│   └── constants/            # Game config & riddles
│
├── types/                     # TypeScript definitions
└── hooks/                     # Custom React hooks
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

**Current Phase**: Phase 1 (MVP) - Foundation & Core Features

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
