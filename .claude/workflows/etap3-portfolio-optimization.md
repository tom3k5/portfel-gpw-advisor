# Etap 3, Week 16-18: Portfolio Optimization (Markowitz + ML)

**Goal**: Implement Markowitz portfolio optimization enhanced with ML predictions

**Duration**: 3 weeks

**Assigned Agents**: @ml-expert, @backend-expert, @frontend-expert

---

## Technical Requirements

### Theory Foundation

#### Modern Portfolio Theory (Markowitz)

- **Objective**: Maximize return for given risk, or minimize risk for given return
- **Key Concepts**:
  - Expected return (μ)
  - Variance/volatility (σ²)
  - Covariance matrix (correlation between assets)
  - Efficient frontier
  - Sharpe ratio (risk-adjusted return)

#### Enhanced with ML

- Use LSTM predictions for expected returns (instead of historical mean)
- Incorporate sentiment scores as risk factors
- Dynamic rebalancing based on market conditions

### ML/Optimization Layer (@ml-expert)

1. **Optimizer** (`packages/logic/src/optimization/markowitz.ts`)

   ```typescript
   interface OptimizationInput {
     assets: Asset[];
     constraints: Constraints;
     objective: 'max-return' | 'min-risk' | 'max-sharpe';
     predictions?: PricePrediction[]; // from LSTM
     sentimentScores?: SentimentData[];
   }

   interface Asset {
     symbol: string;
     currentPrice: number;
     currentWeight: number; // % of portfolio
     expectedReturn?: number; // from LSTM or historical
     volatility?: number; // historical std dev
   }

   interface Constraints {
     maxPositionSize: number; // e.g., 30% max per stock
     minPositionSize: number; // e.g., 2% min to avoid dust
     totalBudget: number; // PLN available
     allowShortSelling: boolean; // typically false
     sectorLimits?: { [sector: string]: number }; // max % per sector
   }

   interface OptimizationResult {
     recommendedWeights: { [symbol: string]: number };
     expectedReturn: number; // annual %
     expectedVolatility: number; // annual %
     sharpeRatio: number;
     changes: PortfolioChange[];
     efficientFrontier: FrontierPoint[];
   }

   interface PortfolioChange {
     symbol: string;
     action: 'buy' | 'sell' | 'hold';
     currentShares: number;
     recommendedShares: number;
     amountPLN: number;
   }
   ```

2. **Optimization Algorithm**

   ```typescript
   // Step 1: Calculate expected returns
   const expectedReturns = assets.map((asset) => {
     if (predictions) {
       // Use LSTM prediction
       return (prediction.predictedPrice - asset.currentPrice) / asset.currentPrice;
     } else {
       // Use historical mean
       return calculateHistoricalReturn(asset, lookback);
     }
   });

   // Step 2: Calculate covariance matrix
   const covarianceMatrix = calculateCovariance(historicalPrices);

   // Step 3: Optimize (quadratic programming)
   const optimizedWeights = solveQuadraticProgram({
     returns: expectedReturns,
     covariance: covarianceMatrix,
     constraints: constraints,
     objective: objective,
   });

   // Step 4: Generate rebalancing recommendations
   const changes = calculateRebalancing(currentPortfolio, optimizedWeights);
   ```

3. **Libraries**
   - **Optimization**: `numeric.js` or `mathjs` (JavaScript)
   - **Alternative**: Python backend (scipy.optimize, cvxpy) + REST API
   - **Matrix operations**: `ml-matrix`

4. **Efficient Frontier** (`packages/logic/src/optimization/frontier.ts`)
   - Generate curve of optimal portfolios
   - Points: Min risk → Max return
   - Identify current portfolio position
   - Show improvement potential

### Backend (@backend-expert)

1. **Optimization Service** (`packages/logic/src/services/optimization.ts`)
   - Fetch current portfolio
   - Gather predictions and sentiment
   - Run Markowitz optimization
   - Generate rebalancing plan
   - Calculate transaction costs
   - Cache results (refresh on-demand)

