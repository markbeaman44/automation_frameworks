## Common Patterns

### Helper Functions
Store reusable calculation/utility functions in a `helpers` file:

**TypeScript Example:**
```typescript
export type ConversionOption = 'multiply' | 'divide';

export function convertMilesToKm(option: ConversionOption, value: number): number {
  if (option === 'multiply') {
    return value * 1.60934;
  }
  if (option === 'divide') {
    return value / 1.60934;
  }
  throw new Error('Invalid conversion option');
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `user${timestamp}@example.com`;
}
```

**Python Example:**
```python
from typing import Literal
from datetime import datetime
import random
import string

ConversionOption = Literal['multiply', 'divide']

def convert_miles_to_km(option: ConversionOption, value: float) -> float:
    if option == 'multiply':
        return value * 1.60934
    if option == 'divide':
        return value / 1.60934
    raise ValueError('Invalid conversion option')

def format_date(date: datetime) -> str:
    return date.strftime('%Y-%m-%d')

def generate_random_email() -> str:
    timestamp = int(datetime.now().timestamp())
    return f"user{timestamp}@example.com"
```

### Constants File
Store base URLs, timeouts, and other constants:

**TypeScript Example (support/constant.ts):**
```typescript
export const BASE_URL = 'https://reqres.in';
export const DEFAULT_TIMEOUT = 10000;
export const MAX_RETRIES = 3;

export const USERS = {
  STANDARD: {
    username: 'standard_user',
    password: 'secret_sauce',
  },
  LOCKED: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
};

export const ENDPOINTS = {
  USERS: '/api/users',
  LOGIN: '/api/login',
  REGISTER: '/api/register',
};
```

**Python Example (support/constant.py):**
```python
BASE_URL = 'https://reqres.in'
DEFAULT_TIMEOUT = 10
MAX_RETRIES = 3

USERS = {
    'STANDARD': {
        'username': 'standard_user',
        'password': 'secret_sauce',
    },
    'LOCKED': {
        'username': 'locked_out_user',
        'password': 'secret_sauce',
    },
}

ENDPOINTS = {
    'USERS': '/api/users',
    'LOGIN': '/api/login',
    'REGISTER': '/api/register',
}
```

### Store Values Pattern
Use this pattern to share data between steps in Cucumber tests:

**TypeScript Example:**
```typescript
export interface ProductParams {
  name?: string;
  title?: string;
  price?: string;
  description?: string;
}

export const storeValues: ProductParams[] = [];

export function addProduct(product: ProductParams): void {
  storeValues.push(product);
}

export function getProduct(index: number): ProductParams {
  return storeValues[index];
}

export function clearProducts(): void {
  storeValues.length = 0;
}
```

**Python Example:**
```python
from typing import TypedDict, List, Optional

class ProductParams(TypedDict, total=False):
    name: str
    title: str
    price: str
    description: str

store_values: List[ProductParams] = []

def add_product(product: ProductParams) -> None:
    store_values.append(product)

def get_product(index: int) -> ProductParams:
    return store_values[index]

def clear_products() -> None:
    store_values.clear()
```
