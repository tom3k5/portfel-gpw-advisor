# 📑 Portfel GPW Advisor - Kompletny Index Środowiska Claude Code

## 🎯 Start Here

Jeśli po raz pierwszy korzystasz z tego środowiska:
1. Przeczytaj **README.md** (przegląd całego środowiska)
2. Zapoznaj się z **project-context.md** (kontekst projektu)
3. Zobacz **docs/quick-reference.md** (szybkie wzorce)
4. Wybierz odpowiedni slash command i zacznij kodować!

---

## 📂 Struktura Katalogów

```
.claude/
├── commands/          # 15 slash commands dla kluczowych zadań
├── prompts/           # 5 szablonów dla powtarzalnych zadań
├── workflows/         # 4 przepływy pracy dla etapów MVP
├── docs/              # 5 dokumentów technicznych
├── agents/            # 5 wyspecjalizowanych subagentów ⭐ NEW!
├── project-context.md # Szybki kontekst projektu
├── README.md          # Główny przewodnik
└── INDEX.md           # Ten plik
```

---

## 🚀 Slash Commands (14)

### Setup & Infrastructure
| Komenda | Opis | Kiedy Użyć |
|---------|------|------------|
| `/setup-monorepo` | Inicjalizacja Turborepo | Rozpoczęcie projektu |

### Etap 1: Core & Usability
| Komenda | Opis | Etap | Tydzień |
|---------|------|------|---------|
| `/implement-dashboard` | Dashboard z tabelą i wykresami | Etap 1 | 2 |
| `/csv-import` | Import portfela CSV | Etap 1 | 3 |
| `/push-notifications` | System notyfikacji | Etap 1 | 4 |

### Etap 2: Data & Analysis
| Komenda | Opis | Etap | Tydzień |
|---------|------|------|---------|
| `/polygon-integration` | Real-time dane GPW | Etap 2 | 1-2 |
| `/sentiment-analysis` | Analiza sentymentu X | Etap 2 | 3-4 |

### Etap 3: Intelligence & Optimization
| Komenda | Opis | Etap | Tydzień |
|---------|------|------|---------|
| `/lstm-predictions` | Model LSTM predykcji | Etap 3 | 1-4 |
| `/portfolio-optimization` | Optymalizacja portfela | Etap 3 | 5-6 |

### Development Utilities
| Komenda | Opis | Kiedy Użyć |
|---------|------|------------|
| `/review-etap1` | Przegląd ukończenia etapu | Koniec Etapu 1 |
| `/debug-issue` | Systematyczne debugowanie | Gdy coś nie działa |
| `/add-tests` | Dodanie testów | Pokrycie <80% |
| `/new-component` | Nowy komponent UI | Tworzenie komponentów |
| `/api-endpoint` | Nowy endpoint REST | Rozbudowa API |
| `/database-migration` | Migracja bazy danych | Zmiana schema |
| `/performance-audit` | Audyt wydajności | Optymalizacja |

**Lokalizacja:** `.claude/commands/`

---

## 📋 Prompt Templates (5)

| Template | Plik | Zastosowanie |
|----------|------|--------------|
| **Component Template** | `prompts/component-template.md` | Tworzenie komponentów React |
| **API Integration** | `prompts/api-integration-template.md` | Integracje zewnętrzne (Polygon, X, Ortex) |
| **ML Model Template** | `prompts/ml-model-template.md` | Rozwój modeli ML (LSTM, optimization) |
| **Commit Messages** | `prompts/commit-message-template.md` | Konwencje commitów Git |
| **Pull Request** | `prompts/pr-template.md` | Szablon PR |

**Lokalizacja:** `.claude/prompts/`

---

## 🗓️ Workflows (4)

| Workflow | Plik | Okres | Główne Zadania |
|----------|------|-------|----------------|
| **Etap 1 - Week 1** | `workflows/etap1-week1.md` | Tydzień 1 | Setup & Architecture |
| **Etap 1 - Week 2** | `workflows/etap1-week2.md` | Tydzień 2 | Dashboard UI |
| **Etap 2 Summary** | `workflows/etap2-summary.md` | Tydzień 7-12 | Real-time & Sentiment |
| **Etap 3 Summary** | `workflows/etap3-summary.md` | Tydzień 13-20 | AI & Optimization |

**Lokalizacja:** `.claude/workflows/`

---

## 📚 Dokumentacja (5)

| Dokument | Plik | Zawartość |
|----------|------|-----------|
| **Project Context** | `project-context.md` | Przegląd projektu, stack, fazy |
| **Architecture** | `docs/architecture.md` | Architektura systemu, data flow |
| **Development Guide** | `docs/development-guide.md` | Setup, workflow, coding standards |
| **Tech Stack Details** | `docs/tech-stack-details.md` | Szczegóły technologii, koszty |
| **Quick Reference** | `docs/quick-reference.md` | Szybkie wzorce, cheat sheet |

---

## 🎯 Szybki Dostęp - Najczęściej Używane

### Rozpoczynam nowy feature
1. Sprawdź workflow dla aktualnego tygodnia
2. Użyj odpowiedniego slash command
3. Zobacz template w `prompts/` jeśli potrzebny
4. Testuj używając wzorców z `docs/quick-reference.md`

### Debuguję problem
```
/debug-issue
```

### Tworzę nowy komponent
```
/new-component
# Następnie podaj nazwę i wymagania
```

### Dodaję endpoint API
```
/api-endpoint
# Następnie podaj specyfikację
```

### Potrzebuję szybkiej odpowiedzi
Sprawdź: `docs/quick-reference.md`

