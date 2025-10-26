# Etap 2, Week 9-10: X (Twitter) Sentiment Analysis for Stocks

**Goal**: Implement sentiment analysis of Polish stock market discussions on X (Twitter) using NLP

**Duration**: 2 weeks

**Assigned Agents**: @backend-expert, @ml-expert, @frontend-expert

---

## Technical Requirements

### Backend (@backend-expert)

1. **X API Integration** (`packages/logic/src/services/twitter.ts`)
   - X API v2 client with authentication
   - Search tweets by stock symbols ($PKN, $KGHM, etc.)
   - Filter Polish language tweets
   - Rate limiting (450 requests/15min for free tier)
   - Tweet streaming for real-time monitoring

2. **Data Models** (`packages/logic/src/types/sentiment.ts`)

   ```typescript
   interface SentimentData {
     symbol: string;
     timestamp: Date;
     score: number; // -1 (negative) to +1 (positive)
     confidence: number; // 0 to 1
     volume: number; // tweet count
     trend: 'bullish' | 'bearish' | 'neutral';
   }

   interface Tweet {
     id: string;
     text: string;
     author: string;
     createdAt: Date;
     metrics: {
       likes: number;
       retweets: number;
       replies: number;
     };
     sentiment?: number;
   }

   interface SentimentHistory {
     symbol: string;
     timeframe: '1H' | '1D' | '1W' | '1M';
     data: SentimentDataPoint[];
   }
   ```

3. **Storage** (`packages/logic/src/storage/sentiment-cache.ts`)
   - Cache sentiment scores (15-minute refresh)
   - Store historical sentiment data
   - Aggregate tweet metrics

### ML Pipeline (@ml-expert)

1. **Sentiment Model** (`packages/logic/src/ml/sentiment-analyzer.ts`)
   - Pre-trained Polish NLP model (HerBERT or Polish RoBERTa)
   - Fine-tuned on financial texts
   - Batch processing for efficiency
   - Confidence scoring

2. **Model Options**

   ```typescript
   // Option 1: Hugging Face transformers.js (client-side)
   import { pipeline } from '@xenova/transformers';

   // Option 2: Remote API (HuggingFace Inference API)
   // Option 3: Local model server (Flask/FastAPI)
   ```

3. **Processing Pipeline**
   - Text preprocessing (remove URLs, mentions, hashtags)
   - Tokenization for Polish language
   - Sentiment classification (-1 to +1)
   - Aggregate scores with weighted average (by engagement)

4. **Training Data** (Optional enhancement)
   - Collect labeled Polish financial tweets
   - Fine-tune model on domain-specific data
   - Regular model retraining

### Frontend (@frontend-expert)

1. **Sentiment Components** (`packages/ui/src/components/`)
   - `SentimentGauge`: Visual gauge showing sentiment score
   - `SentimentTrend`: Chart showing sentiment over time
   - `SentimentBadge`: Compact bullish/bearish indicator
   - `TweetFeed`: Display recent tweets with sentiment

2. **Hooks**

   ```typescript
   // packages/ui/src/hooks/useSentiment.ts
   export function useSentiment(symbol: string) {
     const [sentiment, setSentiment] = useState<SentimentData | null>(null);
     const [history, setHistory] = useState<SentimentHistory | null>(null);
     const [loading, setLoading] = useState(true);

     // Fetch current sentiment
     // Poll for updates (every 15 minutes)
     // Load historical data
   }
   ```

3. **Integration Points**
   - Dashboard: Sentiment overview for portfolio
   - Stock detail page: Detailed sentiment breakdown
   - Portfolio table: Sentiment badge per position
   - Notifications: Alert on significant sentiment shifts

---

## Implementation Tasks

### Week 9: Backend & ML Foundation

**Day 1-2**: X API Integration

- [ ] Create X Developer account and get API keys
- [ ] Implement `packages/logic/src/services/twitter.ts`
- [ ] Add tweet search by hashtag/cashtag ($SYMBOL)
- [ ] Filter for Polish language (`lang:pl`)
- [ ] Implement rate limiting and caching
- [ ] Write API integration tests

**Day 3**: Sentiment Model Setup

- [ ] Research Polish NLP models (HerBERT, Polish RoBERTa)
- [ ] Choose deployment strategy (client-side vs API)
- [ ] Create `packages/logic/src/ml/sentiment-analyzer.ts`
- [ ] Implement text preprocessing
- [ ] Test model with sample tweets

**Day 4-5**: Processing Pipeline

