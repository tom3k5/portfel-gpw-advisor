---
description: Implement X (Twitter) sentiment analysis for stocks
---

You are implementing sentiment analysis from X (Etap 2, Week 3-4).

**Context**: Analyze social media sentiment around stocks in user's portfolio to enhance recommendations.

**Requirements**:
- Fetch recent tweets mentioning stock symbols
- NLP sentiment analysis (positive/neutral/negative)
- Display sentiment score in reports
- Update sentiment twice daily

**Your task**:
1. Create X API service in `packages/logic/src/services/twitter.ts`:
   - `searchTweets(symbol, count)` - fetch tweets mentioning stock
   - `getRateLimitStatus()` - check API limits
   - Handle authentication (Bearer Token)

2. Implement NLP sentiment analyzer in `packages/logic/src/ml/sentiment.ts`:
   - Use `sentiment` npm package or similar
   - Polish language support (important for GPW!)
   - Return sentiment score: -1 (negative) to +1 (positive)
   - Aggregate multiple tweets into overall sentiment

3. Create sentiment data model:
   ```typescript
   type SentimentData = {
     symbol: string;
     score: number; // -1 to +1
     confidence: number; // 0 to 1
     tweetCount: number;
     updatedAt: Date;
     trending: 'up' | 'down' | 'neutral';
   }
   ```

4. Add sentiment display to dashboard:
   - Sentiment badge next to each stock (color-coded)
   - Sentiment trend indicator
   - Click to see sample tweets

5. Integrate sentiment into recommendations:
   - High positive sentiment + price increase = strong buy signal
   - High negative sentiment + price decrease = potential sell
   - Divergence (price up, sentiment down) = warning

6. Create sentiment caching:
   - Store in database to avoid API limits
   - Update every 2 hours during market hours
   - Use stale data if API unavailable

7. Handle edge cases:
   - Low tweet volume (less than 10 tweets)
   - Ambiguous symbols (e.g., "PKN" vs "PKN Orlen")
   - Non-Polish tweets
   - Bots and spam detection

**Environment variables**:
```
X_BEARER_TOKEN=your_token_here
X_API_VERSION=2
```

**Search query template**:
```
($PKN OR "PKN Orlen" OR #PKN) lang:pl -is:retweet
```

**Expected deliverable**: Dashboard showing sentiment scores for each portfolio position with visual indicators
