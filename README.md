# Portfel GPW Advisor 📈

A cross-platform mobile and web application for managing and analyzing Warsaw Stock Exchange (GPW) portfolio investments. Built with React Native, Expo, and Next.js in a monorepo architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.73-61DAFB)
![Expo](https://img.shields.io/badge/Expo-SDK%2050-000020)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Test Coverage](https://img.shields.io/badge/coverage-%3E80%25-brightgreen)

## 🚀 Features

### Current (Etap 1 - Completed)

- ✅ **Portfolio Dashboard**
  - Real-time portfolio summary with P&L tracking
  - Interactive charts showing historical performance
  - Sortable table with detailed position information
  - Color-coded gains and losses

- ✅ **Portfolio Management**
  - Manual position entry with validation
  - CSV import functionality with preview
  - Position merging with weighted average calculation
  - Cross-platform local storage (AsyncStorage + localStorage)

- ✅ **Push Notifications**
  - Daily and weekly portfolio reports
  - Customizable notification times
  - Settings screen for notification management
  - Platform-specific notification channels (Android/iOS)

- ✅ **Cross-Platform Support**
  - iOS mobile app (Expo)
  - Android mobile app (Expo)
  - Web app (Next.js)
  - Shared business logic and UI components

### Planned (Future Etaps)

- 📊 **Real-time Market Data** (Etap 2)
  - Integration with Polygon.io API for live GPW prices
  - Automatic portfolio value updates
  - Market hours detection

- 🤖 **AI-Powered Analysis** (Etap 2)
  - Sentiment analysis from X (Twitter)
  - News impact analysis
  - Social media trend tracking

- 🧠 **ML Price Predictions** (Etap 3)
  - LSTM neural network for price forecasting
  - Multiple timeframe predictions
  - Confidence intervals

- 🎯 **Portfolio Optimization** (Etap 3)
  - Markowitz portfolio theory
  - ML-enhanced optimization
  - Risk analysis and suggestions

## 🏗️ Architecture

### Monorepo Structure

```
portfel-gpw-advisor/
├── apps/
│   ├── expo/              # Mobile app (iOS + Android)
│   │   ├── app/           # Expo Router screens
│   │   └── app.json       # Expo configuration
│   └── web/               # Web app (Next.js)
│       ├── src/app/       # App Router pages
│       └── next.config.js # Next.js configuration
├── packages/
│   ├── ui/                # Shared UI components
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   │   ├── *.tsx       # Native components
│   │   │   │   └── *.web.tsx   # Web-specific variants
│   │   │   └── theme/          # Design tokens
│   ├── logic/             # Business logic
│   │   ├── src/
│   │   │   ├── calculations/   # Portfolio calculations
│   │   │   ├── storage/        # Data persistence
│   │   │   ├── notifications/  # Push notification logic
│   │   │   └── types/          # TypeScript types
│   ├── typescript-config/ # Shared TS configs
│   └── eslint-config/     # Shared ESLint configs
└── .claude/               # Claude Code environment
    ├── agents/            # Specialized AI agents
    ├── commands/          # Slash commands
    └── workflows/         # Development workflows
```

### Technology Stack

**Mobile:**
- React Native 0.73
- Expo SDK 50 + Expo Router
- React Native Paper (UI library)
- AsyncStorage (data persistence)
- Expo Notifications

**Web:**
- Next.js 14 (App Router)
- React 18
- React Native Web (component compatibility)
- Platform-specific `.web.tsx` components

**Shared:**
- TypeScript (100% strict mode)
- Turborepo (build orchestration)
- Jest + React Testing Library
- ESLint + Prettier
- Victory (charts)
- PapaParse (CSV parsing)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- iOS: Xcode 14+ and CocoaPods
- Android: Android Studio and JDK 17
- Expo CLI: `npm install -g expo-cli`

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfel-gpw-advisor.git
   cd portfel-gpw-advisor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**

   **Mobile (Expo):**
   ```bash
   npm run dev --workspace=@portfel/expo
   # or
   npx expo start
   ```

   **Web (Next.js):**
   ```bash
   npm run dev --workspace=@portfel/web
   ```

4. **Run on device/simulator**
   - **iOS Simulator:** Press `i` in Expo terminal
   - **Android Emulator:** Press `a` in Expo terminal
   - **Physical Device:** Scan QR code with Expo Go app
   - **Web Browser:** Navigate to `http://localhost:3000`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@portfel/logic

# Run tests with coverage
npm test -- --coverage

# Type checking
npm run type-check
```

**Test Coverage:** >80% for all packages

## 🔧 Development

### Project Commands

```bash
# Development
npm run dev              # Start all dev servers
npm run dev:expo         # Mobile app only
npm run dev:web          # Web app only

# Building
npm run build            # Build all packages
npm run build:web        # Build web app only

# Code Quality
npm run lint             # Lint all packages
npm run format           # Format with Prettier
npm run type-check       # TypeScript checking

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
```

### Adding a New Feature

1. Create components in `packages/ui/src/components/`
2. Add business logic in `packages/logic/src/`
3. Create tests alongside code files (`*.test.ts`)
4. Update screens in `apps/expo/app/` or `apps/web/src/app/`
5. Run tests and type-check before committing

### Platform-Specific Components

For components that need different implementations on web vs native:

1. Create `ComponentName.tsx` for mobile (React Native)
2. Create `ComponentName.web.tsx` for web (HTML/CSS)
3. Both export the same interface
4. Webpack/Metro automatically picks the right version

Example:
```typescript
// PortfolioTable.tsx - Mobile version
import { DataTable } from 'react-native-paper';

// PortfolioTable.web.tsx - Web version
// Uses HTML <table>
```

## 📱 Using the App

### Import Portfolio

**Method 1: CSV Import**
1. Download sample CSV: Click "Download Sample CSV"
2. Fill in your positions (symbol, quantity, price, date)
3. Click "Choose CSV File" and select your file
4. Review preview and confirm import

**CSV Format:**
```csv
symbol,quantity,price,date
PKN,100,50.00,2024-01-15
PKO,50,40.00,2024-02-01
PZU,75,30.00,2024-01-20
```

**Method 2: Manual Entry**
1. Click "Add Position" button
2. Fill in the form (symbol, quantity, purchase price, date)
3. Click "Add Position" to save

### View Dashboard

- **Portfolio Summary:** Total value, cost, P&L
- **Chart:** Historical portfolio performance (1M, 3M, 6M, 1Y, ALL)
- **Holdings Table:** Sortable by symbol, P&L, value
  - Green = profit
  - Red = loss
  - Click column headers to sort

### Notifications

1. Navigate to Settings (mobile only for now)
2. Enable notifications
3. Choose frequency (Daily/Weekly/Off)
4. Set notification time
5. For weekly: select day of week
6. Test notifications with "Send Test Notification"

## 🤖 Claude Code Environment

This project includes a comprehensive Claude Code environment in `.claude/`:

- **Agents:** 5 specialized AI agents (Frontend, Backend, ML, QA, DevOps)
- **Commands:** Slash commands for common tasks (`/implement-dashboard`, `/csv-import`, etc.)
- **Workflows:** Week-by-week development guides
- **Documentation:** Architecture, API docs, development guides

### Using Claude Code

```bash
# See available commands
/help

# Implement a feature
/implement-dashboard

# Review code quality
/review-code

# Add tests
/add-tests
```

## 🐛 Known Issues

### Web Build (Non-Critical)

The production web build encounters SSR errors with error pages (`/404`, `/500`). This doesn't affect:
- Development mode (works perfectly)
- Main application pages
- Core functionality

**Workaround:** Use development mode for now. Production build fix planned for Etap 2.

See `WEB-BUILD-ISSUE.md` for details.

### React Native Warnings

Some webpack warnings about `react-native` module resolution are expected in web builds. They're non-critical and don't affect functionality.

## 📈 Roadmap

### Etap 1: Core & Usability ✅ (Completed)
- Week 1-2: Dashboard with charts and tables
- Week 3-4: CSV import and manual entry
- Week 5-6: Push notifications and settings

### Etap 2: Data & Analysis 🚧 (In Progress)
- Week 1-2: Polygon.io integration for real-time GPW data
- Week 3-4: X (Twitter) sentiment analysis
- Week 5-6: News aggregation and analysis

### Etap 3: Intelligence & Optimization 📅 (Planned)
- Week 1-3: LSTM price prediction model
- Week 4-6: Portfolio optimization (Markowitz + ML)
- Week 7-8: Performance tuning and polish

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `chore:` Maintenance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tomek**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Warsaw Stock Exchange (GPW) for market inspiration
- Expo and Next.js teams for excellent frameworks
- Open source community

---

**Built with ❤️ for Polish investors**

Last Updated: October 2025
