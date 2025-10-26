# Etap 2 & 3 Master Plan - Portfel GPW Advisor

## Implementation Plan for Marek's Requirements (Advanced Investor Features)

**Created**: 2025-10-26
**Duration**: 14 weeks (Etap 2: 6 weeks, Etap 3: 8 weeks)
**Status**: Planning Phase

---

## Executive Summary

This document outlines the complete implementation plan for Etap 2 and Etap 3 features, targeting advanced investors like **Marek** who require:

- Real-time market data
- AI-powered predictions
- Sentiment analysis
- Portfolio optimization
- Advanced alerts and reports

### Timeline Overview

```
Etap 2 (Weeks 7-12): Data & Analysis Foundation
├── Week 7-8:  Polygon.io Real-time Data Integration
├── Week 9-10: X (Twitter) Sentiment Analysis
└── Week 11-12: Dynamic Reports & Short Squeeze Alerts

Etap 3 (Weeks 13-20): Intelligence & Optimization
├── Week 13-15: LSTM Price Predictions
├── Week 16-18: Portfolio Optimization (Markowitz + ML)
└── Week 19-20: Polish, Testing & Deployment
```

---

## Current Status (End of Etap 1)

### ✅ Completed Features (Anna's Requirements)

- [x] Portfolio dashboard with real-time calculations
- [x] Interactive charts (Victory library)
- [x] Sortable portfolio table
- [x] CSV import functionality
- [x] Manual position entry
- [x] Local storage (AsyncStorage + localStorage)
- [x] Cross-platform support (iOS, Android, Web)
- [x] Basic push notifications
- [x] TypeScript strict mode (100%)
- [x] Test coverage framework (Jest)

### 📦 Tech Stack

```
Monorepo: Turborepo
Mobile: Expo + React Native
Web: Next.js + React Native Web
UI: React Native Paper + Custom Components
State: React Context + Hooks
Logic: Shared TypeScript Package
Testing: Jest + React Testing Library
```

---

## Etap 2: Data & Analysis (6 Weeks)

### Week 7-8: Real-time Market Data (Polygon.io)

**Assigned Agents**: @backend-expert, @frontend-expert

**Goal**: Replace mock data with real-time GPW stock prices

**Deliverables**:

1. **Backend** (`packages/logic/src/services/`)
   - `polygon.ts` - REST API client
   - `polygon-ws.ts` - WebSocket service for real-time updates
   - Data models for stock prices and historical data
   - Caching layer (5-minute cache)

2. **Frontend** (`packages/ui/src/hooks/`)
   - `useRealtimePrice.ts` - Real-time price updates
   - `useHistoricalData.ts` - Historical OHLCV data
   - Updated components (PortfolioSummary, PortfolioTable, StockChart)
   - Visual indicators (blinking on updates, connection status)

3. **Testing**
   - Unit tests for API client
   - Integration tests for WebSocket
   - Cross-platform testing
   - Offline/reconnection scenarios

**Dependencies**: `axios`, `ws`, `eventemitter3`

**See**: `.claude/workflows/etap2-polygon-integration.md`

---

### Week 9-10: Sentiment Analysis (X/Twitter)

**Assigned Agents**: @backend-expert, @ml-expert, @frontend-expert

**Goal**: Analyze market sentiment from Polish financial Twitter/X

**Deliverables**:

1. **Backend** (`packages/logic/src/services/`)
   - `twitter.ts` - X API v2 integration
   - `sentiment-cache.ts` - Cache sentiment scores

2. **ML Pipeline** (`packages/logic/src/ml/`)
   - `sentiment-analyzer.ts` - Polish NLP model (HerBERT or Polish RoBERTa)
   - Text preprocessing and aggregation
   - Confidence scoring

3. **Frontend** (`packages/ui/src/components/`)
   - `SentimentGauge` - Visual sentiment indicator
   - `SentimentTrend` - Historical sentiment chart
   - `SentimentBadge` - Compact bullish/bearish badge
   - `TweetFeed` - Recent tweets with sentiment

4. **Testing**
   - NLP model accuracy tests
   - API integration tests
   - Component rendering tests

