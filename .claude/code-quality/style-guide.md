# 🎨 Style Guide - Portfel GPW Advisor

## Philosophy

> "Code is read 10x more than it's written. Optimize for readability."

**Principles:**
1. **Clarity over Cleverness** - simple > smart
2. **Consistency over Preference** - team style > personal style
3. **Explicit over Implicit** - obvious > magical
4. **Functional over Imperative** - pure functions > mutations

---

## TypeScript

### Types

#### Always Explicit
```typescript
// Good ✅
function calculatePnL(position: Position): number {
  return (position.currentPrice - position.purchasePrice) * position.quantity;
}

// Bad ❌
function calculatePnL(position) {
  return (position.currentPrice - position.purchasePrice) * position.quantity;
}
```

#### No `any`
```typescript
// Good ✅
function processData(data: unknown): ProcessedData {
  if (!isValidData(data)) {
    throw new Error('Invalid data');
  }
  return transform(data);
}

// Bad ❌
function processData(data: any): any {
  return transform(data);
}
```

#### Interfaces over Types (for objects)
```typescript
// Good ✅
interface Position {
  symbol: string;
  quantity: number;
  purchasePrice: number;
}

// Use types for unions/primitives
type Status = 'pending' | 'completed' | 'failed';
type ID = string | number;

// Bad ❌ (for objects)
type Position = {
  symbol: string;
  quantity: number;
};
```

### Naming

#### PascalCase
- Interfaces: `Position`, `PortfolioSummary`
- Types: `Status`, `UserId`
- Classes: `PortfolioService`, `AuthMiddleware`
- Components: `PortfolioTable`, `StockCard`
- Enums: `UserRole`, `TransactionType`

#### camelCase
- Variables: `userPortfolio`, `totalValue`
- Functions: `calculatePnL`, `fetchPortfolio`
- Methods: `user.getPortfolio()`, `portfolio.addPosition()`
- Props: `onPress`, `initialValue`

#### UPPER_SNAKE_CASE
- Constants: `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`
- Environment variables: `POLYGON_API_KEY`

#### kebab-case
- Files: `portfolio-table.tsx`, `use-portfolio.ts`
- CSS classes: `.portfolio-card`, `.stock-symbol`
- URLs: `/api/portfolio-summary`

---

## File Organization

### Folder Structure
```
src/
├── components/          # Reusable UI components
│   ├── PortfolioTable/
│   │   ├── index.tsx
│   │   ├── PortfolioTable.tsx
│   │   ├── PortfolioTable.test.tsx
│   │   └── styles.ts
│   └── index.ts        # Barrel export
├── screens/            # App screens
├── hooks/              # Custom React hooks
├── services/           # API/external services
├── utils/              # Pure utility functions
├── types/              # TypeScript definitions
└── constants/          # App constants
```

### File Naming
```typescript
// Components
PortfolioTable.tsx         # Component
PortfolioTable.test.tsx    # Test
PortfolioTable.stories.tsx # Storybook (optional)

// Hooks
use-portfolio.ts           # Custom hook
use-portfolio.test.ts      # Test

// Services
polygon.service.ts         # Service
polygon.service.test.ts    # Test

// Utils
calculations.ts            # Utilities
calculations.test.ts       # Test
```

---

## React/React Native

### Components

#### Function Components Only
```typescript
// Good ✅
export const PortfolioTable: React.FC<PortfolioTableProps> = ({ positions }) => {
  return <View>{/* ... */}</View>;
};

// Bad ❌
export class PortfolioTable extends React.Component {
  render() {
    return <View>{/* ... */}</View>;
  }
}
```

#### Props Interface
```typescript
// Good ✅
interface PortfolioTableProps {
  positions: Position[];
  onRowPress?: (symbol: string) => void;
  sortBy?: 'symbol' | 'pnl' | 'value';
}

export const PortfolioTable: React.FC<PortfolioTableProps> = ({
  positions,
  onRowPress,
  sortBy = 'symbol',
}) => {
  // ...
};

// Bad ❌
export const PortfolioTable = (props) => {
  // No type safety
};
```

#### Destructure Props
```typescript
// Good ✅
export const StockCard: React.FC<StockCardProps> = ({
  symbol,
  currentPrice,
  change,
}) => {
  return <Card>{symbol}: {currentPrice}</Card>;
};

// Bad ❌
export const StockCard: React.FC<StockCardProps> = (props) => {
  return <Card>{props.symbol}: {props.currentPrice}</Card>;
};
```

