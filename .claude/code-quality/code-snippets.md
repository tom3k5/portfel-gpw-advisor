# ⚡ Code Snippets & Shortcuts

Quick templates for common patterns in Portfel GPW Advisor.

## VS Code Snippets

### Setup

Create `.vscode/snippets.code-snippets` in project root:

```json
{
  "React Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "import { View, Text, StyleSheet } from 'react-native';",
      "",
      "interface ${1:ComponentName}Props {",
      "  ${2:prop}: ${3:string};",
      "}",
      "",
      "export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ ${2:prop} }) => {",
      "  return (",
      "    <View style={styles.container}>",
      "      <Text>{${2:prop}}</Text>",
      "    </View>",
      "  );",
      "};",
      "",
      "const styles = StyleSheet.create({",
      "  container: {",
      "    $0",
      "  },",
      "});",
      ""
    ],
    "description": "Create React Functional Component"
  },

  "Custom Hook": {
    "prefix": "hook",
    "body": [
      "import { useState, useEffect } from 'react';",
      "",
      "export function use${1:HookName}(${2:param}: ${3:string}) {",
      "  const [${4:data}, set${4/(.*)/${1:/capitalize}/}] = useState<${5:Type} | null>(null);",
      "  const [loading, setLoading] = useState(true);",
      "  const [error, setError] = useState<Error | null>(null);",
      "",
      "  useEffect(() => {",
      "    async function fetch${4/(.*)/${1:/capitalize}/}() {",
      "      try {",
      "        setLoading(true);",
      "        const result = await fetch${4/(.*)/${1:/capitalize}/}(${2:param});",
      "        set${4/(.*)/${1:/capitalize}/}(result);",
      "      } catch (err) {",
      "        setError(err as Error);",
      "      } finally {",
      "        setLoading(false);",
      "      }",
      "    }",
      "",
      "    fetch${4/(.*)/${1:/capitalize}/}();",
      "  }, [${2:param}]);",
      "",
      "  return { ${4:data}, loading, error };",
      "}",
      ""
    ],
    "description": "Create custom React hook"
  },

  "API Service": {
    "prefix": "service",
    "body": [
      "import axios, { AxiosInstance } from 'axios';",
      "",
      "interface ${1:Service}Config {",
      "  apiKey: string;",
      "  baseUrl: string;",
      "}",
      "",
      "class ${1:Service}Service {",
      "  private client: AxiosInstance;",
      "",
      "  constructor(config: ${1:Service}Config) {",
      "    this.client = axios.create({",
      "      baseURL: config.baseUrl,",
      "      timeout: 10000,",
      "      headers: {",
      "        'Authorization': `Bearer \\${config.apiKey}`,",
      "      },",
      "    });",
      "",
      "    this.setupInterceptors();",
      "  }",
      "",
      "  private setupInterceptors() {",
      "    this.client.interceptors.response.use(",
      "      (response) => response,",
      "      (error) => this.handleError(error)",
      "    );",
      "  }",
      "",
      "  private handleError(error: any) {",
      "    console.error('${1:Service} Error:', error);",
      "    throw error;",
      "  }",
      "",
      "  async ${2:fetchData}(${3:param}: ${4:string}): Promise<${5:Type}> {",
      "    const response = await this.client.get(`/${3:param}`);",
      "    return response.data;",
      "  }",
      "}",
      "",
      "export const ${1/(.)/${1:/downcase}/}Service = new ${1:Service}Service({",
      "  apiKey: process.env.${1/(.*)/${1:/upcase}/}_API_KEY || '',",
      "  baseUrl: process.env.${1/(.*)/${1:/upcase}/}_BASE_URL || '',",
      "});",
      ""
    ],
    "description": "Create API service class"
  },

  "Test Suite": {
    "prefix": "test",
    "body": [
      "describe('${1:FunctionName}', () => {",
      "  it('${2:should do something}', () => {",
      "    // Arrange",
      "    const ${3:input} = ${4:value};",
      "",
      "    // Act",
      "    const result = ${1:FunctionName}(${3:input});",
      "",
      "    // Assert",
      "    expect(result).toBe(${5:expected});",
      "  });",
      "",
      "  it('${6:should handle edge case}', () => {",
      "    $0",
      "  });",
      "});",
      ""
    ],
    "description": "Create test suite"
  },

  "API Route Handler": {
    "prefix": "route",
    "body": [
      "import { Request, Response, NextFunction } from 'express';",
      "import { z } from 'zod';",
      "",
      "const ${1:schema} = z.object({",
      "  ${2:field}: z.string(),",
      "});",
      "",
      "export async function ${3:handlerName}(",
      "  req: Request,",
      "  res: Response,",
      "  next: NextFunction",
      ") {",
      "  try {",
      "    // Validate",
      "    const data = ${1:schema}.parse(req.body);",
      "",
      "    // Process",
      "    const result = await process${3/(.*)/${1:/capitalize}/}(data);",
      "",
      "    // Respond",
      "    res.json({",
      "      success: true,",
      "      data: result,",
      "    });",
      "  } catch (error) {",
      "    if (error instanceof z.ZodError) {",
      "      return res.status(400).json({",
      "        success: false,",
      "        error: 'Validation failed',",
      "        details: error.errors,",
      "      });",
      "    }",
      "    next(error);",
      "  }",
      "}",
      ""
    ],
    "description": "Create API route handler"
  }
}
```

