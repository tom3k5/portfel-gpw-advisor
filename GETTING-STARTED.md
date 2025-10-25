# 🚀 Getting Started - Portfel GPW Advisor

Witaj w projekcie **Portfel GPW Advisor**! Ten dokument pomoże Ci szybko rozpocząć pracę.

## ⚡ Quick Start (5 minut)

### 1. Przejrzyj Kluczowe Dokumenty
```bash
# Specyfikacja projektu
cat "Specyfikacja Funkcjonalna i Techniczna: .MD"

# Środowisko Claude Code
cat .claude/README.md

# Szybki przewodnik
cat .claude/docs/quick-reference.md
```

### 2. Zrozum Kontekst Projektu
- **Co budujemy:** Aplikacja inwestycyjna AI dla GPW
- **Dla kogo:** Inwestorzy indywidualni (Anna, Marek)
- **Tech stack:** React Native (Expo) + Next.js + Node.js + PostgreSQL + AI/ML
- **Czas realizacji:** 20 tygodni (3 etapy MVP)

### 3. Zapoznaj się ze Środowiskiem Claude Code
Masz dostęp do **14 slash commands** pokrywających wszystkie kluczowe zadania:

```bash
# Przykład: Rozpoczęcie projektu
/setup-monorepo

# Przykład: Implementacja dashboardu
/implement-dashboard

# Przykład: Debugowanie
/debug-issue
```

Pełna lista: `.claude/INDEX.md`

## 📋 Plan Działania - Pierwszy Tydzień

### Dzień 1: Setup
- [ ] Przeczytaj specyfikację projektu
- [ ] Zapoznaj się ze środowiskiem `.claude/`
- [ ] Przejrzyj architekturę: `.claude/docs/architecture.md`
- [ ] Użyj `/setup-monorepo` aby zainicjalizować projekt

### Dzień 2-3: Podstawy
- [ ] Skonfiguruj środowisko developerskie
- [ ] Zainstaluj wymagane narzędzia (Node.js, Expo CLI, PostgreSQL)
- [ ] Skopiuj `.env.example` do `.env` i uzupełnij klucze API
- [ ] Uruchom aplikacje lokalnie

### Dzień 4-5: Pierwszy Feature
- [ ] Użyj `/implement-dashboard` aby stworzyć podstawowy dashboard
- [ ] Przetestuj na iOS, Android i Web
- [ ] Dodaj testy używając `/add-tests`
- [ ] Stwórz pierwszy commit (użyj konwencji z `.claude/prompts/commit-message-template.md`)

## 🎯 Struktura Projektu (Po Setup)

```
portfel-gpw-advisor/
├── apps/
│   ├── expo/              # Mobile (iOS + Android)
│   └── web/               # Web (Next.js)
├── packages/
│   ├── ui/                # Shared components
│   └── logic/             # Business logic
├── backend/               # Node.js API
├── ml-models/            # Python ML
├── .claude/              # Claude Code environment
└── turbo.json            # Monorepo config
```

## 📚 Najważniejsze Dokumenty

### Musisz Przeczytać
1. **Specyfikacja:** `Specyfikacja Funkcjonalna i Techniczna: .MD`
2. **Claude README:** `.claude/README.md`
3. **Project Context:** `.claude/project-context.md`
4. **Quick Reference:** `.claude/docs/quick-reference.md`

### Nice to Have
5. **Architecture:** `.claude/docs/architecture.md`
6. **Development Guide:** `.claude/docs/development-guide.md`
7. **Tech Stack Details:** `.claude/docs/tech-stack-details.md`

### Kompletny Index
8. **INDEX:** `.claude/INDEX.md` (pełna mapa środowiska)

## 🛠️ Wymagane Narzędzia

### Podstawowe
- **Node.js** 18+ LTS: https://nodejs.org/
- **npm** 9+: (included with Node.js)
- **Git**: https://git-scm.com/
- **Expo CLI**: `npm install -g expo-cli`

### Bazy Danych
- **PostgreSQL** 14+: https://www.postgresql.org/download/
- **Redis** (optional for development): https://redis.io/download/

### Mobile Development
- **Xcode** (Mac only): For iOS development
- **Android Studio**: For Android development

### Recommended
- **VS Code** / **Cursor**: https://code.visualstudio.com/
- **React DevTools**: Browser extension
- **Postman** / **Insomnia**: API testing

## 🔑 API Keys Potrzebne

