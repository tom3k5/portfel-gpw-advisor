# API Integration Template

Use this template when integrating external APIs (Polygon.io, X, Ortex).

## Service Structure

```typescript
// packages/logic/src/services/[ServiceName].ts
import axios, { AxiosInstance } from 'axios';

interface [ServiceName]Config {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
}

class [ServiceName]Service {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(config: [ServiceName]Config) {
    this.apiKey = config.apiKey;
    this.client = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add logging, rate limiting check
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors: retry logic, rate limits
        return this.handleError(error);
      }
    );
  }

  private async handleError(error: any) {
    // Error handling logic
    if (error.response?.status === 429) {
      // Rate limit exceeded
      throw new Error('Rate limit exceeded');
    }
    throw error;
  }

  async fetchData(params: any) {
    try {
      const response = await this.client.get('/endpoint', { params });
      return this.transformData(response.data);
    } catch (error) {
      console.error('[ServiceName] Error:', error);
      throw error;
    }
  }

  private transformData(rawData: any) {
    // Transform API response to app format
    return rawData;
  }
}

export const [serviceName]Service = new [ServiceName]Service({
  apiKey: process.env.[SERVICE]_API_KEY || '',
  baseUrl: process.env.[SERVICE]_BASE_URL || '',
});
```

## Error Handling Checklist
- [ ] Network errors (timeout, no connection)
- [ ] Rate limiting (429 status)
- [ ] Authentication errors (401, 403)
- [ ] Invalid data (validation)
- [ ] Retry logic with exponential backoff
- [ ] Logging for debugging

## Testing
```typescript
// Mock API responses
jest.mock('axios');

describe('[ServiceName]Service', () => {
  it('fetches data successfully', async () => {
    // Test implementation
  });

  it('handles rate limiting', async () => {
    // Test rate limit error
  });
});
```

## Environment Variables
Add to `.env`:
```
[SERVICE]_API_KEY=your_key_here
[SERVICE]_BASE_URL=https://api.example.com
```