**Dependencies**: `twitter-api-v2`, `@xenova/transformers`, `natural`

**Models**: HerBERT (`allegro/herbert-base-cased`) or Polish RoBERTa

**See**: `.claude/workflows/etap2-sentiment-analysis.md`

---

### Week 11-12: Reports & Alerts

**Assigned Agents**: @backend-expert, @frontend-expert, @devops-expert

**Goal**: Automated reports and short squeeze detection

**Part A: Dynamic Reports**

**Deliverables**:

1. **Backend** (`packages/logic/src/reports/`)
   - `generator.ts` - Daily/weekly/monthly report generation
   - `insights.ts` - Insights engine (concentration risk, diversification)
   - Export formats: PDF, CSV, JSON

2. **Frontend** (`packages/ui/src/components/reports/`)
   - `ReportCard` - Summary card
   - `ReportDetail` - Full report view
   - `ReportsListScreen` - Report history
   - `ReportSettingsScreen` - Scheduling preferences

**Part B: Short Squeeze Alerts**

**Deliverables**:

1. **Backend** (`packages/logic/src/services/`)
   - `short-interest.ts` - Data integration (Ortex or GPW reports)
   - `alerts/short-squeeze.ts` - Detection algorithm
   - `alerts/manager.ts` - Alert system

2. **Frontend** (`packages/ui/src/components/alerts/`)
   - `ShortSqueezeAlert` - Alert card
   - `AlertCenter` - Notification inbox
   - `AlertSettings` - User preferences

**Dependencies**: `@react-pdf/renderer`, `papaparse`, `node-cron`, `resend`

**See**: `.claude/workflows/etap2-reports-alerts.md`

---

## Etap 3: Intelligence & Optimization (8 Weeks)

### Week 13-15: LSTM Price Predictions

**Assigned Agents**: @ml-expert, @backend-expert, @frontend-expert

**Goal**: AI-powered stock price predictions with confidence intervals

**Deliverables**:

1. **ML Architecture** (`packages/logic/src/ml/`)
   - `lstm-predictor.ts` - LSTM model implementation
   - `training.ts` - Training pipeline
   - `data-loader.ts` - Feature engineering

2. **Features**:
   - Input: OHLCV + technical indicators + sentiment
   - Architecture: LSTM(64) → Dropout → LSTM(32) → Dense → Output
   - Horizons: 1 day, 3 days, 7 days, 30 days
   - Confidence intervals (95%)

3. **Backend** (`packages/logic/src/services/`)
   - `prediction.ts` - Prediction service
   - `model-training.ts` - Automated retraining

4. **Frontend** (`packages/ui/src/components/predictions/`)
   - `PredictionChart` - Visual predictions with CI
   - `PredictionCard` - Summary card
   - `ModelAccuracy` - Performance badge

5. **Testing**
   - Model accuracy (RMSE, MAE, R², direction accuracy)
   - Backtesting on historical data
   - Cross-platform prediction display

**Dependencies**: `@tensorflow/tfjs`, `technicalindicators`, `ml-matrix`

**Target Metrics**:

- Direction Accuracy: >55%
- RMSE: <5% of average price
- R²: >0.3

**See**: `.claude/workflows/etap3-lstm-predictions.md`

---

### Week 16-18: Portfolio Optimization

**Assigned Agents**: @ml-expert, @backend-expert, @frontend-expert

**Goal**: Markowitz portfolio optimization enhanced with ML predictions

**Deliverables**:

1. **Optimization Engine** (`packages/logic/src/optimization/`)
   - `markowitz.ts` - Portfolio optimization (quadratic programming)
   - `frontier.ts` - Efficient frontier calculation
   - `rebalancer.ts` - Rebalancing recommendations

2. **Backtesting** (`packages/logic/src/backtesting/`)
   - `engine.ts` - Historical simulation
   - Performance metrics (Sharpe, max drawdown, alpha)
   - Comparison to benchmark (WIG20)

3. **Frontend** (`packages/ui/src/components/optimization/`)
   - `OptimizationDashboard` - Main screen
   - `EfficientFrontier` - Risk/return chart
   - `RebalancingPlan` - Trade recommendations
   - `BacktestResults` - Historical performance

