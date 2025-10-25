# 📐 Code Quality System

Kompletny system zapewnienia najwyższej jakości kodu dla Portfel GPW Advisor.

---

## 📚 Dokumentacja

### 1. [Quality Standards](./quality-standards.md) ⭐⭐⭐⭐⭐
**Standardy jakości kodu**
- Poziomy jakości (Tier 1-3)
- Automated quality checks
- Naming conventions
- Function guidelines
- Error handling patterns
- Performance best practices
- Security standards
- Testing requirements

**Kiedy użyć:** Zanim zaczniesz kodować, przeczytaj to!

---

### 2. [Style Guide](./style-guide.md) 🎨
**Przewodnik stylu kodowania**
- TypeScript conventions
- React/React Native patterns
- File organization
- Import ordering
- Comments guidelines
- Git commit standards
- Tooling configuration

**Kiedy użyć:** Podczas codziennej pracy, jako reference

---

### 3. [Review Checklist](./review-checklist.md) ✅
**Checklist dla code review**
- Pre-review (Author)
- Review guidelines (Reviewer)
- Common issues to flag
- Feedback guidelines
- Approval criteria
- Time limits

**Kiedy użyć:** Przed wysłaniem PR i podczas review

---

### 4. [Automated Checks](./automated-checks.md) 🤖
**Automatyczne kontrole jakości**
- Pre-commit hooks (Husky)
- Pre-push hooks
- GitHub Actions CI/CD
- ESLint configuration
- TypeScript strict mode
- Prettier setup
- Jest configuration
- Bundle size monitoring

**Kiedy użyć:** Setup projektu, konfiguracja CI/CD

---

### 5. [Code Snippets](./code-snippets.md) ⚡
**Gotowe wzorce i skróty**
- VS Code snippets
- Common patterns
- Command line shortcuts
- Claude Code shortcuts
- IDE shortcuts

**Kiedy użyć:** Przyspiesz development, używaj gotowych patterns

---

## 🎯 Quick Start

### 1. Dla Nowego Dewelopera
```bash
# 1. Przeczytaj standardy
cat .claude/code-quality/quality-standards.md

# 2. Zainstaluj hooki
npm install
npx husky install

# 3. Sprawdź konfigurację
npm run lint
npm run type-check
npm test
```

### 2. Przed Rozpoczęciem Feature
```bash
# 1. Zobacz style guide
cat .claude/code-quality/style-guide.md

# 2. Użyj snippets
# VS Code: Wpisz "rfc" i Tab (React component)

# 3. Uruchom dev mode
npm run dev
```

### 3. Przed Wysłaniem PR
```bash
# 1. Sprawdź checklist
cat .claude/code-quality/review-checklist.md

# 2. Uruchom wszystkie checks
npm run lint
npm run type-check
npm test -- --coverage

# 3. Self-review
git diff main...HEAD
```

---

## 🔄 Workflow

### Development Workflow
```
1. Create feature branch
2. Code (following style guide)
3. Write tests (coverage >80%)
4. Self-review (checklist)
5. Create PR
6. Address review feedback
7. Merge (after approval + CI passes)
```

### Quality Gates
```
Pre-commit:
├─ Lint staged files
├─ Format with Prettier
├─ Type check
└─ Run affected tests

Pre-push:
├─ Full test suite
└─ Build check

CI/CD:
├─ Lint
├─ Type check
├─ Tests + coverage
├─ Build
├─ Bundle size check
└─ Security scan
```

---

## 📊 Metryki Jakości

### Cele (Targets)
- ✅ **Test Coverage**: >80%
- ✅ **TypeScript Strict**: 100% (zero `any`)
- ✅ **ESLint Errors**: 0
- ✅ **Prettier**: Auto-formatted
- ✅ **Bundle Size**: <500KB (web), <30MB (mobile)
- ✅ **API Response**: <200ms (P95)
- ✅ **Build Time**: <5 min

### Narzędzia Monitoringu
- **Codecov**: Test coverage
- **GitHub Actions**: CI/CD status
- **Bundle Analyzer**: Bundle size
- **Sentry**: Error tracking
- **Lighthouse CI**: Performance

---

## 🛠️ Narzędzia

### Wymagane
- **ESLint**: Linting
- **Prettier**: Formatting
- **TypeScript**: Type checking
- **Jest**: Testing
- **Husky**: Git hooks

### Zalecane
- **VS Code**: IDE
- **React DevTools**: Debugging
- **Redux DevTools**: State debugging (jeśli używasz Redux)

---

## 🎓 Best Practices

### Do's ✅
- **Write tests first** (TDD)
- **Small commits** (frequent commits)
- **Meaningful names** (self-documenting code)
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **YAGNI** (You Aren't Gonna Need It)

### Don'ts ❌
- **No `any` types**
- **No console.logs** in production
- **No magic numbers**
- **No giant functions** (>50 lines)
- **No commented code**
- **No TODOs** without tickets

---

## 📖 Resources

### Internal
- [Quality Standards](./quality-standards.md)
- [Style Guide](./style-guide.md)
- [Review Checklist](./review-checklist.md)
- [Automated Checks](./automated-checks.md)
- [Code Snippets](./code-snippets.md)

### External
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Best Practices](https://react.dev/learn)
- [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [Refactoring](https://refactoring.com/)

### Project Docs
- [Quick Reference](../ docs/quick-reference.md)
- [Architecture](../docs/architecture.md)
- [Development Guide](../docs/development-guide.md)

---

## 🆘 Help

### Pytanie: "Mój kod nie przechodzi linting"
```bash
# Auto-fix
npm run lint -- --fix

# Jeśli nadal błędy, przeczytaj error message
# ESLint pokaże co i dlaczego
```

### Pytanie: "Coverage poniżej 80%"
```bash
# Zobacz raport
npm test -- --coverage

# Znajdź nieprzetestowane pliki
# Dodaj brakujące testy
```

### Pytanie: "TypeScript errors"
```bash
# Sprawdź dokładnie co i gdzie
npm run type-check

# Najczęstsze: missing types, wrong types
# Dodaj explicit types
```

### Pytanie: "Pre-commit hook fails"
```bash
# Napraw problemy lokalnie
npm run lint -- --fix
npm run format
npm test

# Spróbuj ponownie commit
git commit
```

---

## 🎉 Success Metrics

### Developer Experience
- ⚡ **Fast feedback** - błędy wykrywane lokalnie
- 🎯 **Clear guidelines** - wie co robić
- 🤖 **Automation** - mniej manual work
- 📚 **Documentation** - łatwy dostęp do info

### Code Quality
- 🏆 **High standards** - Tier 1 quality
- 🔒 **Consistent** - jednolity styl
- 🛡️ **Secure** - security first
- ⚡ **Performant** - optimization aware

---

**Quality is Not an Act, It's a Habit** 📐✨

*System Code Quality dla Portfel GPW Advisor*
*Wersja: 1.0 | 2025-10-25*
