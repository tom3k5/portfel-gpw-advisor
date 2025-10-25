# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Python 3.10+ (for ML models)
- PostgreSQL 14+
- Expo CLI
- Git

### Initial Setup
```bash
# Clone repository
git clone <repo-url>
cd portfel-gpw-advisor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Initialize database
npm run db:migrate

# Start development servers
npm run dev
```

### Running Individual Apps
```bash
# Mobile app (iOS)
cd apps/expo
npm run ios

# Mobile app (Android)
cd apps/expo
npm run android

# Web app
cd apps/web
npm run dev

# Backend
cd backend
npm run dev
```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feat/your-feature-name
```

### 2. Make Changes
- Follow coding standards (see below)
- Write tests as you go
- Update documentation

### 3. Run Tests
```bash
# All tests
npm test

# Specific package
npm test -- --filter=@portfel/logic

# With coverage
npm test -- --coverage
```

### 4. Check Code Quality
```bash
# Lint
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

### 5. Commit Changes
```bash
# Follow commit message template
git commit -m "feat(dashboard): add portfolio chart"
```

### 6. Push and Create PR
```bash
git push origin feat/your-feature-name
# Create PR on GitHub
```

## Coding Standards

### TypeScript
- **Strict mode enabled**
- No `any` types (use `unknown` if necessary)
- Explicit return types for functions
- Use interfaces for objects, types for unions

```typescript
// Good
interface User {
  id: string;
  name: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Bad
function getUser(id): any {
  // ...
}
```

### React Components
- Functional components only (no class components)
- Use hooks (useState, useEffect, useMemo, useCallback)
- Extract custom hooks for reusable logic
- Props interface for all components

```typescript
// Good
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </Pressable>
  );
};

// Bad
export const Button = (props) => {
  return <Pressable onPress={props.onPress}>{props.title}</Pressable>;
};
```

### Naming Conventions
- **Components**: PascalCase (`PortfolioTable`)
- **Functions**: camelCase (`calculatePnL`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case (`portfolio-table.tsx`)
- **Interfaces**: PascalCase with `I` prefix optional (`IUser` or `User`)

### File Organization
```typescript
// Imports order:
// 1. React
// 2. External libraries
// 3. Internal packages
// 4. Relative imports
// 5. Types
// 6. Styles

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';

import { Button } from '@portfel/ui';
import { calculatePnL } from '@portfel/logic';

import { PortfolioSummary } from './portfolio-summary';

import type { Position } from '@portfel/logic/types';

import { styles } from './styles';
```

### Error Handling
```typescript
// Always handle errors explicitly
try {
  const data = await fetchData();
  return data;
} catch (error) {
  if (error instanceof NetworkError) {
    // Handle network errors
    logger.error('Network error:', error);
    throw new AppError('Unable to fetch data. Check your connection.');
  }
  // Re-throw unexpected errors
  throw error;
}
```

### Testing
```typescript
// Test file naming: *.test.ts or *.test.tsx
// Test structure: describe > it

describe('calculatePnL', () => {
  it('calculates positive P&L correctly', () => {
    const position = { quantity: 100, purchasePrice: 50, currentPrice: 60 };
    expect(calculatePnL(position)).toBe(1000);
  });

  it('returns 0 for unchanged price', () => {
    const position = { quantity: 100, purchasePrice: 50, currentPrice: 50 };
    expect(calculatePnL(position)).toBe(0);
  });

  it('throws error for invalid input', () => {
    const position = { quantity: -100, purchasePrice: 50, currentPrice: 60 };
    expect(() => calculatePnL(position)).toThrow();
  });
});
```

## Environment Variables

### Required Variables
```env
# API Keys
POLYGON_API_KEY=your_polygon_key
X_BEARER_TOKEN=your_twitter_token
ORTEX_API_KEY=your_ortex_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/portfel_gpw

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# App
NODE_ENV=development
API_BASE_URL=http://localhost:3000

# External Services
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your_sentry_dsn
```

## Debugging

### React Native Debugger
```bash
# Install
brew install --cask react-native-debugger

# Run
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

### Chrome DevTools
- Web app: Open DevTools in browser
- Mobile: Shake device → "Debug" → Opens Chrome

### Flipper (Advanced)
```bash
# Install Flipper
brew install --cask flipper

# Run with Flipper
npm run ios -- --scheme "PortfelGPW"
```

### Common Issues

#### Metro bundler not starting
```bash
# Clear cache
npx react-native start --reset-cache
```

#### Build errors after dependency update
```bash
# iOS
cd apps/expo/ios && pod install && cd ../../..

# Android
cd apps/expo/android && ./gradlew clean && cd ../../..
```

#### WebSocket connection failing
- Check CORS configuration in backend
- Verify WebSocket URL in environment variables
- Check firewall/network settings

## Performance Optimization

### React Performance
- Use `React.memo` for expensive components
- Optimize re-renders with `useMemo` and `useCallback`
- Virtualize long lists (FlatList, RecyclerListView)
- Lazy load routes/screens

### Bundle Size
```bash
# Analyze bundle
npm run analyze

# Check package size before adding
npm install -g bundle-phobia-cli
bundle-phobia <package-name>
```

### Database Queries
- Use indexes on frequently queried columns
- Limit result sets with pagination
- Use database connection pooling
- Cache frequently accessed data

## Useful Commands

```bash
# Generate new component
npm run generate:component ComponentName

# Database migrations
npm run db:migrate
npm run db:rollback
npm run db:seed

# Clean all node_modules
npm run clean

# Build all packages
npm run build

# Type generation from API
npm run generate:types

# Storybook (for UI development)
npm run storybook
```

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [Next.js Docs](https://nextjs.org/docs)
- [Turborepo Docs](https://turbo.build/repo/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