- [ ] Implement batch sentiment analysis
- [ ] Create aggregation logic (weighted by engagement)
- [ ] Add confidence scoring
- [ ] Create sentiment storage/cache
- [ ] Calculate trend indicators (bullish/bearish)
- [ ] Write unit tests for pipeline

### Week 10: Frontend Integration

**Day 1-2**: Core Components

- [ ] Create `SentimentGauge` component (circular gauge)
- [ ] Create `SentimentBadge` component (compact indicator)
- [ ] Create `SentimentTrend` chart component
- [ ] Create `TweetFeed` component
- [ ] Add platform-specific variants (.web.tsx)

**Day 3**: Hooks & State

- [ ] Create `useSentiment` hook
- [ ] Implement polling logic (15-minute interval)
- [ ] Add loading and error states
- [ ] Create sentiment context provider
- [ ] Write hook tests

**Day 4**: Dashboard Integration

- [ ] Add sentiment overview to dashboard
- [ ] Add sentiment badges to portfolio table
- [ ] Create stock detail page with sentiment
- [ ] Add sentiment filter/sort options

**Day 5**: Polish & Testing

- [ ] Add sentiment change notifications
- [ ] Implement sentiment alerts (significant shifts)
- [ ] Cross-platform testing
- [ ] Performance optimization
- [ ] End-to-end testing

---

## Testing Checklist

- [ ] X API integration tests
- [ ] Sentiment model accuracy tests
- [ ] Text preprocessing tests
- [ ] Aggregation logic tests
- [ ] Component rendering tests
- [ ] Hook behavior tests
- [ ] Mobile sentiment display
- [ ] Web sentiment display
- [ ] Real-time updates
- [ ] Error handling (API failures, model errors)

---

## Dependencies to Add

```json
{
  "dependencies": {
    "twitter-api-v2": "^1.15.0",
    "@xenova/transformers": "^2.8.0",
    "natural": "^6.7.0",
    "compromise": "^14.10.0"
  },
  "devDependencies": {
    "@types/natural": "^5.1.5"
  }
}
```

---

## Environment Variables

```env
# .env.local
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# Optional: HuggingFace API (if using remote inference)
HUGGINGFACE_API_KEY=your_hf_token
```

---

## ML Model Options

### Option 1: HerBERT (Recommended)

- Pre-trained Polish BERT model
- Good performance on financial texts
- Can run client-side with transformers.js
- Model: `allegro/herbert-base-cased`

### Option 2: Polish RoBERTa

- Alternative Polish language model
- Similar performance to HerBERT
- Model: `sdadas/polish-roberta-base-v2`

### Option 3: Multilingual Models

- Fallback option: `nlptown/bert-base-multilingual-uncased-sentiment`
- Less accurate for Polish but easier to deploy

### Deployment Strategy

1. **Client-side** (transformers.js): No backend needed, privacy-friendly, slower
2. **Remote API** (HuggingFace): Fast, no local resources, costs money
3. **Local server**: Best performance, requires setup, runs on device

**Recommended**: Start with HuggingFace API, migrate to client-side later

---

## Success Criteria

- ✅ Real-time sentiment scores for all portfolio symbols
- ✅ Historical sentiment trends (1H, 1D, 1W, 1M)
- ✅ Visual sentiment indicators in dashboard
- ✅ Tweet feed showing recent market discussions
- ✅ Sentiment alerts for significant shifts
- ✅ Polish language support with >70% accuracy
- ✅ Cross-platform support (mobile + web)
- ✅ Test coverage >80%

---

## Risks & Mitigations

**Risk 1**: X API free tier limitations (low request limits)

- _Mitigation_: Aggressive caching (15-min refresh), prioritize user's portfolio symbols only

**Risk 2**: Polish NLP model accuracy

- _Mitigation_: Start with pre-trained models, collect training data for fine-tuning, add confidence scores

**Risk 3**: Low tweet volume for smaller GPW stocks

- _Mitigation_: Fallback to broader market sentiment, show "insufficient data" message

**Risk 4**: Sentiment model size (large download for client-side)

- _Mitigation_: Use remote API initially, lazy load models, quantize models for smaller size

**Risk 5**: Cost of HuggingFace API or X API premium tier

- _Mitigation_: Use free tiers initially, implement aggressive caching, migrate to self-hosted if needed

---

## Future Enhancements

- Sentiment-based portfolio recommendations
- Multi-source sentiment (Reddit, StockTwits, news)
- Sentiment correlation with price movements
- User-adjustable sentiment weight in decisions
- Historical sentiment backtesting
