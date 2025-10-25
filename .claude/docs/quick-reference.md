# Quick Reference Guide

## Najważniejsze Komendy

### Rozpoczęcie Projektu
```bash
# Slash command w Claude Code
/setup-monorepo

# Alternatywnie manualnie:
npx create-turbo@latest
```

### Codzienne Użycie
```bash
# Uruchom wszystkie aplikacje
npm run dev

# Uruchom tylko mobile
cd apps/expo && npm run ios

# Uruchom tylko web
cd apps/web && npm run dev

# Uruchom backend
cd backend && npm run dev

# Uruchom testy
npm test

# Sprawdź typy
npm run type-check

# Sprawdź lint
npm run lint

# Formatuj kod
npm run format
```

## Najczęstsze Zadania

### 1. Dodanie Nowej Funkcjonalności
1. Utwórz branch: `git checkout -b feat/feature-name`
2. Użyj odpowiedniego slash command lub template
3. Napisz testy
4. Wyślij PR

### 2. Naprawienie Buga
```bash
/debug-issue
# Następnie opisz problem
```

### 3. Dodanie Nowego Komponentu UI
1. Otwórz `.claude/prompts/component-template.md`
2. Stwórz komponent w `packages/ui/src/components/`
3. Dodaj testy w `__tests__/`
4. Eksportuj z `index.ts`

### 4. Integracja z Nowym API
1. Otwórz `.claude/prompts/api-integration-template.md`
2. Utwórz service w `packages/logic/src/services/`
3. Dodaj environment variables do `.env`
4. Napisz testy

### 5. Trening Nowego Modelu ML
```bash
/lstm-predictions
# Lub manualnie:
cd ml-models/lstm
python train.py
```

## Struktura Plików - Gdzie Co Jest?

```
Chcę dodać...                     → Gdzie to idzie?
─────────────────────────────────────────────────────────────
Komponent UI                      → packages/ui/src/components/
Logikę biznesową                  → packages/logic/src/utils/
Integrację API                    → packages/logic/src/services/
Screen w mobile app               → apps/expo/src/screens/
Page w web app                    → apps/web/src/pages/
Endpoint backendowy               → backend/src/routes/
Model bazy danych                 → backend/src/models/
Model ML (trening)                → ml-models/[model-name]/
TypeScript types                  → packages/logic/src/types/
Testy                            → obok pliku w __tests__/
```

## TypeScript - Szybkie Wzorce

### Props Interface
```typescript
interface ComponentProps {
  title: string;
  onPress: () => void;
  optional?: boolean;
}

export const Component: React.FC<ComponentProps> = (props) => {
  // ...
};
```

### API Response Type
```typescript
interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

async function fetchData(): Promise<ApiResponse<User>> {
  // ...
}
```

### State Hook
```typescript
const [state, setState] = useState<StateType>({
  loading: false,
  data: null,
  error: null,
});
```

## Testowanie - Szybkie Wzorce

### Unit Test
```typescript
describe('calculatePnL', () => {
  it('calculates correctly', () => {
    expect(calculatePnL(position)).toBe(1000);
  });
});
```

### Component Test
```typescript
import { render } from '@testing-library/react';

test('renders component', () => {
  const { getByText } = render(<Component />);
  expect(getByText('Hello')).toBeInTheDocument();
});
```

### API Mock
```typescript
jest.mock('../api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: [] })
}));
```

## Git - Konwencje

### Commit Messages
```
feat(dashboard): add portfolio chart
fix(notifications): correct timezone handling
refactor(portfolio): extract P&L calculation
test(api): add polygon integration tests
docs: update setup instructions
```

### Branch Names
```
feat/feature-name
fix/bug-description
refactor/what-is-refactored
test/what-is-tested
```

## Debugowanie

### React Native
```bash
# Otwórz devtools
# iOS: Cmd+D
# Android: Cmd+M

# Remote debugging
open rndebugger://set-debugger-loc?host=localhost&port=8081
```

### Backend
```typescript
// Dodaj breakpoint
debugger;

// Console log z kontekstem
console.log('[API] Fetching data for:', symbol);
```

### Database
```bash
# Prisma Studio (GUI dla bazy)
npx prisma studio

# Sprawdź schema
npx prisma db pull

# Zresetuj bazę (DEV ONLY!)
npx prisma migrate reset
```

## Environment Variables - Najważniejsze

```env
# Must-have dla development:
DATABASE_URL=postgresql://...
POLYGON_API_KEY=...
JWT_SECRET=...
NODE_ENV=development

# Nice-to-have:
X_BEARER_TOKEN=...
REDIS_URL=...
SENTRY_DSN=...
```

## Performance Tips

### React
```typescript
// Memoize expensive calculations
const value = useMemo(() => expensiveCalc(data), [data]);

// Memoize callbacks
const handlePress = useCallback(() => {
  doSomething();
}, []);

// Memoize components
export default React.memo(Component);
```

### Database
```typescript
// Use indexes
@@index([userId, symbol])

// Limit results
take: 100,
skip: offset,

// Select only needed fields
select: { id: true, name: true }
```

## Common Errors & Solutions

### Error: "Module not found"
```bash
# Clear cache
npm run clean
npm install
```

### Error: "Port already in use"
```bash
# Kill process
lsof -ti:3000 | xargs kill
# Or use different port
PORT=3001 npm run dev
```

### Error: "Type error in TypeScript"
```bash
# Regenerate types
npm run generate:types
# Check tsconfig.json
```

### Error: "Database connection failed"
```bash
# Check PostgreSQL is running
brew services list
# Restart if needed
brew services restart postgresql
```

## Helpful Links

- **Project Spec:** `Specyfikacja Funkcjonalna i Techniczna: .MD`
- **Architecture:** `.claude/docs/architecture.md`
- **Dev Guide:** `.claude/docs/development-guide.md`
- **Tech Stack:** `.claude/docs/tech-stack-details.md`

## Emergency Commands

```bash
# Nuclear option - reset everything
npm run clean
rm -rf node_modules
rm package-lock.json
npm install

# Database reset (DANGEROUS!)
npx prisma migrate reset --force

# Git reset (DANGEROUS!)
git reset --hard HEAD
git clean -fd
```

## Productivity Hacks

1. **Use slash commands** - zamiast pisać od zera, użyj `/implement-dashboard`
2. **Follow templates** - wszystkie w `.claude/prompts/`
3. **Check workflows** - każdy tydzień ma plan w `.claude/workflows/`
4. **Test as you go** - nie czekaj do końca
5. **Commit often** - małe commity łatwiej reviewować
6. **Use TypeScript strict mode** - znajdzie błędy wcześniej
7. **Read error messages** - często mówią co zrobić

---

**Pro Tip:** Trzymaj ten plik otwarty w drugim monitorze podczas developmentu! 🚀
