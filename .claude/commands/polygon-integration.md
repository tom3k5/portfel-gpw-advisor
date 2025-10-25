---
description: Integrate Polygon.io API for real-time GPW data
---

You are implementing real-time market data integration (Etap 2, Week 1-2).

**Context**: App needs live stock prices and volume data from GPW via Polygon.io API.

**Requirements**:
- WebSocket connection for real-time updates
- REST API for historical data
- Update dashboard prices live
- Handle connection errors gracefully

**Polygon.io API endpoints needed**:
- WebSocket: `wss://socket.polygon.io/stocks`
- REST: `/v2/aggs/ticker/{symbol}/range/1/day/{from}/{to}` (historical)
- REST: `/v2/last/trade/{symbol}` (latest price)

**Your task**:
1. Create Polygon service in `packages/logic/src/services/polygon.ts`:
   - `connectWebSocket()` - establish WebSocket connection
   - `subscribeToSymbols(symbols[])` - subscribe to stock updates
   - `getHistoricalData(symbol, from, to)` - fetch historical prices
   - `getCurrentPrice(symbol)` - get latest price
   - Handle reconnection logic

2. Implement price update system:
   - Store latest prices in global state (Zustand or Redux)
   - Broadcast updates to all components
   - Update portfolio calculations in real-time

3. Add WebSocket event handlers:
   - `onPriceUpdate` - update state
   - `onError` - log and retry
   - `onDisconnect` - attempt reconnection

4. Create data transformation utilities:
   - Convert Polygon data format to app format
   - Handle GPW-specific symbols (e.g., "PKN.WSE")
   - Cache data to reduce API calls

5. Update dashboard to use real-time data:
   - Replace mock prices with live data
   - Show live update indicators
   - Display last update timestamp

6. Add connection status UI:
   - Show "Live", "Connecting", "Disconnected" badge
   - Retry button if connection fails

**Environment variables needed**:
```
POLYGON_API_KEY=your_key_here
POLYGON_WS_URL=wss://socket.polygon.io/stocks
```

**Error handling**:
- API rate limits (max 5 requests/minute on free tier)
- Network failures
- Invalid symbols
- Market closed hours

**Expected deliverable**: Dashboard showing real-time price updates from Polygon.io during market hours