4. **Features**:
   - Objectives: Maximize return, minimize risk, maximize Sharpe ratio
   - Constraints: Max/min position size, sector limits
   - ML Integration: Use LSTM predictions for expected returns
   - Transaction cost accounting

**Dependencies**: `mathjs`, `numeric`, `ml-matrix`, `d3`

**See**: `.claude/workflows/etap3-portfolio-optimization.md`

---

### Week 19-20: Polish & Deployment

**Assigned Agents**: @qa-expert, @devops-expert, @frontend-expert, @backend-expert

**Goal**: Production-ready application with comprehensive testing

**Deliverables**:

1. **Testing**
   - Unit tests: >80% coverage
   - E2E tests: Detox (mobile) + Playwright (web)
   - Performance tests: Lighthouse audits
   - Security audits

2. **Deployment**
   - iOS: App Store (TestFlight → Production)
   - Android: Google Play (Internal → Beta → Production)
   - Web: Vercel/Netlify with CDN

3. **Monitoring**
   - Error tracking: Sentry
   - Analytics: PostHog or Mixpanel
   - Performance: Firebase Performance

4. **Documentation**
   - User guide and FAQ
   - Privacy policy and ToS
   - API documentation

**See**: `.claude/workflows/etap3-polish-deploy.md`

---

## Team & Agents

### Specialized Claude Code Agents

1. **@frontend-expert** (`.claude/agents/frontend-expert.md`)
   - React Native & Next.js
   - UI/UX implementation
   - Cross-platform components
   - Performance optimization

2. **@backend-expert** (`.claude/agents/backend-expert.md`)
   - API integrations
   - Data services
   - WebSocket management
   - Caching strategies

3. **@ml-expert** (`.claude/agents/ml-expert.md`)
   - LSTM models
   - Sentiment analysis
   - Portfolio optimization
   - Model training and evaluation

4. **@qa-expert** (`.claude/agents/qa-expert.md`)
   - Test strategy
   - E2E testing
   - Performance testing
   - Bug identification

5. **@devops-expert** (`.claude/agents/devops-expert.md`)
   - CI/CD pipelines
   - Deployment automation
   - Monitoring setup
   - Infrastructure management

### Collaboration Workflow

```
1. Weekly kickoff: Review plan and assign tasks
2. Daily standups: Progress updates and blockers
3. Code reviews: All PRs reviewed by relevant agent
4. Weekly demos: Show progress to stakeholders
5. Retrospectives: Continuous improvement
```

---

## API Integrations & Costs

### 1. Polygon.io (Real-time Data)

- **Plan**: Starter ($99/month) or Free (limited)
- **Features**: Real-time prices, historical data, WebSocket
- **Rate Limits**: Free (5 req/s), Starter (unlimited)
- **Alternatives**: Stooq.pl (free, delayed), GPW API

### 2. X (Twitter) API

- **Plan**: Free tier (1,500 tweets/month) or Basic ($100/month)
- **Features**: Search tweets, user timeline, streaming
- **Rate Limits**: Free (very limited), Basic (10k/month)
- **Alternatives**: Reddit API, StockTwits

### 3. HuggingFace (NLP Models)

- **Plan**: Free inference API or self-hosted
- **Features**: Pre-trained Polish models (HerBERT, RoBERTa)
- **Costs**: Free (rate limited) or Pro ($9/month)
- **Alternatives**: Transformers.js (client-side, free)

### 4. Ortex (Short Interest)

- **Plan**: Retail ($49/month) or Professional ($199/month)
- **Features**: Real-time short interest, squeeze signals
- **Alternatives**: GPW official reports (free, delayed)

### 5. SendGrid/Resend (Email Reports)

- **Plan**: Free (100 emails/day) or Essentials ($15/month)
- **Features**: Transactional emails, analytics
- **Alternatives**: In-app only (no email)

### Total Estimated Costs

