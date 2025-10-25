# Etap 2 Summary: Data & Analysis (6 weeks)

## Overview
Etap 2 focuses on integrating real-time market data and sentiment analysis to enhance recommendation quality.

## Key Milestones

### Weeks 1-2: Real-time Data Integration
**Goal:** Connect to Polygon.io and display live prices

**Commands:**
- `/polygon-integration`

**Deliverables:**
- [ ] WebSocket connection to Polygon.io
- [ ] Real-time price updates in dashboard
- [ ] Historical data fetching via REST API
- [ ] Connection status indicator
- [ ] Error handling and reconnection logic

**Success Criteria:**
- Prices update within 1 second of market changes
- Handles disconnections gracefully
- Works during market hours (8:30-17:00 CET)

### Weeks 3-4: Sentiment Analysis
**Goal:** Implement X (Twitter) sentiment analysis

**Commands:**
- `/sentiment-analysis`

**Deliverables:**
- [ ] X API integration
- [ ] NLP sentiment analyzer (Polish language support)
- [ ] Sentiment scores displayed in dashboard
- [ ] Sentiment trend indicators
- [ ] Integration with recommendation engine

**Success Criteria:**
- Analyzes at least 50 tweets per stock
- Sentiment score accuracy >70%
- Updates every 2 hours during market hours
- Handles low-volume stocks gracefully

### Weeks 5-6: Dynamic Reports & ML Foundation
**Goal:** Enhanced reports with sentiment and basic ML predictions

**Deliverables:**
- [ ] Dynamic reports with real-time data
- [ ] Sentiment included in reports
- [ ] Short squeeze alerts (Ortex integration)
- [ ] Basic ML model (linear regression) for price trends
- [ ] Improved recommendation engine

**Report example:**
```
📊 Raport Portfela - 25.10.2025, 16:00 CET

Wartość portfela: 25,430 PLN (+2.3% dzisiaj)

🔥 Top Movers:
✅ JSW: +5.2% | Sentyment: 78% ⬆ | KUPUJ
❌ PKN: -2.1% | Sentyment: 45% ⬇ | TRZYMAJ

⚠️ Alerty:
🚀 JSW: Potencjalny short squeeze (SI: 15%, wzrost 3%)

Rekomendacje:
- KUPUJ: JSW, CDR
- SPRZEDAJ: -
- TRZYMAJ: PKN
```

## Technical Architecture Updates

### New Services
```typescript
packages/logic/src/services/
├── polygon.ts          // Polygon.io integration
├── twitter.ts          // X API integration
├── ortex.ts           // Ortex data
└── websocket.ts       // WebSocket manager
```

### New State
```typescript
interface MarketDataState {
  liveprices: Record<symbol, LivePrice>;
  sentimentScores: Record<symbol, SentimentData>;
  shortInterest: Record<symbol, ShortInterestData>;
  alerts: Alert[];
}
```

### Database Schema Additions
```sql
CREATE TABLE sentiment_history (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10),
  score DECIMAL(3,2),
  confidence DECIMAL(3,2),
  tweet_count INTEGER,
  created_at TIMESTAMP
);

CREATE TABLE price_history (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10),
  open DECIMAL(10,2),
  high DECIMAL(10,2),
  low DECIMAL(10,2),
  close DECIMAL(10,2),
  volume BIGINT,
  timestamp TIMESTAMP
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  symbol VARCHAR(10),
  type VARCHAR(50),
  message TEXT,
  created_at TIMESTAMP,
  read BOOLEAN DEFAULT false
);
```

## Testing Requirements
- [ ] Integration tests for all external APIs
- [ ] WebSocket connection resilience tests
- [ ] Sentiment analysis accuracy tests
- [ ] End-to-end report generation tests
- [ ] Load testing (100+ concurrent WebSocket connections)

## Performance Targets
- WebSocket latency: <500ms
- API response time: <200ms
- Sentiment analysis: <2s per stock
- Report generation: <5s

## Definition of Done
✅ Real-time prices updating on dashboard
✅ Sentiment scores displayed for all positions
✅ Dynamic reports sent at 8:00 and 16:00 CET
✅ Short squeeze alerts working
✅ Basic ML predictions available
✅ Test coverage >80%
✅ Documentation updated
✅ Demo successful

## Risks & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| API rate limits | High | Implement caching, request throttling |
| Twitter API costs | Medium | Limit to essential queries, cache results |
| Sentiment accuracy | High | Use hybrid approach (rule-based + ML) |
| WebSocket stability | High | Auto-reconnect, fallback to polling |

## Next Phase Preview
Etap 3 will implement advanced LSTM predictions and portfolio optimization.