2. **Backtesting Engine** (`packages/logic/src/backtesting/engine.ts`)

   ```typescript
   interface BacktestConfig {
     strategy: 'markowitz' | 'equal-weight' | 'buy-and-hold';
     startDate: Date;
     endDate: Date;
     initialCapital: number;
     rebalanceFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
   }

   interface BacktestResult {
     finalValue: number;
     totalReturn: number; // %
     annualizedReturn: number; // %
     maxDrawdown: number; // %
     sharpeRatio: number;
     trades: Trade[];
     equityCurve: DataPoint[];
     comparisonToBenchmark: {
       strategyReturn: number;
       benchmarkReturn: number; // e.g., WIG20
       alpha: number; // excess return
     };
   }
   ```

3. **API Endpoints**
   - `POST /api/optimize` - Run optimization
   - `GET /api/optimize/result` - Get latest result
   - `POST /api/backtest` - Run backtest
   - `GET /api/backtest/:id` - Get backtest results

### Frontend (@frontend-expert)

1. **Optimization Components** (`packages/ui/src/components/optimization/`)

   ```typescript
   // OptimizationDashboard.tsx
   interface OptimizationDashboardProps {
     currentPortfolio: Portfolio;
     optimizationResult: OptimizationResult;
     onRunOptimization: () => void;
     onApplyChanges: (changes: PortfolioChange[]) => void;
   }

   // EfficientFrontier.tsx - Chart showing frontier
   // RebalancingPlan.tsx - Table of recommended changes
   // OptimizationSettings.tsx - Configure constraints
   // BacktestResults.tsx - Visualize backtest performance
   ```

2. **Visualizations**
   - Efficient frontier chart (risk vs return)
   - Current portfolio position marker
   - Recommended portfolio position marker
   - Pie chart: Current vs recommended allocation
   - Equity curve: Backtest performance over time

3. **User Flow**
   1. User navigates to "Optimize" tab
   2. Configure optimization settings (objective, constraints)
   3. Click "Run Optimization"
   4. Review results: frontier, recommended changes
   5. Preview rebalancing plan (buy/sell amounts)
   6. Optionally run backtest to see historical performance
   7. Apply changes (update portfolio or export to broker)

---

## Implementation Tasks

### Week 16: Markowitz Foundation

**Day 1-2**: Theory & Setup

- [ ] Study Markowitz portfolio theory
- [ ] Research optimization libraries (numeric.js, mathjs)
- [ ] Decide: JavaScript vs Python backend
- [ ] Create project structure
- [ ] Set up mathematical dependencies

**Day 3**: Core Algorithm

- [ ] Create `packages/logic/src/optimization/markowitz.ts`
- [ ] Implement expected return calculation
- [ ] Implement covariance matrix calculation
- [ ] Write unit tests for calculations
- [ ] Validate with example portfolios

**Day 4**: Optimization Solver

- [ ] Implement quadratic programming solver
- [ ] Add constraint handling (max/min positions)
- [ ] Implement objective functions:
  - [ ] Maximize return
  - [ ] Minimize risk
  - [ ] Maximize Sharpe ratio
- [ ] Test solver with different inputs

**Day 5**: Efficient Frontier

- [ ] Create `packages/logic/src/optimization/frontier.ts`
- [ ] Generate frontier points (risk-return pairs)
- [ ] Identify current portfolio position
- [ ] Calculate improvement potential
- [ ] Write tests

### Week 17: ML Integration & Backtesting

**Day 1-2**: ML Enhancement

- [ ] Integrate LSTM predictions into optimizer
- [ ] Use predicted returns instead of historical
- [ ] Incorporate sentiment as risk adjustment
- [ ] Add prediction confidence weighting
- [ ] Compare ML-enhanced vs traditional Markowitz

**Day 3-4**: Backtesting Engine

