# Etap 2, Week 11-12: Dynamic Reports & Short Squeeze Alerts

**Goal**: Generate automated portfolio reports and implement short squeeze detection with alerts

**Duration**: 2 weeks

**Assigned Agents**: @backend-expert, @frontend-expert, @devops-expert

---

## Technical Requirements

### Part A: Dynamic Portfolio Reports

#### Backend (@backend-expert)

1. **Report Generator** (`packages/logic/src/reports/generator.ts`)

   ```typescript
   interface PortfolioReport {
     id: string;
     generatedAt: Date;
     period: 'daily' | 'weekly' | 'monthly';
     summary: {
       totalValue: number;
       totalPnL: number;
       bestPerformer: Position;
       worstPerformer: Position;
       sectorAllocation: SectorBreakdown[];
     };
     insights: Insight[];
     recommendations: Recommendation[];
   }

   interface Insight {
     type: 'warning' | 'success' | 'info';
     title: string;
     description: string;
     relatedSymbols: string[];
   }
   ```

2. **Report Types**
   - **Daily Report**: End-of-day performance summary
   - **Weekly Report**: 7-day trends, top movers, sector analysis
   - **Monthly Report**: Comprehensive analysis, goal progress, rebalancing suggestions
   - **On-Demand**: Generate report anytime

3. **Insights Engine** (`packages/logic/src/reports/insights.ts`)
   - Detect concentration risk (>30% in one position)
   - Identify underperformers (>10% below market)
   - Calculate diversification score
   - Suggest rebalancing actions
   - Track goal progress

4. **Export Formats**
   - PDF (react-pdf)
   - CSV (positions data)
   - JSON (full report data)

#### Frontend (@frontend-expert)

1. **Report Components** (`packages/ui/src/components/reports/`)
   - `ReportCard`: Summary card for each report
   - `ReportDetail`: Full report view
   - `InsightBadge`: Visual insight indicator
   - `ReportExport`: Export options (PDF/CSV/JSON)

2. **Report Screens**
   - `ReportsListScreen`: History of all reports
   - `ReportDetailScreen`: Full report with charts
   - `ReportSettingsScreen`: Schedule, preferences

### Part B: Short Squeeze Alerts

#### Backend (@backend-expert)

1. **Short Interest Data** (`packages/logic/src/services/short-interest.ts`)

   ```typescript
   interface ShortInterestData {
     symbol: string;
     timestamp: Date;
     shortInterest: number; // shares sold short
     floatShares: number; // shares available for trading
     shortRatio: number; // days to cover
     shortPercentOfFloat: number; // % of float sold short
   }

   interface ShortSqueezeAlert {
     symbol: string;
     severity: 'low' | 'medium' | 'high';
     indicators: {
       shortPercentOfFloat: number; // >20% = high risk
       daysTooCover: number; // >10 days = high risk
       recentPriceIncrease: number; // % increase
       volumeSpike: boolean;
     };
     message: string;
     triggeredAt: Date;
   }
   ```

2. **Data Sources** (Priority order)
   - Option 1: Ortex (premium, most accurate) - API integration
   - Option 2: GPW official reports (free, delayed)
   - Option 3: Alternative data providers (FinancialModelingPrep)

3. **Detection Algorithm** (`packages/logic/src/alerts/short-squeeze.ts`)

   ```typescript
   function detectShortSqueeze(data: ShortInterestData, priceData: StockPrice[]): ShortSqueezeAlert | null {
     const criteria = {
       highShortInterest: data.shortPercentOfFloat > 20, // >20% of float
       highDaysToCover: data.shortRatio > 10, // >10 days to cover
       priceIncreasing: recentPriceIncrease > 5, // >5% increase recently
       volumeSpike: currentVolume > avgVolume * 2, // 2x average volume
     };

     if (criteria matched >= 3) {
       return createAlert('high' or 'medium');
     }
   }
   ```

4. **Alert System** (`packages/logic/src/alerts/manager.ts`)
   - Monitor short interest daily
   - Trigger alerts on squeeze detection
   - Push notifications
   - Email notifications (optional)
   - In-app notification center

#### Frontend (@frontend-expert)

1. **Alert Components** (`packages/ui/src/components/alerts/`)
   - `ShortSqueezeAlert`: Visual alert card
   - `AlertBadge`: Indicator on portfolio table
   - `AlertCenter`: Notification inbox
   - `AlertSettings`: Configure alert preferences

2. **Visual Indicators**
   - Red warning badge on positions at risk
   - Dedicated "Alerts" tab in dashboard
   - Push notification on squeeze detection
   - Historical alert timeline

---

## Implementation Tasks

### Week 11: Reports System

**Day 1-2**: Report Generator

- [ ] Create `packages/logic/src/reports/generator.ts`
- [ ] Implement report data models
- [ ] Create daily/weekly/monthly report logic
- [ ] Build insights engine (concentration, diversification)
- [ ] Write tests for report generation

**Day 3**: Export Functionality

- [ ] Integrate react-pdf for PDF export
- [ ] Implement CSV export
- [ ] Implement JSON export
- [ ] Add email delivery option (SendGrid/Resend)
- [ ] Test export on mobile and web

**Day 4**: Frontend - Report UI

