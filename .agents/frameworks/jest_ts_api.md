### Jest + TypeScript (API Testing)
**Latest Versions (as of 2026):**
- jest: ^29.x.x (or latest)
- ts-jest: ^29.x.x
- @types/jest: ^29.x.x
- axios: ^1.x.x
- typescript: ^5.x.x

**Structure:**
```
api_jest/
├── jest.config.ts
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc.cjs
├── README.md
└── tests/
    ├── api/
    │   ├── *.test.ts
    │   ├── helpers.ts
    │   ├── constant.ts
    │   └── types/
    │       └── interface.ts
    └── fixtures/
        └── *.json
```

**jest.config.ts:**
```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'tests/**/*.ts',
    '!tests/**/*.d.ts',
    '!tests/**/types/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};

export default config;
```

**Type Definitions (tests/api/types/interface.ts):**
```typescript
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface ApiResponse<T> {
  data: T;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}

export interface CreateUserRequest {
  name: string;
  job: string;
}

export interface CreateUserResponse extends CreateUserRequest {
  id: string;
  createdAt: string;
}
```

**Helper Functions (tests/api/helpers.ts):**
```typescript
import axios, { AxiosResponse } from 'axios';
import { BASE_URL } from './constant';

export async function getRequest<T>(endpoint: string): Promise<AxiosResponse<T>> {
  return await axios.get(`${BASE_URL}${endpoint}`);
}

export async function postRequest<T, R>(endpoint: string, data: T): Promise<AxiosResponse<R>> {
  return await axios.post(`${BASE_URL}${endpoint}`, data);
}

export async function putRequest<T, R>(endpoint: string, data: T): Promise<AxiosResponse<R>> {
  return await axios.put(`${BASE_URL}${endpoint}`, data);
}

export async function deleteRequest<T>(endpoint: string): Promise<AxiosResponse<T>> {
  return await axios.delete(`${BASE_URL}${endpoint}`);
}
```

**Test Example (tests/api/users.test.ts):**
```typescript
import { getRequest, postRequest } from './helpers';
import { User, ApiResponse, CreateUserRequest, CreateUserResponse } from './types/interface';

describe('Users API', () => {
  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const response = await getRequest<ApiResponse<User[]>>('/api/users?page=1');
      
      expect(response.status).toBe(200);
      expect(response.data.data).toBeInstanceOf(Array);
      expect(response.data.data.length).toBeGreaterThan(0);
      expect(response.data.page).toBe(1);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData: CreateUserRequest = {
        name: 'John Doe',
        job: 'Developer'
      };
      
      const response = await postRequest<CreateUserRequest, CreateUserResponse>('/api/users', userData);
      
      expect(response.status).toBe(201);
      expect(response.data.name).toBe(userData.name);
      expect(response.data.job).toBe(userData.job);
      expect(response.data.id).toBeDefined();
      expect(response.data.createdAt).toBeDefined();
    });
  });
});
```
