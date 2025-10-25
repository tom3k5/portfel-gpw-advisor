# 🚀 Portfel GPW Advisor

Innowacyjna aplikacja mobilna i webowa dla inwestorów indywidualnych na Giełdzie Papierów Wartościowych w Warszawie.

## 📱 O Projekcie

**Portfel GPW Advisor** to aplikacja wykorzystująca sztuczną inteligencję do dostarczania spersonalizowanych raportów inwestycyjnych dwa razy dziennie. Łączy analizę portfela użytkownika, dane rynkowe w czasie rzeczywistym, analizę sentymentu z mediów społecznościowych oraz predykcje AI (LSTM).

### Kluczowe Funkcjonalności
- 📊 Dashboard z wizualizacją portfela
- 💹 Dane real-time z GPW (Polygon.io)
- 🤖 Predykcje AI (LSTM neural networks)
- 📈 Optymalizacja portfela (Markowitz + ML)
- 💬 Analiza sentymentu (X/Twitter)
- 🔔 Powiadomienia push (8:00 & 16:00 CET)
- 📲 Cross-platform (iOS, Android, Web)

### Tech Stack
- **Frontend:** React Native (Expo), Next.js
- **Backend:** Node.js, Express, PostgreSQL
- **AI/ML:** PyTorch, ONNX, Torch.js
- **Architektura:** Turborepo monorepo

## 🎯 Quick Start

### Dla Developerów - Rozpoczęcie Pracy

```bash
# 1. Przeczytaj przewodnik
cat GETTING-STARTED.md

# 2. Zobacz dostępne narzędzia Claude Code
cat .claude/README.md

# 3. Pełna nawigacja środowiska
cat .claude/INDEX.md
```

### Kluczowe Dokumenty
1. **GETTING-STARTED.md** - Szybki start (5 minut)
2. **.claude/README.md** - Środowisko Claude Code
3. **.claude/INDEX.md** - Kompletna nawigacja
4. **ENVIRONMENT-SUMMARY.md** - Podsumowanie środowiska
5. **Specyfikacja Funkcjonalna i Techniczna: .MD** - Pełna specyfikacja projektu

## 🛠️ Środowisko Claude Code

Projekt wyposażony w kompletne środowisko dla Claude Code zawierające:

### ✨ 14 Slash Commands
Gotowe komendy dla wszystkich kluczowych zadań deweloperskich:
- `/setup-monorepo` - Inicjalizacja projektu
- `/implement-dashboard` - Dashboard UI
- `/csv-import` - Import portfela
- `/push-notifications` - System notyfikacji
- `/polygon-integration` - Real-time data
- `/sentiment-analysis` - Analiza sentymentu
- `/lstm-predictions` - Model AI
- `/portfolio-optimization` - Optymalizacja
- ...i więcej! (zobacz `.claude/INDEX.md`)

### 📋 5 Prompt Templates
Szablony dla powtarzalnych zadań:
- Component Template
- API Integration Template
- ML Model Template
- Commit Message Template
- Pull Request Template

### 🗓️ 4 Workflows
Szczegółowe przepływy pracy dla każdego etapu MVP:
- Etap 1 (6 tyg.): Core & Usability
- Etap 2 (6 tyg.): Data & Analysis
- Etap 3 (8 tyg.): Intelligence & Optimization

### 📚 Kompletna Dokumentacja
- Architecture Guide
- Development Guide
- Tech Stack Details
- Quick Reference

## 📈 Roadmap MVP (20 tygodni)

### Etap 1: Core & Usability (6 tygodni)
- ✅ Setup monorepo (Turborepo)
- ✅ Dashboard z portfolio table
- ✅ Import CSV
- ✅ Powiadomienia push
- ✅ Podstawowe rekomendacje

### Etap 2: Data & Analysis (6 tygodni)
- 🔄 Integracja Polygon.io (real-time)
- 🔄 Analiza sentymentu (X API)
- 🔄 Dynamiczne raporty
- 🔄 Short squeeze alerts

### Etap 3: Intelligence & Optimization (8 tygodni)
- 📅 Model LSTM (predykcje cen)
- 📅 Optymalizacja portfela
- 📅 Backtesting
- 📅 Produkcyjna wersja MVP

## 🎯 Cele Biznesowe

- **10,000** aktywnych użytkowników w 12 miesięcy
- **40%** retention po 3 miesiącach
- **60%** użytkowników beating WIG20
- **5%** konwersja do premium w 6 miesięcy

## 💼 Model Biznesowy

### Free Tier
- Podstawowe zarządzanie portfelem
- Statyczne raporty 2x dziennie
- Podstawowe rekomendacje

### Premium (Subskrypcja)
- Automatyczna synchronizacja z brokerem
- Zaawansowane raporty AI
- Alerty real-time
- Auto-trading
- Zaawansowane zarządzanie ryzykiem

## 🚀 Rozpoczęcie Projektu

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Expo CLI
- (Optional) Redis, Python 3.10+

### Setup

```bash
# Użyj Claude Code slash command
/setup-monorepo

# Lub manualnie:
npx create-turbo@latest
```

Szczegóły w **GETTING-STARTED.md**

## 📞 Dokumentacja i Pomoc

### Dla Deweloperów
- **Quick Start:** `GETTING-STARTED.md`
- **Development Guide:** `.claude/docs/development-guide.md`
- **Quick Reference:** `.claude/docs/quick-reference.md`
- **Architecture:** `.claude/docs/architecture.md`

### Dla Project Managers
- **Specyfikacja:** `Specyfikacja Funkcjonalna i Techniczna: .MD`
- **Workflows:** `.claude/workflows/`
- **Environment Summary:** `ENVIRONMENT-SUMMARY.md`

### Kompletna Nawigacja
- **INDEX:** `.claude/INDEX.md`

## 🏗️ Struktura Projektu (Po Setup)

```
portfel-gpw-advisor/
├── apps/
│   ├── expo/              # Mobile (iOS + Android)
│   └── web/               # Web (Next.js)
├── packages/
│   ├── ui/                # Shared UI components
│   └── logic/             # Business logic
├── backend/               # Node.js API
├── ml-models/            # Python ML models
├── .claude/              # Claude Code environment
└── turbo.json            # Monorepo config
```

## 🎓 Resources

- **React Native:** https://reactnative.dev/
- **Expo:** https://docs.expo.dev/
- **Next.js:** https://nextjs.org/docs
- **Turborepo:** https://turbo.build/repo/docs
- **Claude Code:** https://docs.claude.com/en/docs/claude-code

## 📄 Licencja

[Do uzupełnienia przez właściciela projektu]

## 👥 Zespół

[Do uzupełnienia]

---

**Status:** Pre-MVP / Setup Phase
**Wersja Środowiska:** 1.0
**Data:** 25 października 2025

---

## 🎉 Gotowe do Startu!

Środowisko jest w pełni skonfigurowane i gotowe do użycia.

**Następne kroki:**
1. Przeczytaj `GETTING-STARTED.md`
2. Użyj `/setup-monorepo` w Claude Code
3. Zacznij budować! 🚀

---

*Projekt realizowany z Claude Code by Anthropic*