- [ ] Create `ReportCard` component
- [ ] Create `ReportDetail` screen
- [ ] Create `ReportsListScreen`
- [ ] Add report scheduling UI
- [ ] Platform-specific variants (.web.tsx)

**Day 5**: Scheduling & Automation

- [ ] Implement report scheduling (cron jobs)
- [ ] Add background task for report generation
- [ ] Push notification on report ready
- [ ] Store reports in local database
- [ ] Test automated report flow

### Week 12: Short Squeeze Alerts

**Day 1-2**: Data Integration

- [ ] Research short interest data sources
- [ ] Implement Ortex API integration (or alternative)
- [ ] Create `packages/logic/src/services/short-interest.ts`
- [ ] Implement data fetching and caching
- [ ] Write integration tests

**Day 3**: Detection Algorithm

- [ ] Create `packages/logic/src/alerts/short-squeeze.ts`
- [ ] Implement squeeze detection logic
- [ ] Add severity calculation
- [ ] Create alert data models
- [ ] Write algorithm tests with historical data

**Day 4**: Alert System

- [ ] Create `packages/logic/src/alerts/manager.ts`
- [ ] Implement alert monitoring (daily checks)
- [ ] Add push notification triggers
- [ ] Create alert storage
- [ ] Build notification center

**Day 5**: Frontend & Testing

- [ ] Create `ShortSqueezeAlert` component
- [ ] Create `AlertCenter` screen
- [ ] Add alert badges to portfolio table
- [ ] Add alert settings screen
- [ ] End-to-end testing
- [ ] Cross-platform testing

---

## Testing Checklist

### Reports

- [ ] Report generation (daily/weekly/monthly)
- [ ] Insights accuracy (concentration, diversification)
- [ ] PDF export quality
- [ ] CSV export data integrity
- [ ] Email delivery
- [ ] Scheduled report automation
- [ ] Mobile report viewing
- [ ] Web report viewing

### Alerts

- [ ] Short interest data fetching
- [ ] Squeeze detection accuracy
- [ ] Alert severity calculation
- [ ] Push notification delivery
- [ ] Alert center functionality
- [ ] Historical alerts
- [ ] Alert settings persistence

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@react-pdf/renderer": "^3.1.14",
    "papaparse": "^5.4.1",
    "node-cron": "^3.0.2",
    "resend": "^2.0.0",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.8",
    "@types/papaparse": "^5.3.8"
  }
}
```

---

## Environment Variables

```env
# Short Interest Data
ORTEX_API_KEY=your_ortex_key
# or
FMP_API_KEY=your_fmp_key

# Email (optional)
RESEND_API_KEY=your_resend_key
REPORT_EMAIL_FROM=reports@portfel-gpw.com
```

---

## Report Templates

### Daily Report Structure

```
📊 Daily Portfolio Report - [Date]

Summary
- Total Value: 12,345.67 PLN (+2.3%)
- Today's P&L: +285.40 PLN
- Best Performer: PKN (+5.2%)
- Worst Performer: KGHM (-2.1%)

Insights
⚠️ Concentration Risk: PKN represents 35% of portfolio
✅ Diversified: Portfolio spans 5 sectors
ℹ️ Market Sentiment: Bullish on energy sector

Actions
- Consider rebalancing PKN position
- Review underperforming positions
```

### Short Squeeze Alert Template

```
🚨 Short Squeeze Alert - [Symbol]

Severity: HIGH

Indicators:
- Short Interest: 28% of float
- Days to Cover: 12.5 days
- Recent Price Action: +8.3% (3 days)
- Volume Spike: 3.2x average

This position may experience rapid price movement.
Consider reviewing your position size.
```

---

## Success Criteria

### Reports

- ✅ Automated daily/weekly/monthly reports
- ✅ PDF export with charts and insights
- ✅ CSV/JSON export functionality
- ✅ Email delivery option
- ✅ Actionable insights and recommendations
- ✅ Cross-platform report viewing
- ✅ Test coverage >80%

### Alerts

- ✅ Real-time short squeeze detection
- ✅ Accurate severity classification
- ✅ Push notifications on alerts
- ✅ Alert history and tracking
- ✅ Configurable alert preferences
- ✅ Cross-platform support
- ✅ Test coverage >80%

---

## Risks & Mitigations

**Risk 1**: Short interest data costs (Ortex is expensive)

- _Mitigation_: Use free GPW reports initially, add premium later

**Risk 2**: False positive alerts (too many alerts)

- _Mitigation_: Strict detection criteria, user-adjustable sensitivity

**Risk 3**: Report generation performance on mobile

- _Mitigation_: Generate in background, cache results, optimize PDF size

**Risk 4**: Email delivery reliability

- _Mitigation_: Use reliable service (Resend/SendGrid), add retry logic

**Risk 5**: Push notification permissions

- _Mitigation_: Clear onboarding, explain value, fallback to in-app

---

## Future Enhancements

### Reports

- Custom report templates
- Comparison with market indices (WIG20, mWIG40)
- Tax reporting (PIT-38 assistance)
- Share reports with others
- AI-generated insights

### Alerts

- Insider trading alerts
- Earnings announcement alerts
- Dividend calendar alerts
- Technical indicator alerts (RSI, MACD)
- News sentiment alerts
