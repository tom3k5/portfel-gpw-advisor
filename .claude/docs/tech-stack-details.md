# Technology Stack - Detailed Reference

## Frontend/Mobile

### React Native (Expo)
**Wersja:** 49+
**Dlaczego:** Cross-platform (iOS + Android) z jedną bazą kodu

**Kluczowe pakiety:**
- `expo` - Framework do React Native
- `expo-router` - File-based routing
- `react-native-paper` - Material Design components
- `victory-native` - Wykresy
- `expo-notifications` - Push notifications
- `expo-document-picker` - Wybór plików (CSV)
- `@react-native-async-storage/async-storage` - Local storage

**Dokumentacja:** https://docs.expo.dev/

### Next.js (Web)
**Wersja:** 14+
**Dlaczego:** SSR, SEO, routing, API routes

**Kluczowe pakiety:**
- `next` - Framework
- `react-native-web` - Reużycie komponentów RN
- `victory` - Wykresy (web version)

**Dokumentacja:** https://nextjs.org/docs

### UI Libraries
- **React Native Paper** - Material Design components
- **Victory** - Data visualization (charts)
- **React Hook Form** - Forms management
- **Zod** - Schema validation

## Backend

### Node.js + Express
**Wersja:** Node 18+ LTS
**Dlaczego:** JavaScript na frontendzie i backendzie, duży ekosystem

**Kluczowe pakiety:**
- `express` - Web framework
- `ws` - WebSocket server
- `prisma` - ORM (Database)
- `joi` - Validation
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `node-cron` - Scheduled jobs
- `axios` - HTTP client
- `ioredis` - Redis client

### Database
**PostgreSQL 14+**
**Dlaczego:** Relacyjna, ACID, doskonała dla financial data

**Schema highlights:**
- Users & Authentication
- Portfolio positions
- Price history (time-series optimized)
- Sentiment data
- Predictions archive
- Notifications queue

**ORM:** Prisma
```typescript
// Example model
model Position {
  id           Int      @id @default(autoincrement())
  userId       Int
  symbol       String   @db.VarChar(10)
  quantity     Int
  purchasePrice Decimal @db.Decimal(10, 2)
  createdAt    DateTime @default(now())
  user         User     @relation(fields: [userId], references: [id])
  @@index([userId, symbol])
}
```

### Caching
**Redis**
**Dlaczego:** In-memory cache dla high-frequency data

**Use cases:**
- Current prices (TTL: 5s)
- Sentiment scores (TTL: 2h)
- Predictions (TTL: 24h)
- Rate limiting
- Session storage

## Machine Learning

### Training (Python)
**Python 3.10+**

**Kluczowe biblioteki:**
- `torch` / `pytorch` - Deep learning framework
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `scikit-learn` - Classical ML, preprocessing
- `matplotlib` / `seaborn` - Visualization
- `onnx` - Model export

**Environment:**
```bash
# requirements.txt
torch>=2.0.0
pandas>=2.0.0
numpy>=1.24.0
scikit-learn>=1.3.0
onnx>=1.14.0
```

### Inference (TypeScript)
**ONNX Runtime Web** / **Torch.js**
**Dlaczego:** Run trained models in browser/Node.js

```typescript
import * as ort from 'onnxruntime-web';

const session = await ort.InferenceSession.create('model.onnx');
const results = await session.run(inputs);
```

## External APIs

### Polygon.io
**Purpose:** Real-time & historical GPW stock data

**Endpoints used:**
- WebSocket: Live price updates
- REST: Historical OHLCV data
- REST: Latest trades

**Pricing:**
- Free tier: 5 requests/minute
- Starter: $99/mo - recommended for production

**Dokumentacja:** https://polygon.io/docs

### X API (Twitter)
**Purpose:** Sentiment analysis

**Endpoints used:**
- `GET /2/tweets/search/recent` - Search tweets
- `GET /2/tweets` - Get specific tweets

