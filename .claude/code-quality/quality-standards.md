# 📐 Code Quality Standards - Portfel GPW Advisor

## Poziomy Jakości Kodu

### ⭐⭐⭐⭐⭐ Tier 1: Production-Ready Excellence
**Wymagane dla code merge do main/master:**

#### TypeScript
- ✅ Strict mode enabled
- ✅ Zero `any` types (używaj `unknown` jeśli konieczne)
- ✅ Explicit return types dla funkcji
- ✅ Interfaces dla wszystkich obiektów
- ✅ Enums/Union types zamiast magic strings/numbers

#### Testy
- ✅ Coverage >80% (unit + integration)
- ✅ Critical paths mają E2E tests
- ✅ Edge cases pokryte testami
- ✅ Wszystkie testy przechodzą (0 failures)
- ✅ No flaky tests

#### Performance
- ✅ Bundle size <500KB (web, gzipped)
- ✅ API response time <200ms (P95)
- ✅ No memory leaks
- ✅ React re-renders zoptymalizowane (memo, useMemo)
- ✅ Database queries indexed

#### Security
- ✅ Input validation (Zod/Joi)
- ✅ No SQL injection vectors
- ✅ No exposed secrets/credentials
- ✅ Authentication/authorization checks
- ✅ HTTPS only

#### Documentation
- ✅ JSDoc comments dla public APIs
- ✅ README updated
- ✅ Code self-documenting (clear naming)
- ✅ Complex logic ma wyjaśnienia

---

### ⭐⭐⭐⭐ Tier 2: Good Quality
**Wymagane dla code review approval:**

- ✅ TypeScript without errors
- ✅ ESLint passes (0 errors)
- ✅ Prettier formatted
- ✅ Tests dla nowej funkcjonalności
- ✅ No console.log w production code
- ✅ Error handling implemented
- ✅ Meaningful variable names

---

### ⭐⭐⭐ Tier 3: Minimum Viable
**Draft/WIP - wymaga poprawy przed review:**

- ⚠️ Code compiles
- ⚠️ Basic functionality works
- ⚠️ No critical bugs
- ⚠️ Follows project structure

---

## Automated Quality Checks

### Pre-commit Hooks (Husky)
```bash
# Wykonywane automatycznie przed commitem
1. Lint staged files
2. Type check
3. Format with Prettier
4. Run affected tests
```

### Pre-push Hooks
```bash
# Wykonywane automatycznie przed pushem
1. Full test suite
2. Build check
3. Bundle size check
```

### CI/CD Pipeline
```bash
# Wykonywane na każdy PR
1. Lint
2. Type check
3. Tests (with coverage report)
4. Build
5. Bundle size analysis
6. Security scan
```

---

## Code Review Checklist

### Przed wysłaniem PR:
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No TODOs/FIXMEs left
- [ ] Console.logs removed
- [ ] Branch up to date with main
- [ ] All CI checks passing

### Reviewer checklist:
- [ ] Code follows style guide
- [ ] Logic is correct
- [ ] Tests are comprehensive
- [ ] No security issues
- [ ] Performance acceptable
- [ ] Documentation clear
- [ ] Naming intuitive

---

## Naming Conventions

### TypeScript/JavaScript

#### Variables & Functions
```typescript
// Good ✅
const userPortfolio = await getPortfolio(userId);
const isAuthenticated = checkAuth(token);
const totalValue = calculatePortfolioValue(positions);

// Bad ❌
const data = await get(id);
const flag = check(t);
const val = calc(p);
```

#### Components
```typescript
// Good ✅
<PortfolioTable positions={positions} />
<StockPriceChart data={historicalData} />
<AddPositionForm onSubmit={handleSubmit} />

// Bad ❌
<Table data={positions} />
<Chart data={historicalData} />
<Form onSubmit={handleSubmit} />
```

#### Files
```typescript
// Good ✅
portfolio-table.tsx
stock-price-chart.tsx
add-position-form.tsx
portfolio.service.ts
calculations.utils.ts

// Bad ❌
Table.tsx
chart.tsx
form.tsx
service.ts
utils.ts
```

---

## Function Guidelines

### Size Limits
- **Max 50 lines** per function (ideally <30)
- **Max 3 parameters** (use object for more)
- **Single responsibility** - one function = one thing

### Examples

#### Good ✅
```typescript
interface CalculatePnLParams {
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
}

function calculatePnL({ quantity, purchasePrice, currentPrice }: CalculatePnLParams): number {
  if (quantity <= 0) throw new Error('Invalid quantity');

  const priceDifference = currentPrice - purchasePrice;
  return priceDifference * quantity;
}
```

#### Bad ❌
```typescript
function calc(q, pp, cp, type, user, date, market, fees) {
  // Too many parameters
  // Unclear naming
  // Too much responsibility
}
```

---

## Error Handling

### Always handle errors explicitly

#### API Calls
```typescript
// Good ✅
try {
  const data = await fetchPortfolio(userId);
  return data;
} catch (error) {
  if (error instanceof NetworkError) {
    logger.error('Network error:', error);
    throw new AppError('Unable to fetch portfolio. Check connection.');
  }
  if (error instanceof AuthError) {
    logger.error('Auth error:', error);
    throw new AppError('Session expired. Please login again.');
  }
  throw error;
}

// Bad ❌
const data = await fetchPortfolio(userId); // No error handling
```

