# 🤖 Zespół Subagentów - Portfel GPW Advisor

## Koncepcja

Mały, ale **wysoce efektywny** zespół 5 wyspecjalizowanych subagentów Claude Code, z których każdy jest ekspertem w swojej dziedzinie. Zamiast jednego generalisty, masz dostęp do zespołu specjalistów, którzy mogą współpracować przy złożonych zadaniach.

## 👥 Skład Zespołu (5 Agentów)

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT ORCHESTRATOR                      │
│                     (Ty + Claude Code)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Frontend   │ │   Backend   │ │   AI/ML     │
│  Specialist │ │  Specialist │ │  Engineer   │
└─────────────┘ └─────────────┘ └─────────────┘
       │               │               │
       └───────────────┼───────────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
┌─────────────┐               ┌─────────────┐
│     QA      │               │   DevOps    │
│  Specialist │               │  Specialist │
└─────────────┘               └─────────────┘
```

---

## 🎯 Agenci

### 1. 📱 Frontend/Mobile Specialist
**Nazwa agenta:** `@frontend-expert`
**Specjalizacja:** React Native, Expo, Next.js, UI/UX

**Użyj gdy:**
- Tworzysz nowy komponent UI
- Implementujesz dashboard, wykresy, formularze
- Rozwiązujesz problemy z cross-platform compatibility
- Optymalizujesz rendering performance
- Potrzebujesz mobile-specific features (notifications, camera, etc.)

**Plik:** `.claude/agents/frontend-specialist.md`

---

### 2. ⚙️ Backend/API Specialist
**Nazwa agenta:** `@backend-expert`
**Specjalizacja:** Node.js, Express, PostgreSQL, REST APIs, WebSockets

**Użyj gdy:**
- Tworzysz nowe API endpoints
- Implementujesz WebSocket real-time features
- Optymalizujesz database queries
- Integrujesz zewnętrzne API (Polygon.io, X, Ortex)
- Rozwiązujesz problemy z wydajnością backendu

**Plik:** `.claude/agents/backend-specialist.md`

---

### 3. 🤖 AI/ML Engineer
**Nazwa agenta:** `@ml-expert`
**Specjalizacja:** PyTorch, LSTM, Portfolio Optimization, Model Deployment

**Użyj gdy:**
- Trenujesz model LSTM dla predykcji cen
- Implementujesz sentiment analysis
- Tworzysz portfolio optimization algorithm
- Wdrażasz model do production (ONNX)
- Debugging ML model performance

**Plik:** `.claude/agents/ml-engineer.md`

---

### 4. ✅ QA/Testing Specialist
**Nazwa agenta:** `@qa-expert`
**Specjalizacja:** Jest, Testing Library, E2E Testing, Test Coverage

**Użyj gdy:**
- Piszesz testy (unit, integration, E2E)
- Zwiększasz test coverage do >80%
- Tworzysz testing strategy
- Debugujesz failing tests
- Automated testing CI/CD

**Plik:** `.claude/agents/qa-specialist.md`

---

### 5. 🚀 DevOps/Performance Specialist
**Nazwa agenta:** `@devops-expert`
**Specjalizacja:** CI/CD, AWS/GCP, Performance, Monitoring, Security

**Użyj gdy:**
- Konfigurujesz CI/CD pipeline
- Deploying do production
- Optymalizujesz wydajność (bundle size, API latency)
- Setupujesz monitoring (Sentry, metrics)
- Security audit i RODO compliance

**Plik:** `.claude/agents/devops-specialist.md`

---

## 🔄 Jak Używać Subagentów

### Pojedynczy Agent
```
Chcę użyć @frontend-expert
Zadanie: Zaimplementuj dashboard z portfolio table i wykresami
```

### Współpraca Agentów (Parallel)
```
Potrzebuję @frontend-expert i @backend-expert

@frontend-expert: Stwórz UI dla portfolio dashboard
@backend-expert: Przygotuj API endpoint GET /api/portfolio
```

### Sekwencyjne Zadania
```
1. @backend-expert: Stwórz API endpoint dla portfolio
2. @frontend-expert: Podłącz UI do tego endpointa
3. @qa-expert: Napisz testy dla całego flow
```

### Kompleksowy Feature (Wszystkie Ręce na Pokład)
```
Feature: Predykcje cen AI

1. @ml-expert: Wytrenuj LSTM model
2. @backend-expert: Stwórz inference API endpoint
3. @frontend-expert: Dodaj prediction UI do dashboardu
4. @qa-expert: Testy dla całego pipeline
5. @devops-expert: Deploy i monitoring
```

---

## 📋 Workflow Examples

### Example 1: Nowa Funkcjonalność (Dashboard)
```bash
# Week 2 - Dashboard Implementation

Step 1: Użyj @frontend-expert
"Zaimplementuj portfolio dashboard z tabelą i wykresami zgodnie z .claude/commands/implement-dashboard.md"

Wynik:
- Komponenty UI (PortfolioTable, StockChart)
- Responsywny layout
- Mock data integration

Step 2: Użyj @qa-expert
"Dodaj testy dla dashboard components z coverage >80%"

Wynik:
- Unit tests dla calculations
- Component tests dla UI
- Integration tests dla data flow
```

### Example 2: API Integration (Polygon.io)
```bash
# Week 7-8 - Real-time Data

Step 1: @backend-expert
"Zaimplementuj WebSocket connection do Polygon.io dla real-time prices"

Step 2: @frontend-expert (parallel z Step 1)
"Przygotuj UI do wyświetlania live prices z WebSocket updates"

Step 3: @devops-expert
"Skonfiguruj monitoring dla WebSocket connections i rate limits"

