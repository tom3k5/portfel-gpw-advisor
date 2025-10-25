---
description: Implement portfolio optimization using Markowitz + ML
---

You are implementing portfolio optimization feature (Etap 3, Week 5-6).

**Context**: Help users optimize their portfolio allocation to maximize returns while managing risk.

**Requirements**:
- Modern Portfolio Theory (Markowitz)
- Machine learning enhancements
- Risk/return visualization
- Actionable rebalancing suggestions

**Your task**:

## Phase 1: Optimization Engine
1. Create optimizer in `packages/logic/src/optimization/portfolio.ts`:
   ```typescript
   type OptimizationParams = {
     currentPortfolio: Position[];
     riskTolerance: 'low' | 'medium' | 'high';
     targetReturn?: number;
     constraints?: {
       maxPositionSize?: number; // e.g., 0.2 = 20% max per stock
       minPositions?: number;
       sectorLimits?: Record<string, number>;
     };
   };

   function optimizePortfolio(params: OptimizationParams): OptimizationResult;
   ```

2. Implement Markowitz optimization:
   - Calculate expected returns (use LSTM predictions)
   - Build covariance matrix from historical prices
   - Solve for efficient frontier
   - Find optimal weights based on risk tolerance

3. Add ML enhancements:
   - Use LSTM predictions for expected returns
   - Incorporate sentiment scores as return adjustment
   - Dynamic risk assessment (volatility clustering)

4. Portfolio metrics calculation:
   - Expected annual return
   - Portfolio volatility (standard deviation)
   - Sharpe ratio
   - Maximum drawdown
   - Beta vs WIG20

## Phase 2: Visualization
1. Create efficient frontier chart:
   - X-axis: Risk (volatility)
   - Y-axis: Return
   - Plot current portfolio
   - Highlight optimal portfolio
   - Show WIG20 benchmark

2. Asset allocation pie chart:
   - Current allocation
   - Recommended allocation
   - Side-by-side comparison

3. Risk/return scatter plot:
   - Each stock as a point
   - Size = position size
   - Color = buy/sell/hold recommendation

## Phase 3: Rebalancing Suggestions
1. Generate trade recommendations:
   ```typescript
   type TradeRecommendation = {
     action: 'buy' | 'sell';
     symbol: string;
     shares: number;
     currentWeight: number;
     targetWeight: number;
     rationale: string;
   };
   ```

2. Calculate trades to reach optimal allocation:
   - Minimize number of trades
   - Consider transaction costs
   - Respect user constraints

3. Display rebalancing plan:
   - List all suggested trades
   - Expected improvement in Sharpe ratio
   - Estimated transaction costs
   - One-click execute (for premium users)

## Phase 4: Backtesting
1. Create backtesting engine in `packages/logic/src/backtest/runner.ts`:
   - Simulate strategy on historical data
   - Compare against WIG20 benchmark
   - Calculate performance metrics

2. Backtesting UI:
   - Date range selector
   - Initial capital input
   - Strategy parameters
   - Results visualization

3. Display backtest results:
   - Cumulative return chart
   - Win rate
   - Max drawdown
   - Calmar ratio
   - Monthly returns heatmap

## Phase 5: Integration
1. Add "Optimize Portfolio" button to dashboard
2. Show optimization results in modal:
   - Current vs Optimal comparison
   - Expected improvement metrics
   - Trade list
   - Confirm/Cancel actions

3. Save optimization history:
   - Track when optimizations were run
   - Compare actual results vs predictions
   - Learn from outcomes

**Algorithms needed**:
- Mean-Variance Optimization (Markowitz)
- Efficient Frontier calculation
- Monte Carlo simulation for risk assessment
- Transaction cost optimization

**Libraries**:
- Python: `cvxpy` (convex optimization), `scipy`
- TypeScript: port optimization logic or use Python microservice

**Expected deliverable**:
- Working portfolio optimizer
- Visual efficient frontier
- Concrete rebalancing recommendations
- Backtesting tool showing strategy performance
