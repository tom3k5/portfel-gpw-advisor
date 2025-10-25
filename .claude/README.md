# Claude Code Environment - Portfel GPW Advisor

Witamy w środowisku deweloperskim dla projektu **Portfel GPW Advisor**!

To środowisko zostało skonfigurowane specjalnie dla Claude Code, aby maksymalnie przyspieszyć rozwój aplikacji.

## 📁 Struktura Katalogów

```
.claude/
├── commands/              # Slash commands dla kluczowych zadań
├── prompts/              # Szablony dla powtarzalnych zadań
├── workflows/            # Przepływy pracy dla każdego etapu MVP
├── docs/                 # Dokumentacja techniczna
├── project-context.md    # Kontekst projektu
└── README.md            # Ten plik
```

## 🚀 Dostępne Slash Commands

Użyj tych komend aby szybko rozpocząć pracę nad konkretnymi zadaniami:

### Setup & Infrastructure
- `/setup-monorepo` - Inicjalizacja całego projektu (Turborepo, apps, packages)

### Etap 1: Core & Usability (6 tygodni)
- `/implement-dashboard` - Stworzenie dashboardu z tabelą i wykresami
- `/csv-import` - Implementacja importu portfela z CSV
- `/push-notifications` - System powiadomień push (8:00 i 16:00 CET)

### Etap 2: Data & Analysis (6 tygodni)
- `/polygon-integration` - Integracja z Polygon.io (real-time prices)
- `/sentiment-analysis` - Analiza sentymentu z X (Twitter)

### Etap 3: Intelligence & Optimization (8 tygodni)
- `/lstm-predictions` - Model LSTM do predykcji cen
- `/portfolio-optimization` - Optymalizacja portfela (Markowitz + ML)

### Utilities
- `/review-etap1` - Przegląd ukończenia Etapu 1
- `/debug-issue` - Systematyczne debugowanie problemu
- `/add-tests` - Dodanie testów do funkcjonalności

## 📋 Szablony Prompt

W katalogu `prompts/` znajdziesz szablony dla:

- **component-template.md** - Tworzenie komponentów React
- **api-integration-template.md** - Integracja z zewnętrznymi API
- **ml-model-template.md** - Rozwój modeli ML
- **commit-message-template.md** - Konwencje commitów
- **pr-template.md** - Szablon Pull Request

## 📚 Dokumentacja

- **project-context.md** - Szybki przegląd projektu (stack, fazy, cele)
- **docs/architecture.md** - Szczegółowa architektura systemu
- **docs/development-guide.md** - Przewodnik dla developerów

## 🗓️ Workflows

Każdy tydzień rozwoju ma swój workflow z konkretnymi zadaniami:

- `workflows/etap1-week1.md` - Setup & Architecture
- `workflows/etap1-week2.md` - Core UI - Dashboard
- `workflows/etap2-summary.md` - Data & Analysis overview
- `workflows/etap3-summary.md` - Intelligence & Optimization overview

## 💡 Jak Używać?

### Przykład 1: Rozpoczęcie nowego tygodnia pracy
```
/setup-monorepo
```
Claude zainicjalizuje cały monorepo zgodnie ze specyfikacją.

### Przykład 2: Implementacja konkretnej funkcji
```
/implement-dashboard
```
Claude stworzy dashboard z komponentami, wykresami i testami.

### Przykład 3: Przegląd postępu
```
/review-etap1
```
Claude przeprowadzi pełny audyt Etapu 1 i wygeneruje raport.

### Przykład 4: Debugowanie
```
/debug-issue

Następnie opisz problem, a Claude poprowadzi Cię przez proces debugowania.
```

## 🎯 Quick Start

Aby rozpocząć pracę nad projektem:

1. **Przejrzyj kontekst:**
   ```
   Przeczytaj .claude/project-context.md
   ```

2. **Zapoznaj się z architekturą:**
   ```
   Przeczytaj .claude/docs/architecture.md
   ```

3. **Rozpocznij Etap 1:**
   ```
   /setup-monorepo
   ```

4. **Śledź workflow:**
   ```
   Otwórz .claude/workflows/etap1-week1.md i realizuj zadania
   ```

## 🏗️ Aktualny Etap Projektu

**Etap:** Pre-MVP (Setup)
**Cel:** Przygotowanie środowiska i rozpoczęcie Etapu 1
**Następny milestone:** Ukończenie Etapu 1 - Week 1 (Setup & Architecture)

## 📞 Pomoc

Jeśli potrzebujesz pomocy:
- Sprawdź `docs/development-guide.md` dla typowych problemów
- Użyj `/debug-issue` dla systematycznego debugowania
- Przejrzyj odpowiedni workflow dla aktualnego tygodnia

## 🎉 Powodzenia!

To środowisko zostało zaprojektowane aby maksymalnie przyspieszyć rozwój. Wszystkie komendy, szablony i dokumentacja są dostosowane do specyfiki projektu Portfel GPW Advisor.

**Cel:** Stworzenie najlepszej aplikacji inwestycyjnej dla polskiego rynku! 🚀📈
