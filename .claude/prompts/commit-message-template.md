# Commit Message Guidelines

Follow these conventions for all commits in Portfel GPW Advisor.

## Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types
- **feat**: New feature
- **fix**: Bug fix
- **refactor**: Code refactoring (no functionality change)
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **docs**: Documentation changes
- **chore**: Build process, dependencies, tooling
- **style**: Code formatting (not CSS)

## Scopes
- **dashboard**: Dashboard feature
- **portfolio**: Portfolio management
- **notifications**: Notification system
- **api**: API integrations
- **ml**: Machine learning models
- **ui**: UI components
- **logic**: Business logic
- **expo**: Mobile app
- **web**: Web app

## Examples

### Good commits:
```
feat(dashboard): add portfolio summary chart

Implemented Victory chart showing portfolio value over time.
Supports 1M, 3M, 6M, 1Y time ranges.

Closes #42
```

```
fix(notifications): correct timezone handling for CET

Notifications were sending at wrong times due to timezone
conversion bug. Now properly converts to CET before scheduling.

Fixes #58
```

```
refactor(portfolio): extract P&L calculation to shared logic

Moved calculatePnL function from dashboard to packages/logic
to enable reuse across mobile and web apps.
```

### Bad commits (avoid):
```
fix stuff
updated files
WIP
asdf
final version
fix fix fix
```

## Subject Line Rules
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period at the end
- Max 50 characters
- Be specific and descriptive

## Body (optional but recommended)
- Explain **what** and **why**, not how
- Wrap at 72 characters
- Reference issue numbers

## Footer
- Breaking changes: `BREAKING CHANGE: description`
- Issue references: `Closes #123` or `Fixes #456`