### MVP - Etap 1 (Week 1-6)
- ✅ Brak! Możesz używać mock data

### MVP - Etap 2 (Week 7-12)
- 🔑 **Polygon.io**: Stock market data (Free tier: 5 req/min)
  - Sign up: https://polygon.io/
- 🔑 **X API**: Twitter sentiment (Basic: $100/mo)
  - Sign up: https://developer.twitter.com/

### MVP - Etap 3 (Week 13-20)
- 🔑 **Ortex** (Optional): Short interest data
  - Contact sales: https://www.ortex.com/

### Development
- 🔑 **Sentry**: Error tracking (Free tier available)
- 🔑 **AWS** / **GCP**: Cloud hosting (Free tier for testing)

**Wskazówka:** Rozpocznij od Etapu 1 z mock data, API keys dodasz później!

## 💻 Pierwsze Komendy

```bash
# 1. Setup środowiska (jeśli jeszcze nie zrobione)
/setup-monorepo

# 2. Instalacja dependencies
npm install

# 3. Setup bazy danych
cp .env.example .env
# Edytuj .env z DATABASE_URL
npm run db:migrate

# 4. Uruchom wszystko w dev mode
npm run dev

# W osobnych terminalach:
# Mobile app
cd apps/expo && npm run ios
# lub
cd apps/expo && npm run android

# Web app
cd apps/web && npm run dev

# Backend
cd backend && npm run dev
```

## 🎓 Workflow Developerski

### Typowy Dzień Pracy

1. **Wybierz task z workflow**
   - Sprawdź aktualny tydzień w `.claude/workflows/`
   - Np. Week 2: `.claude/workflows/etap1-week2.md`

2. **Użyj slash command lub template**
   ```bash
   # Przykład: tworzenie komponentu
   /new-component
   ```

3. **Kod → Test → Commit**
   ```bash
   # Koduj używając templates z .claude/prompts/
   # Testuj
   npm test
   # Commit
   git commit -m "feat(dashboard): add portfolio chart"
   ```

4. **Push & PR**
   ```bash
   git push origin feat/your-feature
   # Create PR using template: .claude/prompts/pr-template.md
   ```

## 🆘 Pomoc

### Mam Problem!
```bash
# 1. Sprawdź Quick Reference
cat .claude/docs/quick-reference.md

# 2. Użyj debug command
/debug-issue

# 3. Zobacz Common Errors w Development Guide
cat .claude/docs/development-guide.md
```

### Nie Wiem Co Robić
```bash
# 1. Sprawdź workflow dla aktualnego tygodnia
ls .claude/workflows/

# 2. Przejrzyj INDEX
cat .claude/INDEX.md

# 3. Zadaj pytanie Claude Code z kontekstem
```

### Gdzieś Dodać Kod?
Zobacz `.claude/docs/quick-reference.md` sekcja "Struktura Plików - Gdzie Co Jest?"

## 📞 Useful Links

- **Claude Code Docs**: https://docs.claude.com/en/docs/claude-code
- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **Next.js**: https://nextjs.org/docs
- **Turborepo**: https://turbo.build/repo/docs

## ✅ Checklist Przed Rozpoczęciem

- [ ] Przeczytałem specyfikację projektu
- [ ] Zainstalowałem wymagane narzędzia
- [ ] Przejrzałem `.claude/README.md`
- [ ] Znam lokalizację `.claude/INDEX.md`
- [ ] Wiem jak używać slash commands
- [ ] Mam dostęp do `.claude/docs/quick-reference.md`
- [ ] Setup środowiska gotowy (lub wiem jak użyć `/setup-monorepo`)
- [ ] Gotowy do kodowania! 🚀

## 🎉 Następne Kroki

### Jesteś Gotowy!

1. **Rozpocznij od Etapu 1, Week 1:**
   ```bash
   cat .claude/workflows/etap1-week1.md
   ```

2. **Użyj `/setup-monorepo` aby zainicjalizować projekt**

3. **Śledź postęp używając workflows i slash commands**

4. **Pytania? Sprawdź:**
   - `.claude/INDEX.md` - Kompletny index
   - `.claude/docs/quick-reference.md` - Szybkie wzorce
   - `.claude/docs/development-guide.md` - Szczegółowy guide

---

**Powodzenia! Zbudujmy najlepszą aplikację inwestycyjną dla GPW!** 🚀📈

*Need help? See `.claude/INDEX.md` for complete navigation*