#### User-facing errors
```typescript
// Good ✅
throw new AppError('Invalid stock symbol', { symbol, userId });

// Bad ❌
throw new Error('Error'); // Unhelpful message
```

---

## Performance Best Practices

### React Components
```typescript
// Good ✅ - Memoization
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  const handleClick = useCallback(() => {
    doSomething();
  }, []);

  return <div>{processedData}</div>;
});

// Bad ❌ - No optimization
const ExpensiveComponent = ({ data }) => {
  const processedData = expensiveCalculation(data); // Runs every render
  return <div>{processedData}</div>;
};
```

### Database Queries
```typescript
// Good ✅ - Efficient query with select
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true }
});

// Bad ❌ - Fetches all fields
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

---

## Security Best Practices

### Input Validation
```typescript
// Good ✅
const schema = z.object({
  symbol: z.string().min(1).max(10).regex(/^[A-Z]+$/),
  quantity: z.number().int().positive(),
  price: z.number().positive()
});

const validatedData = schema.parse(req.body);
```

### Authentication
```typescript
// Good ✅
router.get('/portfolio', authMiddleware, async (req, res) => {
  const userId = req.user.id; // From verified JWT
  const portfolio = await getPortfolio(userId);
  res.json(portfolio);
});

// Bad ❌
router.get('/portfolio', async (req, res) => {
  const userId = req.query.userId; // Unverified user input!
  const portfolio = await getPortfolio(userId);
  res.json(portfolio);
});
```

### No Secrets in Code
```typescript
// Good ✅
const apiKey = process.env.POLYGON_API_KEY;

// Bad ❌
const apiKey = 'pk_abc123...'; // Hardcoded secret!
```

---

## Testing Standards

### Test Structure (AAA Pattern)
```typescript
describe('calculatePnL', () => {
  it('calculates positive P&L correctly', () => {
    // Arrange
    const position = {
      symbol: 'PKN',
      quantity: 100,
      purchasePrice: 50,
      currentPrice: 60
    };

    // Act
    const result = calculatePnL(position);

    // Assert
    expect(result).toBe(1000);
  });
});
```

### Coverage Targets
- **Critical paths**: 100% (auth, payments, P&L calculations)
- **Business logic**: >90%
- **UI components**: >80%
- **Utilities**: >85%
- **Overall**: >80%

---

## Documentation Standards

### JSDoc for Public APIs
```typescript
/**
 * Calculates profit/loss for a position
 *
 * @param position - The position to calculate P&L for
 * @returns The P&L in PLN (positive = profit, negative = loss)
 * @throws {Error} If quantity is invalid
 *
 * @example
 * const pnl = calculatePnL({
 *   symbol: 'PKN',
 *   quantity: 100,
 *   purchasePrice: 50,
 *   currentPrice: 60
 * }); // Returns 1000
 */
export function calculatePnL(position: Position): number {
  // Implementation
}
```

### README Requirements
- What the module does
- How to use it
- Examples
- API reference
- Testing instructions

---

## Git Commit Standards

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `docs`: Documentation
- `chore`: Build/tooling

### Examples
```bash
# Good ✅
feat(dashboard): add portfolio value chart
fix(api): correct P&L calculation for split stocks
refactor(auth): extract JWT validation to middleware
perf(db): add index on user_id and symbol columns

# Bad ❌
update stuff
fix
changes
asdf
```

---

## Anti-Patterns to Avoid

### 🚫 God Objects/Functions
```typescript
// Bad ❌
function doEverything(user, portfolio, market, settings, ...) {
  // 500 lines of code doing everything
}
```

### 🚫 Magic Numbers
```typescript
// Bad ❌
if (price > 100) { ... }

// Good ✅
const PRICE_THRESHOLD = 100;
if (price > PRICE_THRESHOLD) { ... }
```

### 🚫 Nested Callbacks
```typescript
// Bad ❌
getData((data) => {
  processData(data, (processed) => {
    saveData(processed, (result) => {
      // Callback hell
    });
  });
});

// Good ✅
const data = await getData();
const processed = await processData(data);
await saveData(processed);
```

### 🚫 Copy-Paste Code
```typescript
// Bad ❌ - Duplicated logic
function calculateUserPnL(user) { /* same logic */ }
function calculatePortfolioPnL(portfolio) { /* same logic */ }

// Good ✅ - Reusable function
function calculatePnL(position: Position): number { /* logic */ }
```

---

## Metrics to Track

### Code Quality Metrics
- **Test Coverage**: Target >80%
- **TypeScript Strict**: 100% (zero `any`)
- **ESLint Errors**: 0
- **Cyclomatic Complexity**: <10 per function
- **Bundle Size**: <500KB (web)
- **API Response Time**: P95 <200ms

### Review Metrics
- **Time to Review**: <24 hours
- **PR Size**: <400 lines (ideally <200)
- **Review Iterations**: <3

---

## Continuous Improvement

### Weekly
- Review failed tests
- Check performance metrics
- Update dependencies
- Security audit

### Monthly
- Code quality retrospective
- Update style guide
- Refactor technical debt
- Team knowledge sharing

---

## Resources

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React Best Practices: https://react.dev/learn
- Clean Code (Robert C. Martin)
- Project Quick Reference: `.claude/docs/quick-reference.md`

---

**Quality First, Speed Second** ⭐

*Ostatnia aktualizacja: 2025-10-25*
