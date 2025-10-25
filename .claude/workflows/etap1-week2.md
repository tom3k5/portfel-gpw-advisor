# Etap 1, Week 2: Core UI - Dashboard

## Goal
Build interactive portfolio dashboard with table and charts.

## Tasks

### Day 1-2: UI Components Foundation
- [ ] Set up React Native Paper theme
- [ ] Create base layout components (Header, Footer, Container)
- [ ] Implement responsive grid system
- [ ] Set up Victory charts library
- [ ] Create mock portfolio data

**Command:**
```bash
/implement-dashboard
```

**Test with mock data:**
```typescript
const mockPortfolio = [
  { symbol: 'PKN', quantity: 100, purchasePrice: 50, currentPrice: 55 },
  { symbol: 'JSW', quantity: 50, purchasePrice: 30, currentPrice: 28 },
  { symbol: 'CDR', quantity: 200, purchasePrice: 150, currentPrice: 165 },
];
```

### Day 3: Portfolio Table Component
- [ ] Create PortfolioTable component
- [ ] Display: symbol, quantity, purchase price, current value
- [ ] Calculate and show P&L (PLN and %)
- [ ] Color coding (green/red)
- [ ] Sorting functionality (by symbol, P&L, etc.)
- [ ] Responsive design (mobile vs desktop)

**Component specs:**
```typescript
interface PortfolioTableProps {
  positions: Position[];
  onRowPress?: (symbol: string) => void;
  sortBy?: 'symbol' | 'pnl' | 'value';
}
```

### Day 4: Charts Implementation
- [ ] Create StockChart component using Victory
- [ ] Show historical prices (mock data)
- [ ] Support different time ranges (1M, 3M, 6M, 1Y)
- [ ] Add tooltips on hover/press
- [ ] Responsive sizing

**Chart features:**
- Line chart for price history
- Area chart for portfolio value
- Color: green for gains, red for losses

### Day 5: Dashboard Assembly
- [ ] Create DashboardScreen
- [ ] Add PortfolioSummary card (total value, total P&L)
- [ ] Integrate PortfolioTable
- [ ] Add portfolio value chart
- [ ] Test on all platforms (iOS, Android, Web)

**Dashboard layout:**
```
┌─────────────────────────────────┐
│   Portfolio Summary             │
│   Total: 25,000 PLN (+5.2%)    │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│   Portfolio Value Chart         │
│   [Line chart here]             │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│   Holdings Table                │
│   PKN  100  50  5,500  +500    │
│   JSW   50  30  1,400  -100    │
└─────────────────────────────────┘
```

### Day 6: Polish & Testing
- [ ] Add loading states
- [ ] Add empty states ("No positions yet")
- [ ] Accessibility labels
- [ ] Write component tests (>80% coverage)
- [ ] Cross-platform testing
- [ ] Performance optimization

**Test checklist:**
- [ ] Renders correctly on iPhone SE
- [ ] Renders correctly on iPad
- [ ] Renders correctly on Android phone
- [ ] Renders correctly on desktop browser
- [ ] Charts resize properly
- [ ] Table scrolls on small screens

## Definition of Done
✅ Dashboard shows portfolio data on all platforms
✅ Charts are interactive and responsive
✅ Table supports sorting
✅ P&L calculations are correct
✅ Component tests pass with >80% coverage
✅ No performance issues (60 FPS scrolling)
✅ Code reviewed and merged

## Files to Create
- `packages/ui/src/components/PortfolioTable.tsx`
- `packages/ui/src/components/StockChart.tsx`
- `packages/ui/src/components/PortfolioSummary.tsx`
- `apps/expo/src/screens/DashboardScreen.tsx`
- `apps/web/src/pages/dashboard.tsx`
- `packages/logic/src/mocks/portfolio.ts`
- `packages/logic/src/utils/calculations.ts`

## Next Week Preview
Week 3 will implement manual portfolio import (form + CSV).
