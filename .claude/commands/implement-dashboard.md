---
description: Implement portfolio dashboard with table and charts
---

You are implementing the core dashboard feature for Portfel GPW Advisor (Etap 1, Week 2).

**Context**: Users need to visualize their portfolio with positions, P&L, and basic charts.

**Requirements from spec**:
- Cross-platform UI (must work on iOS, Android, Web)
- Portfolio table showing: symbol, quantity, purchase price, current value, change %
- Simple historical price charts using Victory library
- Use React Native Paper for styling
- Start with mock data for testing

**Your task**:
1. Create shared UI components in `packages/ui`:
   - `PortfolioTable` - displays portfolio positions
   - `StockChart` - shows price history using Victory
   - `PortfolioSummary` - displays total value and P&L

2. Implement dashboard screen in both apps:
   - `apps/expo/src/screens/DashboardScreen.tsx`
   - `apps/web/src/pages/dashboard.tsx`

3. Create mock data structure in `packages/logic/src/mocks/portfolio.ts`:
   ```typescript
   type Position = {
     symbol: string;
     quantity: number;
     purchasePrice: number;
     currentPrice: number;
   }
   ```

4. Add color coding:
   - Green for gains
   - Red for losses
   - Percentage badges for changes

5. Ensure responsive design that works on mobile and desktop

**Testing**: Create mock data for at least 5 different stocks with varying P&L

**Expected deliverable**: Interactive dashboard displaying mock portfolio data on all platforms
