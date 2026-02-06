## Advanced Patterns

### Custom Assertions
```typescript
// helpers.ts
export function assertTextContains(actual: string, expected: string): void {
  if (!actual.includes(expected)) {
    throw new Error(`Expected "${actual}" to contain "${expected}"`);
  }
}

export function assertArrayLength(actual: any[], expectedLength: number): void {
  if (actual.length !== expectedLength) {
    throw new Error(`Expected array length ${expectedLength}, but got ${actual.length}`);
  }
}
```

### Retry Logic
```typescript
// helpers.ts
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Environment Configuration
```typescript
// constant.ts
export const ENV = process.env.NODE_ENV || 'staging';

export const CONFIG = {
  staging: {
    baseUrl: 'https://staging.example.com',
    apiUrl: 'https://api.staging.example.com',
  },
  production: {
    baseUrl: 'https://example.com',
    apiUrl: 'https://api.example.com',
  },
};

export const { baseUrl, apiUrl } = CONFIG[ENV as keyof typeof CONFIG];
```