- [ ] Create `packages/logic/src/backtesting/engine.ts`
- [ ] Implement historical simulation
- [ ] Add rebalancing logic (daily/weekly/monthly)
- [ ] Calculate performance metrics (Sharpe, max drawdown)
- [ ] Compare to benchmark (WIG20)
- [ ] Write backtest tests

**Day 5**: Rebalancing Logic

- [ ] Create `packages/logic/src/optimization/rebalancer.ts`
- [ ] Calculate buy/sell orders from weights
- [ ] Account for transaction costs
- [ ] Handle fractional shares
- [ ] Generate execution plan
- [ ] Test rebalancing calculations

### Week 18: Frontend & Integration

**Day 1-2**: Backend Services

- [ ] Create `packages/logic/src/services/optimization.ts`
- [ ] Implement optimization API endpoints
- [ ] Add backtesting API endpoints
- [ ] Add result caching
- [ ] Write service tests

**Day 3**: Frontend Components

- [ ] Create `OptimizationDashboard` screen
- [ ] Create `EfficientFrontier` chart component
- [ ] Create `RebalancingPlan` table component
- [ ] Create `OptimizationSettings` form
- [ ] Create `BacktestResults` visualization
- [ ] Add platform-specific variants (.web.tsx)

**Day 4**: Integration & UX

- [ ] Add "Optimize" tab to main navigation
- [ ] Connect components to backend
- [ ] Add loading states and error handling
- [ ] Implement "Apply Changes" workflow
- [ ] Add export options (CSV, broker format)

**Day 5**: Testing & Polish

- [ ] End-to-end optimization flow testing
- [ ] Backtest accuracy validation
- [ ] Cross-platform testing
- [ ] Performance optimization
- [ ] User documentation
- [ ] Add educational tooltips

---

## Testing Checklist

### Optimization

- [ ] Expected return calculations
- [ ] Covariance matrix calculations
- [ ] Optimization solver correctness
- [ ] Constraint satisfaction (max/min positions)
- [ ] Efficient frontier generation
- [ ] Edge cases (single asset, all equal)

### Backtesting

- [ ] Historical simulation accuracy
- [ ] Rebalancing logic
- [ ] Performance metrics (Sharpe, drawdown)
- [ ] Benchmark comparison
- [ ] Transaction cost accounting

### Frontend

- [ ] Component rendering
- [ ] Chart visualizations
- [ ] Mobile optimization display
- [ ] Web optimization display
- [ ] User input validation
- [ ] Error handling

---

## Dependencies to Add

```json
{
  "dependencies": {
    "mathjs": "^12.0.0",
    "numeric": "^1.2.6",
    "ml-matrix": "^6.10.4",
    "d3": "^7.8.5"
  },
  "devDependencies": {
    "@types/numeric": "^1.2.2",
    "@types/d3": "^7.4.0"
  }
}
```

---

## Mathematical Formulas

### Expected Portfolio Return

```
μp = Σ(wi × μi)

where:
  wi = weight of asset i
  μi = expected return of asset i
```

### Portfolio Variance

```
σp² = Σ Σ (wi × wj × σij)

where:
  σij = covariance between asset i and j
```

### Sharpe Ratio

```
Sharpe = (μp - rf) / σp

where:
  rf = risk-free rate (e.g., Polish treasury bonds ~5%)
```

### Optimization Objective

```
Minimize: σp²
Subject to:
  Σ wi = 1 (weights sum to 100%)
  wi >= min_weight (e.g., 2%)
  wi <= max_weight (e.g., 30%)
  μp >= target_return (if specified)
```

---

## Example Optimization Output

```typescript
{
  "recommendedWeights": {
    "PKN": 0.25,    // 25% → from 35% (reduce)
    "KGHM": 0.20,   // 20% → from 15% (increase)
    "PZU": 0.15,    // 15% → from 10% (increase)
    "PKNORLEN": 0.20, // 20% → new position
    "CDR": 0.20     // 20% → from 40% (reduce)
  },
  "expectedReturn": 0.12,      // 12% annual
  "expectedVolatility": 0.18,  // 18% annual
  "sharpeRatio": 0.55,
  "changes": [
    {
      "symbol": "PKN",
      "action": "sell",
      "currentShares": 100,
      "recommendedShares": 71,
      "amountPLN": -1450
    },
    {
      "symbol": "PKNORLEN",
      "action": "buy",
      "currentShares": 0,
      "recommendedShares": 40,
      "amountPLN": 2000
    }
    // ...
  ]
}
```

