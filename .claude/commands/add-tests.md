---
description: Add comprehensive test coverage for a feature
---

You are adding test coverage for Portfel GPW Advisor.

**Context**: Project requires >80% test coverage before each etap completion.

**Testing Strategy**:
1. **Unit Tests** - Individual functions and utilities
2. **Component Tests** - React components in isolation
3. **Integration Tests** - Feature flows across components
4. **E2E Tests** - Complete user journeys (optional for MVP)

**Your task**:

## 1. Identify Test Gaps
- Run coverage report: `npm test -- --coverage`
- Identify uncovered files
- Focus on critical paths first:
  - Portfolio calculations
  - Data transformations
  - API integrations
  - Business logic

## 2. Write Unit Tests
Create tests in `__tests__` folder next to source file:

```typescript
// Example: packages/logic/src/utils/__tests__/portfolio.test.ts
import { calculatePnL, calculatePortfolioValue } from '../portfolio';

describe('Portfolio Utilities', () => {
  describe('calculatePnL', () => {
    it('calculates positive P&L correctly', () => {
      const position = {
        symbol: 'PKN',
        quantity: 100,
        purchasePrice: 50,
        currentPrice: 60
      };
      expect(calculatePnL(position)).toBe(1000);
    });

    it('calculates negative P&L correctly', () => {
      // ... test case
    });

    it('handles zero quantity', () => {
      // ... edge case
    });
  });
});
```

## 3. Component Tests
Use React Testing Library:

```typescript
// Example: packages/ui/src/components/__tests__/PortfolioTable.test.tsx
import { render, screen } from '@testing-library/react';
import { PortfolioTable } from '../PortfolioTable';

describe('PortfolioTable', () => {
  it('renders portfolio positions', () => {
    const mockData = [
      { symbol: 'PKN', quantity: 100, currentValue: 6000 }
    ];
    render(<PortfolioTable data={mockData} />);
    expect(screen.getByText('PKN')).toBeInTheDocument();
  });

  it('displays P&L with correct color', () => {
    // ... test case
  });
});
```

## 4. Integration Tests
Test feature workflows:

```typescript
// Example: CSV import flow
describe('CSV Import Flow', () => {
  it('imports valid CSV and updates portfolio', async () => {
    // 1. Upload CSV
    // 2. Verify parsing
    // 3. Check portfolio updated
    // 4. Verify persistence
  });

  it('shows error for invalid CSV', async () => {
    // ... test case
  });
});
```

## 5. API/Service Tests
Mock external dependencies:

```typescript
// Example: Polygon.io integration
jest.mock('../services/polygon', () => ({
  getCurrentPrice: jest.fn()
}));

describe('Price Updates', () => {
  it('fetches and updates prices', async () => {
    (getCurrentPrice as jest.Mock).mockResolvedValue(50.5);
    // ... test logic
  });

  it('handles API errors gracefully', async () => {
    (getCurrentPrice as jest.Mock).mockRejectedValue(new Error('API Error'));
    // ... test error handling
  });
});
```

## 6. Test Coverage Goals
- **Critical paths**: 100% (portfolio calculations, P&L)
- **Business logic**: >90%
- **UI components**: >80%
- **Utilities**: >85%
- **Overall**: >80%

## 7. Testing Best Practices
- **AAA pattern**: Arrange, Act, Assert
- **One assertion per test** (when possible)
- **Descriptive test names**: "should do X when Y"
- **Test edge cases**: empty arrays, null values, extreme numbers
- **Mock external dependencies**: APIs, storage, timers
- **Clean up**: afterEach hooks for cleanup

## 8. Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific file
npm test portfolio.test.ts

# Watch mode
npm test -- --watch
```

**Deliverable**: Test suite with >80% coverage and all critical paths tested