Step 4: @qa-expert
"Testy: WebSocket reconnection, price update propagation, error handling"
```

### Example 3: ML Pipeline (LSTM)
```bash
# Week 13-16 - AI Predictions

Step 1: @ml-expert
"Wytrenuj LSTM model do predykcji cen na 14 dni, target accuracy >60%"

Step 2: @backend-expert
"Stwórz inference API używając ONNX model, cache predictions"

Step 3: @frontend-expert
"Dodaj predictions display z confidence intervals do stock cards"

Step 4: @qa-expert
"Testy: model accuracy tracking, API response validation, UI display"

Step 5: @devops-expert
"Deploy model, setup monitoring dla prediction accuracy over time"
```

---

## 🎯 Kiedy Użyć Którego Agenta?

### Quick Reference

| Zadanie | Agent(y) | Priority |
|---------|----------|----------|
| Nowy komponent React | @frontend-expert | Solo |
| Nowy API endpoint | @backend-expert | Solo |
| Database migration | @backend-expert | Solo |
| LSTM training | @ml-expert | Solo |
| Sentiment analysis | @ml-expert | Solo |
| Napisać testy | @qa-expert | Solo |
| CI/CD setup | @devops-expert | Solo |
| Performance audit | @devops-expert + @backend-expert | Team |
| Nowy feature (kompleksowy) | Wszyscy 5 | Team |
| Real-time WebSocket | @backend-expert + @frontend-expert | Team |
| ML w production | @ml-expert + @backend-expert + @devops-expert | Team |
| Security audit | @backend-expert + @devops-expert | Team |

---

## 💡 Best Practices

### 1. Pojedyncze Zadania → Pojedynczy Agent
Dla prostych, jasno zdefiniowanych zadań używaj jednego specjalisty.

### 2. Złożone Features → Zespół
Dla kompleksowych funkcjonalności (np. dashboard + API + testy) używaj wielu agentów sekwencyjnie lub równolegle.

### 3. Code Review → Inny Agent
Po implementacji przez jednego agenta, poproś innego o review:
- @frontend-expert zrobił UI → @qa-expert sprawdza testy
- @backend-expert zrobił API → @devops-expert sprawdza security

### 4. Komunikuj Kontekst
Zawsze podaj agentom:
- Aktualny etap projektu (Etap 1/2/3)
- Powiązane pliki (.claude/commands/...)
- Expected deliverables

### 5. Iteruj
Agenci mogą współpracować iteracyjnie:
```
Iteracja 1: @frontend-expert → podstawowy UI
Iteracja 2: @qa-expert → testy ujawniają bug
Iteracja 3: @frontend-expert → fix bug
Iteracja 4: @devops-expert → performance check
```

---

## 🚀 Quick Start z Agentami

### Day 1: Setup
```
@devops-expert: Setup monorepo (Turborepo + apps + packages)
@backend-expert: Initialize database, run migrations
```

### Week 2: Dashboard
```
@frontend-expert: Implement dashboard UI
@qa-expert: Add comprehensive tests
```

### Week 7-8: Real-time Data
```
@backend-expert: Polygon.io WebSocket integration
@frontend-expert: Live price updates in UI
@devops-expert: Monitor WebSocket stability
```

### Week 13-16: AI
```
@ml-expert: Train LSTM model
@backend-expert: Inference API
@frontend-expert: Predictions UI
@qa-expert: E2E testing
@devops-expert: Production deployment
```

---

## 📊 Efektywność Zespołu

### Korzyści z Subagentów

✅ **Specjalizacja** - Każdy agent jest ekspertem w swojej dziedzinie
✅ **Równoległość** - Frontend i Backend mogą pracować jednocześnie
✅ **Jakość** - Wyspecjalizowana wiedza = lepszy kod
✅ **Szybkość** - Mniej kontekstu do przełączania
✅ **Best Practices** - Każdy agent zna patterns swojej dziedziny

### vs. Single Agent Approach

| Aspekt | Single Agent | Zespół Subagentów |
|--------|--------------|-------------------|
| Context switching | Wysokie | Niskie (każdy ma swoją domenę) |
| Specjalizacja | Średnia | Wysoka |
| Równoległość | Brak | Tak (2-3 agentów jednocześnie) |
| Code quality | Dobra | Bardzo dobra (specjaliści) |
| Learning curve | Łatwa | Średnia (trzeba wiedzieć kogo użyć) |

---

## 🎓 Training Materials

Każdy agent ma:
- **Role definition** - dokładna specjalizacja
- **Tech stack** - narzędzia które zna
- **Workflows** - typowe zadania
- **Examples** - przykłady użycia
- **Best practices** - patterns i anti-patterns

Zobacz pliki agentów: `.claude/agents/[agent-name].md`

---

## 🔄 Maintenance

### Dodawanie Nowych Agentów
W miarę rozwoju projektu możesz dodać:
- **Data Analyst** (dla zaawansowanych analytics)
- **Security Specialist** (dedicated security expert)
- **Mobile Native Specialist** (iOS/Android specific)

### Aktualizacja Agentów
Gdy projekt ewoluuje:
- Aktualizuj knowledge base agentów
- Dodaj nowe patterns i best practices
- Rozszerzaj przykłady użycia

---

## 📞 Help

Nie wiesz którego agenta użyć?
1. Sprawdź **Quick Reference** table powyżej
2. Zobacz **Workflow Examples**
3. W razie wątpliwości - zacznij od agenta najbliższego zadaniu

Potrzebujesz kombinacji agentów?
- Zobacz **Example workflows** - pokazują typowe kombinacje

---

**Zespół gotowy do pracy!** 🚀

*5 specjalistów, nieskończone możliwości*