---

## Success Criteria

- ✅ Markowitz optimization working correctly
- ✅ ML-enhanced expected returns integration
- ✅ Efficient frontier visualization
- ✅ Rebalancing recommendations
- ✅ Backtesting engine functional
- ✅ Sharpe ratio > baseline (buy-and-hold)
- ✅ Transaction cost accounting
- ✅ Cross-platform support (mobile + web)
- ✅ Clear visualizations and explanations
- ✅ Test coverage >80%

---

## Risks & Mitigations

**Risk 1**: Optimization overfitting to historical data

- _Mitigation_: Robust backtesting, walk-forward analysis, out-of-sample testing

**Risk 2**: ML predictions inaccurate

- _Mitigation_: Blend ML + historical, use confidence weighting, offer traditional mode

**Risk 3**: Transaction costs eroding gains

- _Mitigation_: Account for costs in optimization, minimize turnover, threshold for rebalancing

**Risk 4**: Mathematical complexity (performance)

- _Mitigation_: Cache results, optimize matrix operations, consider Python backend for heavy computation

**Risk 5**: User confusion (complex topic)

- _Mitigation_: Clear explanations, tooltips, educational content, simplified presets

**Risk 6**: Regulatory (providing investment advice)

- _Mitigation_: Disclaimers, "educational tool", not personalized advice

---

## Future Enhancements

- **Black-Litterman Model**: Incorporate user views
- **Factor models**: Fama-French factors
- **Risk parity**: Equal risk contribution
- **Dynamic optimization**: Adjust for market conditions
- **Tax-aware rebalancing**: Minimize capital gains tax
- **Transaction cost optimization**: Smart order routing
- **Monte Carlo simulation**: Probabilistic outcomes
- **Custom benchmarks**: User-defined indices
- **Social trading**: Learn from successful portfolios

---

## Educational Content for Users

### What is Portfolio Optimization?

```
Portfolio optimization helps you find the best mix of stocks
to maximize returns while managing risk.

Key Concepts:
• Diversification: Don't put all eggs in one basket
• Risk vs Return: Higher returns usually mean higher risk
• Efficient Frontier: The "best" portfolios for each risk level
• Rebalancing: Adjusting positions to maintain optimal mix

How it works:
1. We analyze your current portfolio
2. We predict future returns using AI
3. We calculate the optimal allocation
4. We show you which trades to make

Remember: This is a tool, not advice. Always do your own research!
```

---

## Disclaimers

**Required in UI**:

```
⚠️ Optimization Disclaimer

Portfolio optimization is based on mathematical models and predictions.

• Not personalized financial advice
• Past performance ≠ future results
• Models assume future = past patterns
• Market conditions can change suddenly
• Predictions may be wrong
• Use at your own risk
• Consult a financial advisor

This tool is for educational purposes only.
```

---

## Resources & References

### Books

- "Portfolio Selection" by Harry Markowitz (1952)
- "A Random Walk Down Wall Street" by Burton Malkiel

### Papers

- Markowitz, H. (1952). "Portfolio Selection". The Journal of Finance.
- Sharpe, W. (1964). "Capital Asset Prices: A Theory of Market Equilibrium"

### Libraries

- Portfolio Optimization: https://github.com/dcajasn/Riskfolio-Lib
- PyPortfolioOpt: https://pyportfolioopt.readthedocs.io/

### Tutorials

- Markowitz Portfolio Theory: https://www.investopedia.com/terms/m/modernportfoliotheory.asp
- Efficient Frontier: https://www.investopedia.com/terms/e/efficientfrontier.asp