---

## 📊 Statystyki Środowiska

- **Slash Commands:** 14
- **Prompt Templates:** 5
- **Workflows:** 4
- **Dokumenty:** 5
- **Łączna liczba plików MD:** 30
- **Pokrycie faz MVP:** 100% (wszystkie 3 etapy)

---

## 🔧 Konfiguracja

### Environment Variables
Szablon: `.env.example` (w głównym katalogu projektu)

### Polecane narzędzia
- **IDE:** VS Code / Cursor
- **Terminal:** iTerm2 z oh-my-zsh
- **Git GUI:** GitKraken / Sourcetree (optional)
- **Database:** TablePlus / Postico
- **API Testing:** Postman / Insomnia
- **Mobile:** Xcode + Android Studio

---

## 🎓 Learning Path

### Jesteś nowy w projekcie?
1. Week 1: Setup & podstawy (Etap 1, Week 1)
2. Week 2: UI Development (Etap 1, Week 2)
3. Weeks 3-6: Core features (Etap 1)
4. Weeks 7-12: Data & Analysis (Etap 2)
5. Weeks 13-20: AI Features (Etap 3)

### Chcesz rozwijać konkretny obszar?
- **Frontend:** `commands/implement-dashboard.md`, `prompts/component-template.md`
- **Backend:** `commands/api-endpoint.md`, `commands/database-migration.md`
- **ML/AI:** `commands/lstm-predictions.md`, `prompts/ml-model-template.md`
- **DevOps:** `docs/architecture.md`, `commands/performance-audit.md`

---

## 🆘 Pomoc

### Mam problem z...
- **Setup:** Zobacz `docs/development-guide.md` + `/setup-monorepo`
- **Kodem:** Zobacz `docs/quick-reference.md` + `/debug-issue`
- **Wydajnością:** `/performance-audit`
- **Testami:** `/add-tests`
- **Architekturą:** `docs/architecture.md`

### Błędy kompilacji
```bash
# Zobacz docs/quick-reference.md sekcja "Common Errors"
```

### Nie wiem od czego zacząć
1. Sprawdź aktualny etap w `project-context.md`
2. Otwórz odpowiedni workflow
3. Wykonuj zadania po kolei
4. Używaj slash commands

---

## 🎉 Quick Wins

Jeśli masz tylko 5 minut:
1. ✅ Przeczytaj **README.md**
2. ✅ Przejrzyj **project-context.md**
3. ✅ Zapoznaj się ze strukturą w **INDEX.md** (ten plik)

Jeśli masz 30 minut:
1. ✅ Wszystko z powyżej
2. ✅ Przeczytaj **docs/quick-reference.md**
3. ✅ Przetestuj jeden slash command (np. `/setup-monorepo --help`)

Jeśli masz 2 godziny:
1. ✅ Wszystko z powyżej
2. ✅ Przeczytaj **docs/architecture.md**
3. ✅ Wykonaj Week 1 workflow

---

## 📈 Następne Kroki

### Gotowy do startu?
```bash
# 1. Przejrzyj specyfikację
cat "Specyfikacja Funkcjonalna i Techniczna: .MD"

# 2. Rozpocznij setup
/setup-monorepo

# 3. Śledź postęp
# Otwórz .claude/workflows/etap1-week1.md
```

### Masz pytania?
- Sprawdź FAQ w `docs/development-guide.md`
- Zobacz examples w `docs/quick-reference.md`
- Użyj `/debug-issue` dla konkretnych problemów

---

## 🏆 Cel Końcowy

**MVP (20 tygodni):**
- ✅ Etap 1: Core & Usability (6 tyg.)
- ✅ Etap 2: Data & Analysis (6 tyg.)
- ✅ Etap 3: Intelligence & Optimization (8 tyg.)

**Post-MVP:**
- Premium features
- Broker integrations
- Advanced AI models
- 10,000+ users

---

**Powodzenia w budowaniu najlepszej aplikacji inwestycyjnej dla GPW!** 🚀📈

*Środowisko przygotowane dla Claude Code by Anthropic*
*Wersja: 1.0*
*Data: 25 października 2025*

---

## 🤖 Zespół Subagentów (5) ⭐ NEW!

**Małe, ale wysoce efektywne** zespół specjalistów:

| Agent ID | Specjalizacja | Kiedy Użyć |
|----------|---------------|------------|
| `@frontend-expert` | React Native, Expo, Next.js, UI/UX | Komponenty, dashboard, mobile features |
| `@backend-expert` | Node.js, APIs, PostgreSQL, WebSockets | Endpoints, database, integrations |
| `@ml-expert` | PyTorch, LSTM, NLP, Portfolio Optimization | ML models, predictions, sentiment |
| `@qa-expert` | Jest, Testing Library, Coverage | Testy, quality assurance |
| `@devops-expert` | CI/CD, AWS, Performance, Monitoring | Deployment, optimization, security |

**Szczegóły:** `.claude/agents/README.md`
**Profile agentów:** `.claude/agents/[agent-name].md`

### Przykłady Użycia

**Pojedynczy agent:**
```
@frontend-expert: Zaimplementuj dashboard z portfolio table
```

**Współpraca (parallel):**
```
@backend-expert: Stwórz GET /api/portfolio endpoint
@frontend-expert: Przygotuj UI do wyświetlania portfolio
```

**Kompleksowy feature (team):**
```
1. @ml-expert: Train LSTM model
2. @backend-expert: Create inference API
3. @frontend-expert: Add predictions UI
4. @qa-expert: Test całego pipeline
5. @devops-expert: Deploy & monitor
```

