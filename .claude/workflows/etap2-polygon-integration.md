# Etap 2, Week 7-8: Polygon.io Integration for Real-time GPW Data

**Goal**: Integrate Polygon.io API to provide real-time and historical market data for Polish stocks (GPW)

**Duration**: 2 weeks

**Assigned Agents**: @backend-expert, @frontend-expert

---

## Technical Requirements

### Backend (@backend-expert)

1. **API Service Layer** (`packages/logic/src/services/polygon.ts`)
   - Polygon.io REST API client with TypeScript
   - Authentication with API key
   - Rate limiting (5 requests/second for free tier)
   - Caching layer (Redis or in-memory)
   - Error handling and retry logic

2. **Data Models** (`packages/logic/src/types/market-data.ts`)

   ```typescript
   interface StockPrice {
     symbol: string;
     price: number;
     timestamp: Date;
     open: number;
     high: number;
     low: number;
     volume: number;
     change: number;
     changePercent: number;
   }

   interface HistoricalData {
     symbol: string;
     timeframe: '1D' | '1W' | '1M' | '1Y';
     data: DataPoint[];
   }
   ```

3. **WebSocket Service** (`packages/logic/src/services/polygon-ws.ts`)
   - Real-time price updates via WebSocket
   - Subscription management for watched symbols
   - Connection state handling (connect/disconnect/reconnect)
   - Event emitters for price updates

4. **Endpoints to Implement**
   - `GET /api/stocks/:symbol/price` - Current price
   - `GET /api/stocks/:symbol/history` - Historical data (1D, 1W, 1M, 1Y)
   - `GET /api/stocks/search?query=` - Symbol search
   - `WebSocket /ws/stocks` - Real-time price stream

### Frontend (@frontend-expert)

1. **Real-time Price Hook** (`packages/ui/src/hooks/useRealtimePrice.ts`)

   ```typescript
   export function useRealtimePrice(symbol: string) {
     const [price, setPrice] = useState<StockPrice | null>(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);

     // WebSocket subscription logic
     // Auto-reconnect on disconnect
     // Cleanup on unmount
   }
   ```

2. **Historical Data Hook** (`packages/ui/src/hooks/useHistoricalData.ts`)
   - Fetch historical data with caching
   - Support multiple timeframes
   - Loading states and error handling

3. **Updated Components**
   - `PortfolioSummary`: Real-time total value updates
   - `PortfolioTable`: Live P&L calculations with price updates
   - `StockChart`: Real historical data instead of mocks
   - New `PriceTickerBadge`: Animated price changes

4. **Visual Indicators**
   - Blinking/pulsing on price updates
   - Color-coded changes (green up, red down)
   - Last update timestamp
   - Connection status indicator

---

## Implementation Tasks

### Week 7: Backend Foundation

**Day 1-2**: Setup & API Client

- [ ] Register Polygon.io account and get API key
- [ ] Create `packages/logic/src/services/polygon.ts`
- [ ] Implement REST client with axios/fetch
- [ ] Add API key to environment variables
- [ ] Write unit tests for API client

**Day 3-4**: Data Fetching

- [ ] Implement current price fetching
- [ ] Implement historical data fetching (OHLCV)
- [ ] Add caching layer (5-minute cache for prices)
- [ ] Implement symbol search
- [ ] Write integration tests

**Day 5**: WebSocket Setup

- [ ] Create WebSocket service (`polygon-ws.ts`)
- [ ] Implement connection management
- [ ] Add subscription/unsubscription logic
- [ ] Test with multiple symbols

### Week 8: Frontend Integration

**Day 1-2**: Hooks & State Management

- [ ] Create `useRealtimePrice` hook
- [ ] Create `useHistoricalData` hook
- [ ] Add WebSocket connection context
- [ ] Implement reconnection logic
- [ ] Write hook tests

**Day 3-4**: Component Updates

- [ ] Update `PortfolioSummary` with real-time data
- [ ] Update `PortfolioTable` with live prices
- [ ] Update `StockChart` with historical data
- [ ] Add loading skeletons
- [ ] Add error boundaries

**Day 5**: Polish & Testing

- [ ] Create `PriceTickerBadge` component
- [ ] Add connection status indicator
- [ ] Add visual price change animations
- [ ] Cross-platform testing (mobile + web)
- [ ] Performance optimization (debouncing updates)

---

## Testing Checklist

- [ ] Unit tests for API client (>80% coverage)
- [ ] Integration tests for data fetching
- [ ] WebSocket connection stability tests
- [ ] Mobile app real-time updates
- [ ] Web app real-time updates
- [ ] Offline/reconnection scenarios
- [ ] Rate limiting handling
- [ ] Error state UX

---

## Dependencies to Add

```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "ws": "^8.14.0",
    "eventemitter3": "^5.0.1"
  },
  "devDependencies": {
    "@types/ws": "^8.5.8"
  }
}
```

---

## Environment Variables

```env
# .env.local
POLYGON_API_KEY=your_api_key_here
POLYGON_WS_URL=wss://socket.polygon.io/stocks
POLYGON_REST_URL=https://api.polygon.io
```

---

## Success Criteria

- ✅ Real-time price updates with <1 second latency
- ✅ Historical charts showing actual GPW data
- ✅ Smooth WebSocket reconnection on disconnect
- ✅ Responsive UI with loading states
- ✅ Error handling for API failures
- ✅ Cross-platform support (mobile + web)
- ✅ Test coverage >80%

---

## Risks & Mitigations

**Risk 1**: Polygon.io free tier rate limits (5 req/s)

- _Mitigation_: Implement aggressive caching, batch requests

**Risk 2**: WebSocket connection instability on mobile

- _Mitigation_: Auto-reconnect logic, fallback to polling

**Risk 3**: GPW symbols may not be available on Polygon.io

- _Mitigation_: Research alternative APIs (Stooq.pl, GPW API), prepare adapter pattern

**Risk 4**: Real-time updates draining battery on mobile

- _Mitigation_: Reduce update frequency when app in background, user setting for update interval
