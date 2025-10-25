# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├──────────────────┬──────────────────┬──────────────────────┤
│   iOS App        │   Android App     │    Web App           │
│   (Expo)         │   (Expo)          │    (Next.js)         │
└────────┬─────────┴─────────┬─────────┴──────────┬───────────┘
         │                   │                    │
         └───────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   packages/ui   │
                    │ packages/logic  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼────────────────────┐
         │                   │                    │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│  REST API       │ │  WebSocket      │ │  Push Notif     │
│  (Express)      │ │  Server         │ │  Service        │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                    │
         └───────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    └─────────────────┘

External Services:
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Polygon.io  │  │   X API     │  │   Ortex     │
└─────────────┘  └─────────────┘  └─────────────┘
```

## Monorepo Structure

```
portfel-gpw-advisor/
├── apps/
│   ├── expo/                 # Mobile app (iOS + Android)
│   │   ├── app/             # Expo Router screens
│   │   ├── src/
│   │   │   ├── components/  # Mobile-specific components
│   │   │   ├── screens/     # Screen components
│   │   │   └── navigation/  # Navigation config
│   │   └── package.json
│   │
│   └── web/                 # Web application
│       ├── pages/           # Next.js pages
│       ├── src/
│       │   └── components/  # Web-specific components
│       └── package.json
│
├── packages/
│   ├── ui/                  # Shared UI components
│   │   ├── src/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── theme/       # Theme configuration
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── logic/               # Business logic & algorithms
│   │   ├── src/
│   │   │   ├── services/    # API integrations
│   │   │   ├── ml/          # ML models (inference)
│   │   │   ├── utils/       # Utilities
│   │   │   ├── storage/     # Data persistence
│   │   │   └── types/       # TypeScript definitions
│   │   └── package.json
│   │
│   ├── typescript-config/   # Shared TS configs
│   └── eslint-config/       # Shared ESLint configs
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── services/        # External API integrations
│   │   ├── jobs/            # Scheduled jobs (cron)
│   │   └── middleware/      # Express middleware
│   └── package.json
│
├── ml-models/               # Python ML training
│   ├── lstm/                # LSTM price prediction
│   │   ├── train.py
│   │   ├── model.py
│   │   └── evaluate.py
│   ├── sentiment/           # Sentiment analysis
│   └── optimization/        # Portfolio optimization
│
└── turbo.json              # Turborepo config
```

## Data Flow

### Portfolio Update Flow
```
User adds position
    ↓
UI Component (packages/ui)
    ↓
Business Logic (packages/logic/storage)
    ↓
AsyncStorage/localStorage
    ↓
Backend API (sync for premium users)
    ↓
PostgreSQL
```

### Real-time Price Update Flow
```
Polygon.io WebSocket
    ↓
Backend WebSocket Server
    ↓
Broadcast to connected clients
    ↓
packages/logic/services/polygon
    ↓
Update global state (Zustand)
    ↓
Re-render affected components
```

### AI Prediction Flow
```
User requests prediction
    ↓
packages/logic/ml/lstm
    ↓
Load ONNX model (cached)
    ↓
Fetch historical data + sentiment
    ↓
Run inference
    ↓
Return prediction + confidence
    ↓
Display in UI
```

## State Management

### Client-side State (Zustand)
```typescript
// packages/logic/src/store/portfolio.ts
interface PortfolioState {
  positions: Position[];
  currentPrices: Record<string, number>;
  sentimentScores: Record<string, SentimentData>;
  predictions: Record<string, Prediction>;

  addPosition: (position: Position) => void;
  updatePrice: (symbol: string, price: number) => void;
  updateSentiment: (symbol: string, sentiment: SentimentData) => void;
}
```

### Server-side State (Database)
- User profiles
- Portfolio history
- Predictions archive
- Notification preferences
- Subscription status

## API Design

### REST Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/portfolio
POST   /api/portfolio/position
DELETE /api/portfolio/position/:symbol
GET    /api/predictions/:symbol
GET    /api/sentiment/:symbol
POST   /api/notifications/preferences
```

### WebSocket Events
```
Client → Server:
- subscribe: { symbols: ['PKN', 'JSW'] }
- unsubscribe: { symbols: ['PKN'] }

Server → Client:
- priceUpdate: { symbol: 'PKN', price: 50.5, timestamp: ... }
- sentimentUpdate: { symbol: 'PKN', score: 0.75, ... }
- alert: { type: 'short_squeeze', symbol: 'JSW', ... }
```

## Security

### Authentication
- JWT tokens (access + refresh)
- 2FA support (premium users)
- Secure token storage (Keychain/Keystore)

### Data Protection
- HTTPS only
- End-to-end encryption for sensitive data
- Database encryption at rest
- RODO compliance

### API Security
- Rate limiting (per user)
- Input validation
- SQL injection prevention (parameterized queries)
- CORS configuration

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (can add more instances)
- Load balancer (AWS ALB / GCP Load Balancer)
- Database connection pooling

### Caching Strategy
- Redis for frequently accessed data:
  - Current prices (TTL: 5 seconds)
  - Sentiment scores (TTL: 2 hours)
  - Predictions (TTL: 24 hours)

### Database Optimization
- Indexed queries (symbol, user_id, timestamp)
- Partitioning by date for historical data
- Regular vacuum and analyze

## Monitoring & Observability

### Metrics to Track
- API response times
- WebSocket connection count
- Prediction accuracy over time
- User engagement (DAU, WAU, MAU)
- Error rates

### Logging
- Structured logging (JSON)
- Log levels: ERROR, WARN, INFO, DEBUG
- Centralized logging (CloudWatch / Stackdriver)

### Alerting
- API downtime
- Database connection issues
- Prediction accuracy drops below 55%
- High error rates