**Authentication:** Bearer Token

**Pricing:**
- Free tier: 500 tweets/month (NOT enough!)
- Basic: $100/mo - 10,000 tweets/month (minimum recommended)

**Dokumentacja:** https://developer.twitter.com/en/docs

### Ortex (Optional)
**Purpose:** Short interest data

**Use case:** Detect potential short squeezes

**Pricing:** Custom enterprise pricing

## DevOps & Infrastructure

### Hosting (Recommended: AWS)
- **EC2** - Backend API servers
- **RDS** - PostgreSQL database
- **ElastiCache** - Redis
- **S3** - Model storage, backups
- **CloudFront** - CDN for web app
- **ECS** / **Fargate** - Container orchestration

**Alternative:** Google Cloud Platform
- **Cloud Run** - Backend
- **Cloud SQL** - PostgreSQL
- **Memorystore** - Redis
- **Cloud Storage** - Files

### CI/CD
**GitHub Actions**

**Pipeline:**
1. Lint & Type check
2. Run tests
3. Build packages
4. Deploy to staging
5. E2E tests
6. Deploy to production

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run lint
      - run: npm test
      - run: npm run build
```

### Monitoring
- **Sentry** - Error tracking
- **DataDog** / **New Relic** - APM
- **LogRocket** - Session replay (web)
- **Mixpanel** / **Amplitude** - Analytics

## Development Tools

### Monorepo
**Turborepo**
**Dlaczego:** Fast builds, smart caching, parallel execution

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### TypeScript
**Version:** 5.0+
**Config:** Strict mode enabled

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Testing
- **Jest** - Unit tests
- **React Testing Library** - Component tests
- **Supertest** - API tests
- **Playwright** - E2E tests (web)
- **Detox** - E2E tests (mobile) - optional

### Code Quality
- **ESLint** - Linting
- **Prettier** - Formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

## Security

### Authentication
- **JWT** - Access tokens (15 min expiry)
- **Refresh tokens** - Stored in httpOnly cookies
- **2FA** - Time-based OTP (optional for premium)

### Encryption
- **HTTPS** everywhere (TLS 1.3)
- **bcrypt** - Password hashing (cost factor: 12)
- **AES-256** - Data encryption at rest

### Compliance
- **RODO/GDPR** - User data protection
- **Data retention** policies
- **Right to be forgotten**

## Mobile App Specifics

### iOS
- **Minimum version:** iOS 13+
- **Code signing:** Apple Developer Account required
- **Push notifications:** APNs (Apple Push Notification service)

### Android
- **Minimum SDK:** 21 (Android 5.0)
- **Target SDK:** 33+
- **Push notifications:** Firebase Cloud Messaging

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | <200ms | 95th percentile |
| WebSocket Latency | <500ms | Average |
| App Startup Time | <2s | Time to interactive |
| Bundle Size (Web) | <500KB | gzipped |
| Bundle Size (Mobile) | <30MB | OTA update |
| Test Coverage | >80% | All packages |
| Uptime | 99.9% | Monthly |

## Cost Estimation (Monthly)

### MVP Phase
- AWS hosting: ~$200
- Polygon.io API: $99
- X API: $100
- Domain & SSL: $15
- Monitoring tools: $50
- **Total: ~$464/month**

### Production (10K users)
- AWS hosting: ~$800
- Polygon.io API: $199 (higher tier)
- X API: $100
- Database: $150
- Redis: $50
- CDN: $50
- Monitoring: $100
- **Total: ~$1,449/month**

## Recommended Learning Resources

- **React Native:** https://reactnative.dev/docs/getting-started
- **Next.js:** https://nextjs.org/learn
- **TypeScript:** https://www.typescriptlang.org/docs/
- **PyTorch:** https://pytorch.org/tutorials/
- **Turborepo:** https://turbo.build/repo/docs
- **Financial ML:** "Advances in Financial Machine Learning" by Marcos López de Prado