### Hooks

#### Custom Hooks
```typescript
// Good ✅ - Starts with "use"
export function usePortfolio(userId: string) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio(userId).then(setPortfolio).finally(() => setLoading(false));
  }, [userId]);

  return { portfolio, loading };
}

// Usage
const { portfolio, loading } = usePortfolio(userId);
```

#### Hook Dependencies
```typescript
// Good ✅ - All dependencies listed
useEffect(() => {
  fetchData(userId, filter);
}, [userId, filter]);

// Bad ❌ - Missing dependencies
useEffect(() => {
  fetchData(userId, filter);
}, []); // ESLint will warn!
```

### Performance

#### Memoization
```typescript
// Good ✅
const MemoizedComponent = React.memo(ExpensiveComponent);

const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething();
}, []);

// Bad ❌ - Recalculates every render
const expensiveValue = heavyCalculation(data);
const handleClick = () => doSomething();
```

### Styling

#### StyleSheet.create
```typescript
// Good ✅
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Bad ❌ - Inline styles
<View style={{ flex: 1, padding: 16 }}>
```

#### Conditional Styles
```typescript
// Good ✅
<Text style={[
  styles.text,
  isPositive && styles.positive,
  isNegative && styles.negative,
]}>
  {value}
</Text>

// Bad ❌
<Text style={{
  color: isPositive ? 'green' : isNegative ? 'red' : 'black'
}}>
```

---

## Functions

### Pure Functions Preferred
```typescript
// Good ✅ - Pure
function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}

// Bad ❌ - Side effects
let total = 0;
function calculateTotal(prices: number[]): void {
  prices.forEach(price => total += price);
}
```

### Single Responsibility
```typescript
// Good ✅
function fetchPortfolio(userId: string): Promise<Portfolio> {
  return api.get(`/portfolio/${userId}`);
}

function calculatePortfolioValue(portfolio: Portfolio): number {
  return portfolio.positions.reduce((sum, p) => sum + p.currentValue, 0);
}

// Bad ❌ - Does too much
function getPortfolioValue(userId: string): Promise<number> {
  return api.get(`/portfolio/${userId}`)
    .then(portfolio => {
      return portfolio.positions.reduce((sum, p) => sum + p.currentValue, 0);
    });
}
```

### Early Returns
```typescript
// Good ✅
function processPosition(position: Position | null): number {
  if (!position) return 0;
  if (position.quantity <= 0) return 0;

  return calculatePnL(position);
}

// Bad ❌ - Nested
function processPosition(position: Position | null): number {
  if (position) {
    if (position.quantity > 0) {
      return calculatePnL(position);
    }
  }
  return 0;
}
```

---

## Async/Await

### Always use async/await (not .then())
```typescript
// Good ✅
async function fetchUserPortfolio(userId: string): Promise<Portfolio> {
  try {
    const user = await fetchUser(userId);
    const portfolio = await fetchPortfolio(user.portfolioId);
    return portfolio;
  } catch (error) {
    logger.error('Failed to fetch portfolio:', error);
    throw error;
  }
}

// Bad ❌
function fetchUserPortfolio(userId: string): Promise<Portfolio> {
  return fetchUser(userId)
    .then(user => fetchPortfolio(user.portfolioId))
    .catch(error => {
      logger.error('Failed to fetch portfolio:', error);
      throw error;
    });
}
```

### Parallel when possible
```typescript
// Good ✅ - Parallel (faster)
const [user, settings, portfolio] = await Promise.all([
  fetchUser(userId),
  fetchSettings(userId),
  fetchPortfolio(userId),
]);

// Bad ❌ - Sequential (slower)
const user = await fetchUser(userId);
const settings = await fetchSettings(userId);
const portfolio = await fetchPortfolio(userId);
```

---

## Error Handling

### Specific Error Types
```typescript
// Good ✅
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  validatePosition(data);
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json({ error: error.message, field: error.field });
  }
  throw error;
}

// Bad ❌
try {
  validatePosition(data);
} catch (error) {
  return res.status(500).json({ error: 'Something went wrong' });
}
```

---

## Comments

### When to Comment

#### Good Comments ✅
```typescript
// HACK: Polygon.io sometimes returns null for pre-market prices
// We default to previous close until market opens
const price = currentPrice ?? previousClose;

// TODO(tomek): Add caching after confirming API rate limits
const data = await fetchData();

// Explanation of complex algorithm
// Using Markowitz portfolio optimization with ML-enhanced returns
// See: https://en.wikipedia.org/wiki/Modern_portfolio_theory
function optimizePortfolio(positions: Position[]): Allocation {
  // ...
}
```

