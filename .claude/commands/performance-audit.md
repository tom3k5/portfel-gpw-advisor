---
description: Conduct performance audit and optimization
---

You are conducting a comprehensive performance audit of Portfel GPW Advisor.

**Your task:**

## 1. Frontend Performance

### Bundle Size Analysis
```bash
# Web app
cd apps/web
npm run analyze

# Check what's taking space
npx source-map-explorer build/static/js/*.js
```

**Targets:**
- Web bundle (gzipped): <500KB
- Mobile OTA update: <30MB

**Optimizations:**
- Code splitting (React.lazy)
- Tree shaking (check imports)
- Remove unused dependencies
- Compress images
- Use CDN for assets

### Runtime Performance
```typescript
// Use React DevTools Profiler
// Measure:
// - Component render time
// - Unnecessary re-renders
// - Memory leaks

// Check for:
const MemoizedComponent = React.memo(Component);
const value = useMemo(() => expensive(), [deps]);
const callback = useCallback(() => {}, [deps]);
```

**Targets:**
- 60 FPS scrolling
- Time to Interactive: <2s
- First Contentful Paint: <1s

### Mobile App
```bash
# iOS performance
# Open in Xcode > Product > Profile
# Check CPU, Memory, Leaks

# Android performance
# Use Flipper or Android Studio Profiler
```

## 2. Backend Performance

### API Response Times
```bash
# Add timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path}: ${Date.now() - start}ms`);
  });
  next();
});
```

**Targets:**
- 95th percentile: <200ms
- Database queries: <50ms
- External API calls: cached when possible

### Database Optimization
```sql
-- Check slow queries
EXPLAIN ANALYZE SELECT * FROM positions WHERE user_id = 1;

-- Add missing indexes
CREATE INDEX idx_positions_user_symbol ON positions(user_id, symbol);

-- Check index usage
SELECT * FROM pg_stat_user_indexes;
```

**Checklist:**
- [ ] All foreign keys indexed
- [ ] Commonly queried columns indexed
- [ ] Use `select` to limit fields
- [ ] Implement pagination
- [ ] Use connection pooling
- [ ] Enable query caching (Redis)

### Caching Strategy
```typescript
// Cache frequently accessed data
const cachedPrice = await redis.get(`price:${symbol}`);
if (cachedPrice) return JSON.parse(cachedPrice);

const price = await fetchPrice(symbol);
await redis.setex(`price:${symbol}`, 300, JSON.stringify(price));
return price;
```

**Cache TTLs:**
- Current prices: 5s
- Sentiment scores: 2h
- Predictions: 24h
- User portfolio: 5min

## 3. AI/ML Performance

### Model Inference
```typescript
// Measure inference time
const start = performance.now();
const prediction = await model.predict(input);
const duration = performance.now() - start;
console.log(`Inference took ${duration}ms`);
```

**Targets:**
- LSTM inference: <100ms
- Portfolio optimization: <2s

**Optimizations:**
- Use ONNX optimized models
- Batch predictions when possible
- Cache predictions
- Use GPU if available (server-side)

## 4. Network Performance

### WebSocket Optimization
```typescript
// Batch updates instead of sending individually
const updates = [];
const flushInterval = setInterval(() => {
  if (updates.length > 0) {
    ws.send(JSON.stringify(updates));
    updates.length = 0;
  }
}, 100);
```

### API Request Optimization
```typescript
// Use request deduplication
const cache = new Map();
async function fetchWithCache(url) {
  if (cache.has(url)) return cache.get(url);

  const promise = fetch(url).then(r => r.json());
  cache.set(url, promise);
  return promise;
}
```

## 5. Load Testing

### Backend Load Test
```bash
# Using autocannon
npx autocannon -c 100 -d 30 http://localhost:3000/api/portfolio

# Using k6
k6 run load-test.js
```

**Targets:**
- Handle 1000 concurrent users
- No errors under load
- Response time increase <50%

### Database Load Test
```bash
# Using pgbench
pgbench -c 10 -j 2 -t 1000 portfel_gpw
```

## 6. Monitoring Setup

### Add Performance Monitoring
```typescript
// Sentry performance tracking
Sentry.startTransaction({
  name: 'portfolio.calculate',
  op: 'function'
});

// Custom metrics
const histogram = new Histogram();
histogram.record(responseTime);
```

**Metrics to Track:**
- API response times (P50, P95, P99)
- Database query times
- Cache hit rate
- Error rate
- Active WebSocket connections
- Memory usage
- CPU usage

## 7. Report Generation

**Generate performance report with:**
1. **Current Metrics:**
   - Bundle sizes
   - API response times
   - Database query times
   - Cache hit rates

2. **Issues Found:**
   - Slow components
   - Missing indexes
   - Unnecessary API calls
   - Bundle bloat

3. **Recommendations:**
   - Prioritized list of optimizations
   - Expected impact
   - Implementation effort

4. **Before/After Comparison:**
   - Show improvements after optimization

**Deliverable:**
- Performance audit report
- List of optimizations implemented
- Benchmarks before/after
- Monitoring dashboard setup
