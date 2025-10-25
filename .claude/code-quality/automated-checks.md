# 🤖 Automated Code Quality Checks

## Setup Guide

### 1. Pre-commit Hooks (Husky + lint-staged)

#### Installation
```bash
npm install --save-dev husky lint-staged
npx husky install
```

#### Configuration

**`.husky/pre-commit`**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."
npx lint-staged
```

**`package.json`**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "bash -c 'tsc --noEmit'"
    ],
    "*.{json,md,yml}": [
      "prettier --write"
    ]
  },
  "scripts": {
    "prepare": "husky install"
  }
}
```

---

### 2. Pre-push Hooks

**`.husky/pre-push`**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 Running tests before push..."
npm test -- --bail --findRelatedTests

echo "🏗️  Building project..."
npm run build

echo "✅ All checks passed! Pushing..."
```

---

### 3. GitHub Actions CI/CD

**`.github/workflows/ci.yml`**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  quality-checks:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Format check
        run: npm run format:check

  tests:
    name: Tests & Coverage
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage --maxWorkers=2

      - name: Check coverage thresholds
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "❌ Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi
          echo "✅ Coverage: $COVERAGE%"

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: true

  build:
    name: Build Check
    runs-on: ubuntu-latest
    needs: [quality-checks, tests]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Check bundle size
        run: |
          npm run analyze
          # Check web bundle size
          WEB_SIZE=$(du -sk apps/web/.next | cut -f1)
          if [ $WEB_SIZE -gt 512 ]; then
            echo "❌ Web bundle too large: ${WEB_SIZE}KB (max 512KB)"
            exit 1
          fi
          echo "✅ Web bundle size: ${WEB_SIZE}KB"

  security:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # Add deployment script here

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment script here

      - name: Notify Sentry of deployment
        run: |
          curl -X POST https://sentry.io/api/0/organizations/.../releases/ \
            -H "Authorization: Bearer ${{ secrets.SENTRY_AUTH_TOKEN }}" \
            -d '{"version": "${{ github.sha }}"}'
```

---

### 4. ESLint Configuration

**`.eslintrc.js`**
```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier', // Must be last
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-native',
    'import',
  ],
  rules: {
    // TypeScript
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-floating-promises': 'error',

    // React
    'react/prop-types': 'off', // Using TypeScript
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',

    // Imports
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

---

### 5. TypeScript Configuration

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    // Strict Type Checking
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    // Additional Checks
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    // Module Resolution
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,

    // Other Options
    "target": "es2021",
    "lib": ["es2021"],
    "jsx": "react-native",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build"]
}
```

---

### 6. Prettier Configuration

**`.prettierrc`**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**`package.json scripts`**
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,md}\""
  }
}
```

---

### 7. Jest Configuration

**`jest.config.js`**
```javascript
module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

---

### 8. Bundle Size Monitoring

**`package.json scripts`**
```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "analyze:web": "cd apps/web && npm run analyze",
    "size-limit": "size-limit"
  }
}
```

**`.size-limit.json`**
```json
[
  {
    "name": "Web App (main bundle)",
    "path": "apps/web/.next/static/**/*.js",
    "limit": "500 KB"
  },
  {
    "name": "Mobile App (OTA update)",
    "path": "apps/expo/.expo-shared/**/*.js",
    "limit": "30 MB"
  }
]
```

---

### 9. Dependency Updates

**`renovate.json`** (Automated dependency updates)
```json
{
  "extends": ["config:base"],
  "packageRules": [
    {
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    }
  ],
  "schedule": ["every weekend"]
}
```

---

### 10. Code Quality Badges

Add to `README.md`:
```markdown
![CI](https://github.com/user/repo/workflows/CI/badge.svg)
![Coverage](https://codecov.io/gh/user/repo/branch/main/graph/badge.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
```

---

## Metrics Dashboard

### Track Over Time
- **Test Coverage**: Target >80%
- **Bundle Size**: Web <500KB, Mobile <30MB
- **Build Time**: <5 minutes
- **Test Execution**: <2 minutes
- **Lint Warnings**: 0
- **TypeScript Errors**: 0

### Tools
- **Codecov**: Test coverage visualization
- **Bundle Analyzer**: Bundle size tracking
- **Lighthouse CI**: Performance monitoring
- **Sentry**: Error tracking

---

## Quality Gates

### Merge to Main Requires:
✅ All CI checks pass
✅ Coverage >80%
✅ No ESLint errors
✅ No TypeScript errors
✅ Bundle size within limits
✅ 1+ approved review
✅ All comments resolved

---

## Scripts Reference

```json
{
  "scripts": {
    // Development
    "dev": "turbo run dev",
    "start": "turbo run start",

    // Quality
    "lint": "turbo run lint",
    "lint:fix": "turbo run lint -- --fix",
    "type-check": "turbo run type-check",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",

    // Testing
    "test": "turbo run test",
    "test:watch": "turbo run test -- --watch",
    "test:coverage": "turbo run test -- --coverage",

    // Build
    "build": "turbo run build",
    "analyze": "turbo run analyze",

    // Git Hooks
    "prepare": "husky install",

    // Utilities
    "clean": "turbo run clean && rm -rf node_modules",
    "clean:cache": "turbo run clean",
    "update-deps": "ncu -u && npm install"
  }
}
```

---

## Troubleshooting

### Pre-commit hooks not running
```bash
npx husky install
chmod +x .husky/pre-commit
```

### ESLint errors on save
```bash
# VS Code settings.json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### TypeScript errors in IDE
```bash
# Restart TypeScript server
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Resources

- [Husky](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Automation Ensures Quality** 🤖✨

*Ostatnia aktualizacja: 2025-10-25*