#### Bad Comments ❌
```typescript
// Bad: States the obvious
// Increment counter
counter++;

// Bad: Outdated
// This function returns user data (actually returns portfolio now)
function getData() {
  return portfolio;
}

// Bad: Commented code
// const oldCalculation = (a, b) => a + b;
const newCalculation = (a, b) => a * b;
```

### JSDoc for Public APIs
```typescript
/**
 * Calculates the profit/loss for a position
 *
 * @param position - The position to calculate P&L for
 * @returns The P&L in PLN (positive = profit, negative = loss)
 * @throws {ValidationError} If position data is invalid
 *
 * @example
 * const pnl = calculatePnL({
 *   symbol: 'PKN',
 *   quantity: 100,
 *   purchasePrice: 50,
 *   currentPrice: 60
 * });
 * console.log(pnl); // 1000
 */
export function calculatePnL(position: Position): number {
  // Implementation
}
```

---

## Testing

### Naming
```typescript
// Good ✅
describe('calculatePnL', () => {
  it('returns positive value when price increases', () => {});
  it('returns negative value when price decreases', () => {});
  it('returns zero when price unchanged', () => {});
  it('throws error when quantity is invalid', () => {});
});

// Bad ❌
describe('calc', () => {
  it('test 1', () => {});
  it('works', () => {});
});
```

### AAA Pattern
```typescript
it('calculates P&L correctly', () => {
  // Arrange
  const position = {
    symbol: 'PKN',
    quantity: 100,
    purchasePrice: 50,
    currentPrice: 60,
  };

  // Act
  const result = calculatePnL(position);

  // Assert
  expect(result).toBe(1000);
});
```

---

## Imports

### Order
```typescript
// 1. React
import React, { useState, useEffect } from 'react';

// 2. React Native
import { View, Text } from 'react-native';

// 3. External libraries
import { format } from 'date-fns';
import axios from 'axios';

// 4. Internal packages
import { Button } from '@portfel/ui';
import { calculatePnL } from '@portfel/logic';

// 5. Relative imports
import { PortfolioSummary } from './portfolio-summary';
import { usePortfolio } from '../hooks/use-portfolio';

// 6. Types
import type { Position, Portfolio } from '../types';

// 7. Styles
import { styles } from './styles';
```

### Named imports preferred
```typescript
// Good ✅
import { Button, Card, Text } from 'react-native-paper';

// Bad ❌ (unless necessary)
import * as Paper from 'react-native-paper';
```

---

## Constants

### Extract Magic Numbers/Strings
```typescript
// Good ✅
const API_BASE_URL = 'https://api.portfelgpw.pl';
const MAX_RETRY_ATTEMPTS = 3;
const CACHE_TTL_SECONDS = 300;

// Bad ❌
fetch('https://api.portfelgpw.pl/data'); // Magic string
for (let i = 0; i < 3; i++) { retry(); } // Magic number
```

### Enums for Related Constants
```typescript
// Good ✅
enum TransactionType {
  BUY = 'buy',
  SELL = 'sell',
  DIVIDEND = 'dividend',
}

// Or const object
const TransactionType = {
  BUY: 'buy',
  SELL: 'sell',
  DIVIDEND: 'dividend',
} as const;
```

---

## Git

### Commit Messages
```bash
# Good ✅
feat(dashboard): add portfolio value chart
fix(api): correct P&L calculation for split stocks
refactor(auth): extract JWT validation to middleware
perf(db): add index on user_id and symbol columns
test(portfolio): add tests for edge cases
docs(api): update endpoint documentation

# Bad ❌
update
fix
changes
WIP
final version
```

### Branch Names
```bash
# Good ✅
feat/dashboard-chart
fix/pnl-calculation
refactor/auth-middleware
test/portfolio-edge-cases

# Bad ❌
tomek-branch
my-changes
new-stuff
```

---

## Tooling Configuration

### ESLint (.eslintrc.js)
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    'react-hooks/exhaustive-deps': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};
```

### Prettier (.prettierrc)
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5",
  "arrowParens": "always"
}
```

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

---

## Resources

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [React Best Practices](https://react.dev/learn)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Project: `.claude/code-quality/quality-standards.md`

---

**Consistency Creates Clarity** 🎨

*Ostatnia aktualizacja: 2025-10-25*
