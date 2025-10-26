# API Integrations Guide

## Complete Reference for External Services

**Last Updated**: 2025-10-26

---

## Table of Contents

1. [Polygon.io - Market Data](#polygonio---market-data)
2. [X (Twitter) API - Sentiment Analysis](#x-twitter-api---sentiment-analysis)
3. [HuggingFace - NLP Models](#huggingface---nlp-models)
4. [Ortex - Short Interest Data](#ortex---short-interest-data)
5. [Alternative Data Sources](#alternative-data-sources)
6. [Environment Variables](#environment-variables)
7. [Error Handling](#error-handling)
8. [Rate Limiting Strategies](#rate-limiting-strategies)

---

## Polygon.io - Market Data

### Overview

Polygon.io provides real-time and historical stock market data via REST API and WebSocket.

### Plans & Pricing

- **Free**: 5 API calls/minute, delayed data
- **Starter** ($99/month): Unlimited calls, real-time data, WebSocket access
- **Developer** ($249/month): More markets, premium endpoints

### Setup

1. **Create Account**

   ```
   https://polygon.io/
   Sign up → Get API Key
   ```

2. **Add to Environment**
   ```env
   POLYGON_API_KEY=your_api_key_here
   POLYGON_REST_URL=https://api.polygon.io
   POLYGON_WS_URL=wss://socket.polygon.io/stocks
   ```

### Endpoints Used

#### 1. Current Price (Snapshot)

```typescript
GET /v2/snapshot/locale/us/markets/stocks/tickers/{symbol}

// Example
const response = await fetch(
  `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers/PKN?apiKey=${API_KEY}`
);

// Response
{
  "ticker": {
    "ticker": "PKN",
    "todaysChange": 2.5,
    "todaysChangePerc": 1.2,
    "day": {
      "o": 208.5,  // open
      "h": 212.0,  // high
      "l": 207.0,  // low
      "c": 211.0,  // close
      "v": 150000, // volume
      "vw": 210.5  // volume weighted
    },
    "lastTrade": {
      "p": 211.0,
      "t": 1698765432000
    }
  }
}
```

#### 2. Historical Data (Aggregates)

```typescript
GET /v2/aggs/ticker/{symbol}/range/{multiplier}/{timespan}/{from}/{to}

// Example: Daily data for PKN for last 30 days
const response = await fetch(
  `https://api.polygon.io/v2/aggs/ticker/PKN/range/1/day/2024-09-01/2024-10-01?apiKey=${API_KEY}`
);

// Response
{
  "results": [
    {
      "v": 150000,     // volume
      "vw": 210.5,     // volume weighted average
      "o": 208.5,      // open
      "c": 211.0,      // close
      "h": 212.0,      // high
      "l": 207.0,      // low
      "t": 1698710400000, // timestamp
      "n": 1234        // number of transactions
    }
    // ...
  ]
}
```

#### 3. Symbol Search

```typescript
GET /v3/reference/tickers?search={query}&active=true

// Example
const response = await fetch(
  `https://api.polygon.io/v3/reference/tickers?search=ORLEN&active=true&apiKey=${API_KEY}`
);
```

### WebSocket - Real-time Updates

```typescript
import WebSocket from 'ws';

const ws = new WebSocket('wss://socket.polygon.io/stocks');

// Authenticate
ws.on('open', () => {
  ws.send(JSON.stringify({ action: 'auth', params: API_KEY }));
});

// Subscribe to symbols
ws.on('message', (data) => {
  const message = JSON.parse(data.toString());

  if (message[0].ev === 'status' && message[0].status === 'auth_success') {
    // Subscribe to trades for PKN and KGHM
    ws.send(
      JSON.stringify({
        action: 'subscribe',
        params: 'T.PKN,T.KGHM',
      })
    );
  }

  // Handle trade updates
  if (message[0].ev === 'T') {
    const trade = message[0];
    console.log(`${trade.sym}: ${trade.p} @ ${new Date(trade.t)}`);
  }
});
```

### Rate Limiting

```typescript
class PolygonClient {
  private requestQueue: Array<() => Promise<any>> = [];
  private requestsPerSecond = 5; // Free tier
  private lastRequestTime = 0;

  async request(url: string): Promise<any> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / this.requestsPerSecond;

    if (timeSinceLastRequest < minInterval) {
      await new Promise((resolve) => setTimeout(resolve, minInterval - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
    return fetch(url);
  }
}
```

### GPW Symbol Mapping

**Issue**: Polygon.io uses US tickers, GPW uses Polish tickers.

**Solution**: Maintain mapping table

```typescript
const GPW_TO_POLYGON: Record<string, string> = {
  PKN: 'PKNORLEN', // PKN Orlen
  KGHM: 'KGHM', // KGHM
  PZU: 'PZU', // PZU
  CDR: 'CDRED', // CD Projekt
  // ... add more
};
```

**Alternative**: Use Stooq.pl for GPW data

```
https://stooq.pl/q/l/?s=pkn&f=sd2t2ohlcv&h&e=csv
```

---

## X (Twitter) API - Sentiment Analysis

### Overview

X API v2 provides access to tweets, user data, and real-time streaming.

### Plans & Pricing

- **Free**: 1,500 tweets/month (very limited)
- **Basic** ($100/month): 10,000 tweets/month, 3 app environments
- **Pro** ($5,000/month): 1M tweets/month, full archive search

### Setup

1. **Create Developer Account**

   ```
   https://developer.twitter.com/
   Sign up → Create Project → Get Keys
   ```

2. **Add to Environment**
   ```env
   TWITTER_API_KEY=your_api_key
   TWITTER_API_SECRET=your_api_secret
   TWITTER_BEARER_TOKEN=your_bearer_token
   ```

### Endpoints Used

#### 1. Search Recent Tweets

```typescript
GET /2/tweets/search/recent

// Example: Search for tweets about PKN Orlen
const headers = {
  'Authorization': `Bearer ${BEARER_TOKEN}`
};

const params = new URLSearchParams({
  'query': '(PKN OR "PKN Orlen" OR $PKN) lang:pl',
  'max_results': '100',
  'tweet.fields': 'created_at,public_metrics,text',
  'start_time': '2024-10-01T00:00:00Z'
});

const response = await fetch(
  `https://api.twitter.com/2/tweets/search/recent?${params}`,
  { headers }
);

// Response
{
  "data": [
    {
      "id": "1234567890",
      "text": "PKN Orlen pokazuje świetne wyniki! 🚀",
      "created_at": "2024-10-26T10:30:00.000Z",
      "public_metrics": {
        "like_count": 15,
        "retweet_count": 5,
        "reply_count": 2
      }
    }
    // ...
  ],
  "meta": {
    "result_count": 100
  }
}
```

#### 2. Search Query Syntax

```typescript
// Basic search
query: 'PKN Orlen';

// Cashtag (stock symbol)
query: '$PKN';

// Multiple symbols
query: '($PKN OR $KGHM OR $PZU)';

// Polish language only
query: 'PKN lang:pl';

// Exclude retweets
query: 'PKN -is:retweet';

// High engagement only
query: 'PKN min_faves:10';

// Combine all
query: '($PKN OR $KGHM) lang:pl -is:retweet min_faves:5';
```

### Rate Limiting

```typescript
// Free tier: 15 requests per 15 minutes
// Basic tier: 450 requests per 15 minutes

class TwitterClient {
  private requestsRemaining = 15;
  private resetTime = Date.now() + 15 * 60 * 1000;

  async checkRateLimit() {
    if (this.requestsRemaining <= 0) {
      const waitTime = this.resetTime - Date.now();
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
      this.requestsRemaining = 15;
      this.resetTime = Date.now() + 15 * 60 * 1000;
    }
  }

  async request(url: string, options: RequestInit) {
    await this.checkRateLimit();
    const response = await fetch(url, options);

    // Update from headers
    this.requestsRemaining = parseInt(response.headers.get('x-rate-limit-remaining') || '15');
    this.resetTime = parseInt(response.headers.get('x-rate-limit-reset') || '0') * 1000;

    return response;
  }
}
```

### Batch Processing

```typescript
async function searchTweetsForPortfolio(symbols: string[]) {
  const results: Record<string, any[]> = {};

  // Batch symbols to minimize API calls
  const batchSize = 5;
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const query = `(${batch.map((s) => `$${s}`).join(' OR ')}) lang:pl`;

    const tweets = await searchTweets(query);

    // Distribute tweets to symbols
    tweets.forEach((tweet) => {
      batch.forEach((symbol) => {
        if (tweet.text.includes(symbol) || tweet.text.includes(`$${symbol}`)) {
          results[symbol] = results[symbol] || [];
          results[symbol].push(tweet);
        }
      });
    });
  }

  return results;
}
```

---

## HuggingFace - NLP Models

### Overview

HuggingFace provides pre-trained NLP models for sentiment analysis.

### Plans & Pricing

- **Free**: 30,000 characters/month (Inference API)
- **Pro** ($9/month): 1M characters/month
- **Enterprise**: Custom pricing

### Setup

1. **Create Account**

   ```
   https://huggingface.co/
   Sign up → Settings → Access Tokens
   ```

2. **Add to Environment**
   ```env
   HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
   ```

### Recommended Polish Models

1. **HerBERT** (Recommended)

   ```
   Model: allegro/herbert-base-cased
   Language: Polish
   Task: Fill-Mask (can fine-tune for sentiment)
   Size: 110M parameters
   ```

2. **Polish RoBERTa**

   ```
   Model: sdadas/polish-roberta-base-v2
   Language: Polish
   Task: Text classification
   Size: 125M parameters
   ```

3. **Multilingual Sentiment**
   ```
   Model: nlptown/bert-base-multilingual-uncased-sentiment
   Languages: Multiple (including Polish)
   Task: Sentiment (1-5 stars)
   Size: 178M parameters
   ```

### Usage Options

#### Option 1: HuggingFace Inference API (Easiest)

```typescript
async function analyzeSentiment(text: string): Promise<number> {
  const response = await fetch(
    'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment',
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ inputs: text }),
    }
  );

  const result = await response.json();
  // Returns: [{ label: '5 stars', score: 0.85 }, ...]

  // Convert to -1 to +1 scale
  const sentiment = convertStarsToSentiment(result);
  return sentiment;
}

function convertStarsToSentiment(result: any[]): number {
  const bestPrediction = result[0].sort((a, b) => b.score - a.score)[0];
  const stars = parseInt(bestPrediction.label.split(' ')[0]);

  // Map 1-5 stars to -1 to +1
  return (stars - 3) / 2; // 1→-1, 3→0, 5→+1
}
```

#### Option 2: Transformers.js (Client-side, Free)

```typescript
import { pipeline } from '@xenova/transformers';

// Load model once (caches automatically)
const classifier = await pipeline(
  'sentiment-analysis',
  'nlptown/bert-base-multilingual-uncased-sentiment'
);

async function analyzeSentiment(text: string): Promise<number> {
  const result = await classifier(text);
  // Same processing as above
  return convertStarsToSentiment(result);
}
```

#### Option 3: Self-hosted (Best for Production)

```python
# Python backend (Flask/FastAPI)
from transformers import pipeline

# Load model
classifier = pipeline(
  "sentiment-analysis",
  model="allegro/herbert-base-cased"
)

@app.post("/analyze")
def analyze(text: str):
    result = classifier(text)
    return {"sentiment": convert_to_scale(result)}
```

### Batch Processing

```typescript
async function analyzeBatch(texts: string[]): Promise<number[]> {
  // HuggingFace supports batching
  const response = await fetch(
    'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment',
    {
      headers: {
        Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ inputs: texts }),
    }
  );

  const results = await response.json();
  return results.map((r) => convertStarsToSentiment(r));
}
```

---

## Ortex - Short Interest Data

### Overview

Ortex provides real-time short interest data and short squeeze signals.

### Plans & Pricing

- **Retail** ($49/month): Basic short interest data
- **Professional** ($199/month): Real-time data, alerts
- **Enterprise**: Custom pricing

### Alternative: GPW Official Reports

- **Free**: Published by GPW periodically
- **Source**: https://www.gpw.pl/
- **Format**: PDF/Excel reports
- **Frequency**: Weekly/monthly
- **Delay**: 2-4 weeks

### Setup (Ortex)

1. **Create Account**

   ```
   https://www.ortex.com/
   Sign up → Subscription
   ```

2. **API Documentation**
   ```
   Ortex API is not publicly documented.
   Contact support for API access.
   ```

### Alternative Implementation

**Use GPW Web Scraping** (until Ortex API available)

```typescript
// Parse GPW short interest reports
async function fetchGPWShortInterest(symbol: string) {
  // GPW publishes reports here:
  // https://www.gpw.pl/wykaz-krotkich-pozycji-netto

  const response = await fetch('https://www.gpw.pl/wykaz-krotkich-pozycji-netto');

  const html = await response.text();

  // Parse HTML table (using cheerio or similar)
  const shortInterest = parseShortInterestTable(html, symbol);

  return shortInterest;
}

interface ShortInterestData {
  symbol: string;
  date: Date;
  shortPositions: number; // % of shares
  threshold: number; // reporting threshold (0.5%)
}
```

---

## Alternative Data Sources

### Stooq.pl (Free Polish Market Data)

```typescript
// Real-time data (15-minute delay)
const url = 'https://stooq.pl/q/l/?s=pkn&f=sd2t2ohlcv&h&e=csv';
const response = await fetch(url);
const csv = await response.text();

// Parse CSV
// Symbol,Date,Time,Open,High,Low,Close,Volume
// PKN,20241026,16:45:00,210.0,212.0,209.5,211.5,150000
```

### GPW API (Official, Free)

```
https://www.gpw.pl/en/gpw-api
Limited data, requires registration
```

### FinancialModelingPrep (Backup)

```typescript
// Alternative to Polygon.io
GET https://financialmodelingprep.com/api/v3/quote/{symbol}?apikey={API_KEY}

// Has some Polish stocks
// Free tier: 250 requests/day
```

---

## Environment Variables

### Complete .env.local Template

```env
# Market Data
POLYGON_API_KEY=your_polygon_api_key
POLYGON_REST_URL=https://api.polygon.io
POLYGON_WS_URL=wss://socket.polygon.io/stocks

# Sentiment Analysis
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# NLP Models
HUGGINGFACE_API_KEY=hf_your_huggingface_token

# Short Interest (optional)
ORTEX_API_KEY=your_ortex_key

# Email Reports (optional)
RESEND_API_KEY=re_your_resend_key
SENDGRID_API_KEY=SG.your_sendgrid_key

# Analytics
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
POSTHOG_API_KEY=phc_xxxxx

# Feature Flags
ENABLE_REALTIME_DATA=true
ENABLE_SENTIMENT_ANALYSIS=true
ENABLE_PREDICTIONS=false
ENABLE_OPTIMIZATION=false
```

---

## Error Handling

### Generic API Error Handler

```typescript
class APIError extends Error {
  constructor(
    public service: string,
    public statusCode: number,
    public message: string
  ) {
    super(`${service} API Error (${statusCode}): ${message}`);
  }
}

async function handleAPIRequest<T>(
  serviceName: string,
  request: () => Promise<Response>
): Promise<T> {
  try {
    const response = await request();

    if (!response.ok) {
      let errorMessage = response.statusText;

      // Try to parse error body
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.error || errorBody.message || errorMessage;
      } catch {}

      throw new APIError(serviceName, response.status, errorMessage);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Network error or other
    throw new APIError(serviceName, 0, error.message);
  }
}

// Usage
try {
  const data = await handleAPIRequest('Polygon.io', () => fetch(`${POLYGON_API_URL}/...`));
} catch (error) {
  if (error instanceof APIError) {
    if (error.statusCode === 429) {
      // Rate limited - wait and retry
    } else if (error.statusCode === 401) {
      // Invalid API key
    } else {
      // Other error
    }
  }
}
```

---

## Rate Limiting Strategies

### 1. Token Bucket Algorithm

```typescript
class RateLimiter {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private maxTokens: number,
    private refillRate: number // tokens per second
  ) {
    this.tokens = maxTokens;
    this.lastRefill = Date.now();
  }

  async waitForToken(): Promise<void> {
    this.refill();

    if (this.tokens < 1) {
      const waitTime = ((1 - this.tokens) / this.refillRate) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      this.refill();
    }

    this.tokens -= 1;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}

// Usage
const limiter = new RateLimiter(5, 5); // 5 requests per second

async function fetchWithRateLimit(url: string) {
  await limiter.waitForToken();
  return fetch(url);
}
```

### 2. Request Queue

```typescript
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      await request();

      // Wait between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    this.processing = false;
  }
}
```

### 3. Caching Layer

```typescript
class CachedAPI {
  private cache = new Map<string, { data: any; expires: number }>();

  async get(key: string, ttl: number, fetcher: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key);

    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      expires: Date.now() + ttl,
    });

    return data;
  }
}

// Usage
const cache = new CachedAPI();

async function getCurrentPrice(symbol: string) {
  return cache.get(
    `price:${symbol}`,
    5 * 60 * 1000, // 5 minutes
    () => fetchPriceFromAPI(symbol)
  );
}
```

---

## Best Practices

1. **Always use environment variables** for API keys
2. **Implement exponential backoff** for retries
3. **Cache aggressively** to minimize API calls
4. **Monitor rate limits** from response headers
5. **Handle errors gracefully** with user-friendly messages
6. **Log all API errors** for debugging
7. **Test with mocks** to avoid hitting real APIs during development
8. **Rotate API keys** regularly for security
9. **Use webhooks** where available instead of polling
10. **Implement circuit breakers** for failing services

---

**Document Version**: 1.0
**Last Updated**: 2025-10-26