| Service     | Free Tier        | Paid Tier          | Recommended     |
| ----------- | ---------------- | ------------------ | --------------- |
| Polygon.io  | ✓ (limited)      | $99/month          | Start free      |
| X API       | ✓ (very limited) | $100/month         | Basic           |
| HuggingFace | ✓                | $9/month           | Self-hosted     |
| Ortex       | ✗                | $49-199/month      | GPW (free)      |
| Email       | ✓                | $15/month          | Free tier       |
| **Total**   | **$0**           | **$263-363/month** | **~$100/month** |

**Recommendation**: Start with free tiers, upgrade based on user demand.

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk                        | Impact | Probability | Mitigation                                                             |
| --------------------------- | ------ | ----------- | ---------------------------------------------------------------------- |
| Low ML model accuracy       | High   | Medium      | Set realistic expectations, show confidence intervals, add disclaimers |
| API rate limits             | Medium | High        | Aggressive caching, fallback to free sources                           |
| GPW data not on Polygon.io  | High   | Low         | Research data availability first, prepare alternatives                 |
| Performance issues (mobile) | Medium | Medium      | Optimize bundle size, lazy loading, server-side processing             |
| WebSocket instability       | Medium | Medium      | Auto-reconnect, fallback to polling                                    |

### Business Risks

| Risk                                  | Impact | Probability | Mitigation                                            |
| ------------------------------------- | ------ | ----------- | ----------------------------------------------------- |
| High API costs                        | High   | Medium      | Start with free tiers, monetize with premium features |
| Low user adoption                     | High   | Medium      | Marketing, beta testing, user feedback                |
| Regulatory issues (investment advice) | High   | Low         | Clear disclaimers, "educational only", consult legal  |
| Competition                           | Medium | High        | Focus on Polish market, open source advantage         |

### Legal/Compliance Risks

| Risk                   | Impact | Probability | Mitigation                                                 |
| ---------------------- | ------ | ----------- | ---------------------------------------------------------- |
| GDPR violations        | High   | Low         | Data minimization, export/delete features, privacy policy  |
| Securities regulations | High   | Low         | Not providing personalized advice, educational disclaimers |
| API ToS violations     | Medium | Low         | Review all API terms, comply with usage policies           |

---

## Success Metrics (KPIs)

### User Engagement

- Daily Active Users (DAU): Target 100+ in first month
- Weekly Active Users (WAU): Target 300+ in first month
- Retention (Day 7): Target >40%
- Average session duration: Target >5 minutes

### Feature Usage

- Portfolios created: Target 200+ in first month
- Optimizations run: Target 50+ per week
- Reports generated: Target 100+ per week
- Sentiment views: Target 500+ per week

### Technical

- App crash rate: <1% of sessions
- API error rate: <0.5% of requests
- Average load time: <2 seconds
- Test coverage: >80%

### Business

- Total portfolio value managed: Target 5M PLN in 3 months
- User NPS (Net Promoter Score): Target >40
- App Store rating: Target >4.5 stars

---

## Milestones & Demos

### Week 8 Demo: Real-time Data

- Show live price updates in dashboard
- Demonstrate WebSocket connection
- Compare real vs mock data

### Week 10 Demo: Sentiment Analysis

- Show sentiment scores for portfolio stocks
- Demonstrate tweet feed
- Show historical sentiment trends

### Week 12 Demo: Reports & Alerts

- Generate and export sample report
- Trigger short squeeze alert
- Show notification delivery

### Week 15 Demo: LSTM Predictions

- Show price predictions with confidence intervals
- Demonstrate prediction accuracy
- Compare predicted vs actual prices

### Week 18 Demo: Portfolio Optimization

- Run optimization on sample portfolio
- Show efficient frontier
- Generate rebalancing recommendations

### Week 20 Demo: Launch

- Full app walkthrough
- Performance benchmarks
- User testimonials (from beta)

---

## Dependencies & Prerequisites

### External Accounts Required

1. Polygon.io account (Week 7)
2. X Developer account (Week 9)
3. HuggingFace account (Week 9)
4. Ortex account or GPW access (Week 11)
5. Apple Developer account $99 (Week 20)
6. Google Play Developer account $25 (Week 20)
7. Sentry account (Week 20)
8. PostHog or Mixpanel account (Week 20)

### Infrastructure

- GitHub repository (already set up)
- Vercel/Netlify account (Week 20)
- Optional: Cloud GPU for ML training (Google Colab free tier)

