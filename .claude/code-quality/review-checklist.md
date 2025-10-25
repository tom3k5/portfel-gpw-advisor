# ✅ Code Review Checklist

## Pre-Review (Author)

Przed wysłaniem Pull Request, upewnij się że:

### Podstawy
- [ ] **Self-review completed** - przejrzałeś własny kod
- [ ] **Code compiles** - zero błędów TypeScript
- [ ] **Tests pass** - wszystkie testy przechodzą lokalnie
- [ ] **Lint passes** - `npm run lint` bez błędów
- [ ] **Formatted** - `npm run format` wykonane

### Testy
- [ ] **Tests added** - nowa funkcjonalność ma testy
- [ ] **Coverage >80%** - sprawdzone przez `npm test -- --coverage`
- [ ] **Edge cases** - nietypowe scenariusze przetestowane
- [ ] **No flaky tests** - testy przechodzą konsekwentnie

### Dokumentacja
- [ ] **README updated** - jeśli zmienia się API/setup
- [ ] **Comments added** - dla złożonej logiki
- [ ] **JSDoc for public APIs** - wszystkie publiczne funkcje
- [ ] **CHANGELOG updated** - jeśli applicable

### Cleanup
- [ ] **No console.logs** - usunięte debug logs
- [ ] **No TODOs/FIXMEs** - wszystkie TODOs rozwiązane lub tickety utworzone
- [ ] **No commented code** - stary kod usunięty
- [ ] **No unused imports** - ESLint to wykryje

### Git
- [ ] **Branch up to date** - zmerged latest main
- [ ] **Meaningful commits** - commit messages follows convention
- [ ] **Small PR** - <400 lines (ideally <200)
- [ ] **CI passing** - wszystkie GitHub Actions checks ✅

---

## Review (Reviewer)

### 1. Przegląd Ogólny (5 min)

- [ ] **PR Description** - jasno opisuje co i dlaczego
- [ ] **Size acceptable** - nie za duży (<400 lines)
- [ ] **Scope appropriate** - robi jedną rzecz
- [ ] **Tests included** - widoczne w Files Changed

### 2. Kod - Funkcjonalność (10 min)

- [ ] **Logic correct** - algorytmy są poprawne
- [ ] **Edge cases handled** - null checks, empty arrays, etc.
- [ ] **Error handling** - try/catch where needed
- [ ] **No obvious bugs** - nic co "wybucha"

### 3. Kod - Jakość (10 min)

#### TypeScript
- [ ] **No `any` types** - strict typing throughout
- [ ] **Interfaces defined** - dla obiektów
- [ ] **Return types explicit** - dla funkcji

#### Naming
- [ ] **Variables descriptive** - `userPortfolio` not `data`
- [ ] **Functions verb-based** - `calculatePnL` not `pnl`
- [ ] **Components clear** - `PortfolioTable` not `Table`

#### Functions
- [ ] **Single responsibility** - one function = one thing
- [ ] **<50 lines** - nie za długie
- [ ] **<3 parameters** - używa object dla więcej

#### Formatting
- [ ] **Consistent indentation** - Prettier enforces
- [ ] **No long lines** - <120 characters
- [ ] **Logical grouping** - related code together

### 4. Performance (5 min)

- [ ] **No unnecessary re-renders** - React.memo, useMemo used
- [ ] **Database queries optimized** - uses select, indexes
- [ ] **API calls cached** - where appropriate (Redis)
- [ ] **No N+1 queries** - includes/joins used properly
- [ ] **Bundle impact minimal** - large dependencies avoided

### 5. Security (5 min)

- [ ] **Input validated** - Zod/Joi schemas
- [ ] **SQL injection safe** - parameterized queries (Prisma)
- [ ] **XSS safe** - no dangerouslySetInnerHTML without sanitization
- [ ] **Auth checks** - protected routes have middleware
- [ ] **No secrets exposed** - no API keys in code
- [ ] **User can only access own data** - authorization checks

### 6. Testing (10 min)

#### Coverage
- [ ] **New code covered** - check coverage report
- [ ] **Critical paths 100%** - auth, payments, calculations
- [ ] **Happy path tested** - main use case works
- [ ] **Error cases tested** - what happens when it fails