---

## Common Patterns

### 1. Portfolio Calculation

```typescript
// Calculate P&L for position
function calculatePnL(position: Position): number {
  if (position.quantity <= 0) {
    throw new Error('Invalid quantity');
  }

  const priceDiff = position.currentPrice - position.purchasePrice;
  return priceDiff * position.quantity;
}

// Calculate total portfolio value
function calculatePortfolioValue(positions: Position[]): number {
  return positions.reduce((sum, pos) => {
    return sum + (pos.currentPrice * pos.quantity);
  }, 0);
}
```

### 2. API Error Handling

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError!;
}
```

### 3. React Performance

```typescript
// Memoized expensive calculation
const TotalValue: React.FC<{ positions: Position[] }> = React.memo(({ positions }) => {
  const total = useMemo(() => {
    return calculatePortfolioValue(positions);
  }, [positions]);

  return <Text>{total.toFixed(2)} PLN</Text>;
});

// Memoized callback
const handlePress = useCallback((symbol: string) => {
  navigation.navigate('StockDetail', { symbol });
}, [navigation]);
```

### 4. Database Query

```typescript
// Efficient query with Prisma
async function getUserPortfolio(userId: number) {
  return prisma.portfolio.findUnique({
    where: { userId },
    select: {
      id: true,
      positions: {
        select: {
          symbol: true,
          quantity: true,
          purchasePrice: true,
        },
        orderBy: { symbol: 'asc' },
      },
    },
  });
}
```

### 5. WebSocket Connection

```typescript
function useWebSocket(url: string, onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => console.log('Connected');
    ws.onmessage = (event) => onMessage(JSON.parse(event.data));
    ws.onerror = (error) => console.error('WS Error:', error);
    ws.onclose = () => console.log('Disconnected');

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [url, onMessage]);

  return wsRef;
}
```

---

## Command Line Shortcuts

### Git
```bash
# Quick commit (after staging)
alias gcm='git commit -m'

# Push current branch
alias gp='git push origin $(git branch --show-current)'

# Status
alias gs='git status'

# Checkout
alias gco='git checkout'
```

### npm
```bash
# Test shortcuts
alias t='npm test'
alias tw='npm test -- --watch'
alias tc='npm test -- --coverage'

# Lint
alias l='npm run lint'
alias lf='npm run lint -- --fix'

# Type check
alias tsc='npm run type-check'
```

### Project Specific
```bash
# Run all quality checks
alias qa='npm run lint && npm run type-check && npm test'

# Clean everything
alias clean='rm -rf node_modules && npm install'

# Dev mode all apps
alias dev='npm run dev'
```

---

## Claude Code Shortcuts

### Ask Specific Agent
```
@frontend-expert: [task]
@backend-expert: [task]
@ml-expert: [task]
@qa-expert: [task]
@devops-expert: [task]
```

### Use Slash Command
```
/setup-monorepo
/implement-dashboard
/add-tests
/debug-issue
```

### Quick Reviews
```
Review this code for:
- Performance issues
- Security vulnerabilities
- Best practices violations
```

---

## IDE Shortcuts (VS Code)

### Must-Know
- `Cmd+Shift+P`: Command palette
- `Cmd+P`: Quick file open
- `Cmd+Shift+F`: Search in files
- `Cmd+D`: Multi-cursor (select next match)
- `Alt+Up/Down`: Move line
- `Cmd+/`: Toggle comment
- `Cmd+Shift+L`: Select all occurrences

### TypeScript Specific
- `F12`: Go to definition
- `Shift+F12`: Find references
- `F2`: Rename symbol
- `Cmd+.`: Quick fix

### Testing
- `Cmd+Shift+T`: Run test file
- `Cmd+Shift+E`: Run test at cursor

---

## Keyboard Shortcuts Config

**`.vscode/keybindings.json`**
```json
[
  {
    "key": "cmd+shift+t",
    "command": "workbench.action.tasks.runTask",
    "args": "test:watch"
  },
  {
    "key": "cmd+shift+l",
    "command": "workbench.action.tasks.runTask",
    "args": "lint:fix"
  }
]
```

---

## Resources

- VS Code Snippets: https://code.visualstudio.com/docs/editor/userdefinedsnippets
- Oh My Zsh: https://ohmyz.sh/ (shell aliases)
- Project Quick Reference: `.claude/docs/quick-reference.md`

---

**Work Smarter, Not Harder** ⚡

*Ostatnia aktualizacja: 2025-10-25*