### Skills Required

- TypeScript/JavaScript: ✅ (team has)
- React Native: ✅ (team has)
- Next.js: ✅ (team has)
- Machine Learning: 🟡 (learning required)
- Portfolio Theory: 🟡 (learning required)
- NLP: 🟡 (learning required)

---

## Learning Resources

### Machine Learning

- **LSTM for Time Series**: [TensorFlow.js Tutorial](https://www.tensorflow.org/js/tutorials)
- **Stock Prediction**: [Kaggle Notebooks](https://www.kaggle.com/code/taronzakaryan/stock-prediction-lstm-using-tensorflow)
- **NLP with HuggingFace**: [Course](https://huggingface.co/course)

### Portfolio Theory

- **Modern Portfolio Theory**: [Investopedia](https://www.investopedia.com/terms/m/modernportfoliotheory.asp)
- **Markowitz Optimization**: [Paper](https://www.jstor.org/stable/2975974)
- **Efficient Frontier**: [Khan Academy](https://www.khanacademy.org/economics-finance-domain/core-finance)

### APIs

- **Polygon.io Docs**: https://polygon.io/docs
- **X API v2**: https://developer.twitter.com/en/docs/twitter-api
- **TensorFlow.js**: https://www.tensorflow.org/js/guide

---

## Next Steps

1. **Week 7 Kickoff** (Start Etap 2)
   - Review Polygon.io integration workflow
   - Register for Polygon.io account
   - Set up development environment for API testing
   - Assign tasks to @backend-expert and @frontend-expert

2. **Daily Workflow**
   - Morning: Check workflow file for current week
   - Execute tasks assigned to each agent
   - Update todo list with progress
   - Evening: Code review and commit changes

3. **Weekly Cadence**
   - Monday: Week kickoff and planning
   - Wednesday: Mid-week checkpoint
   - Friday: Demo and retrospective
   - Saturday/Sunday: Buffer for blockers

4. **Agent Invocation**

   ```bash
   # Example: Invoke backend expert for Week 7
   @backend-expert: Please implement Polygon.io REST API client
   according to .claude/workflows/etap2-polygon-integration.md

   # Example: Invoke ML expert for Week 13
   @ml-expert: Please design and train LSTM model for price predictions
   according to .claude/workflows/etap3-lstm-predictions.md
   ```

---

## Appendix: File Structure

```
packages/logic/src/
├── services/
│   ├── polygon.ts                # Week 7
│   ├── polygon-ws.ts             # Week 7
│   ├── twitter.ts                # Week 9
│   ├── short-interest.ts         # Week 11
│   ├── prediction.ts             # Week 13
│   └── optimization.ts           # Week 16
├── ml/
│   ├── sentiment-analyzer.ts     # Week 9
│   ├── data-loader.ts            # Week 13
│   ├── lstm-predictor.ts         # Week 13
│   └── training.ts               # Week 13
├── optimization/
│   ├── markowitz.ts              # Week 16
│   ├── frontier.ts               # Week 16
│   └── rebalancer.ts             # Week 16
├── backtesting/
│   └── engine.ts                 # Week 17
├── reports/
│   ├── generator.ts              # Week 11
│   └── insights.ts               # Week 11
└── alerts/
    ├── short-squeeze.ts          # Week 11
    └── manager.ts                # Week 11

packages/ui/src/components/
├── predictions/
│   ├── PredictionChart.tsx       # Week 14
│   ├── PredictionCard.tsx        # Week 14
│   └── ModelAccuracy.tsx         # Week 14
├── optimization/
│   ├── OptimizationDashboard.tsx # Week 18
│   ├── EfficientFrontier.tsx     # Week 18
│   └── RebalancingPlan.tsx       # Week 18
├── reports/
│   ├── ReportCard.tsx            # Week 11
│   └── ReportDetail.tsx          # Week 11
└── alerts/
    ├── ShortSqueezeAlert.tsx     # Week 12
    └── AlertCenter.tsx           # Week 12
```

---

**Document Version**: 1.0
**Last Updated**: 2025-10-26
**Maintained By**: Development Team + Claude Code Agents