#### Quality
- [ ] **Tests are meaningful** - not just for coverage
- [ ] **AAA pattern** - Arrange, Act, Assert
- [ ] **No brittle tests** - not overly specific
- [ ] **Mocks appropriate** - external deps mocked

### 7. Documentation (5 min)

- [ ] **Code self-documenting** - clear naming
- [ ] **Complex logic explained** - comments for "why"
- [ ] **JSDoc for APIs** - public functions documented
- [ ] **README updated** - if setup changed

### 8. Architecture (5 min)

- [ ] **Follows project structure** - files in right folders
- [ ] **Shared code reused** - no duplication
- [ ] **Separation of concerns** - UI separate from logic
- [ ] **Future-proof** - extensible design

---

## Common Issues to Flag

### 🚩 Critical (Block merge)
- Security vulnerabilities
- Breaking changes without migration
- Failing tests
- Performance degradation >20%
- Data loss risk

### ⚠️ Important (Request changes)
- Missing tests for new code
- Poor error handling
- Unclear/misleading naming
- Duplicated code
- Magic numbers/strings

### 💡 Suggestions (Nice to have)
- Performance optimizations
- Code simplification
- Better naming
- Additional test cases
- Documentation improvements

---

## Feedback Guidelines

### How to Give Feedback

#### Good ✅
```
🚩 Security: User input not validated on line 42.
Please add Zod schema validation before database query.

Suggested:
const schema = z.object({ userId: z.number() });
const { userId } = schema.parse(req.body);
```

#### Bad ❌
```
This is wrong.
Fix it.
```

### Tone
- **Be kind** - assume good intent
- **Be specific** - point to exact line
- **Be helpful** - suggest solutions
- **Be educational** - explain "why"

### Priority Labels
- 🚩 **Critical** - must fix
- ⚠️ **Important** - should fix
- 💡 **Suggestion** - consider
- ❓ **Question** - clarification needed
- 🎨 **Style** - preference (low priority)

---

## Approval Guidelines

### ✅ Approve if:
- All critical issues resolved
- Tests passing
- Coverage acceptable
- Code follows standards
- Documentation sufficient

### 🔄 Request Changes if:
- Critical security issues
- Missing tests
- Poor error handling
- Breaking changes undocumented
- Significant performance issues

### 💬 Comment (no approval) if:
- Minor suggestions only
- Questions for clarification
- Nice-to-have improvements

---

## Time Limits

- **Small PR** (<100 lines): 15 minutes
- **Medium PR** (100-300 lines): 30 minutes
- **Large PR** (300-400 lines): 45 minutes
- **Too Large** (>400 lines): Ask to split

If review takes >45 minutes, PR is probably too large.

---

## Post-Review (Author)

### After receiving feedback:
- [ ] **Address all critical issues** (🚩)
- [ ] **Respond to all comments** - even if just "Done ✅"
- [ ] **Explain trade-offs** - if you disagree with suggestion
- [ ] **Update PR description** - if scope changed
- [ ] **Re-request review** - after significant changes
- [ ] **Merge when approved** - don't let PR go stale

### Merging
- [ ] **Squash commits** - if many small commits
- [ ] **Meaningful merge message** - summarizes changes
- [ ] **Delete branch** - after merge

---

## Special Cases

### Hotfix (Urgent)
- Expedited review (<30 min)
- Can merge with 1 approval
- Must create follow-up ticket for tests

### Refactoring
- Must have 0 behavior changes
- Tests prove equivalence
- Can be large (>400 lines)

### Documentation Only
- Quick review (<5 min)
- Focus on clarity and accuracy

### Experiment/Spike
- Doesn't need tests
- Label as "DO NOT MERGE"
- Discussion focused

---

## Automation

### Pre-commit (Husky)
```bash
✅ Lint staged files
✅ Format with Prettier
✅ Type check
✅ Run affected tests
```

### Pre-push
```bash
✅ Full test suite
✅ Build check
```

### CI (GitHub Actions)
```bash
✅ Lint
✅ Type check
✅ Tests + coverage
✅ Build
✅ Bundle size check
✅ Security scan
```

---

## Resources

- [Quality Standards](.claude/code-quality/quality-standards.md)
- [Style Guide](.claude/code-quality/style-guide.md)
- [Quick Reference](.claude/docs/quick-reference.md)

---

**Quality Through Collaboration** 🤝✅

*Remember: Code review is for learning, not judging*
