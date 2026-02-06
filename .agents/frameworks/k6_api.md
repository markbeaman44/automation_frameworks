### k6 (API Performance Testing)
**Latest Versions (as of 2026):**
- k6: Latest (installed via CLI, not npm)
- JavaScript: ES6+ (no TypeScript support in k6 natively)

**Breaking Changes to Note**:
- k6 uses its own JavaScript runtime (Goja), not Node.js
- Limited Node.js module support
- No TypeScript support without additional transpilation
- Different module system from Node.js

**Structure:**
```
api_k6/
├── package.json (for linting only)
├── .eslintrc.json
├── .prettierrc.cjs
├── .gitignore
├── README.md
└── tests/
    ├── api/
    │   ├── constant.js
    │   ├── helpers.js
    │   └── v1/
    │       ├── positions.js
    │       └── tles.js
    ├── e2e/
    │   └── v1/
    │       ├── positions.js
    │       └── tles.js
    └── fixtures/
        └── *.json
```

**Test Configuration (tests/api/constant.js):**
```javascript
export const baseUrl = 'https://api.wheretheiss.at';

export const DEFAULT_THRESHOLDS = {
  http_req_duration: ['p(95)<500'], // 95% of requests < 500ms
  http_req_failed: ['rate<0.1'], // < 10% failure rate
  http_reqs: ['rate>10'], // > 10 requests per second
};

export const SMOKE_TEST_OPTIONS = {
  vus: 1,
  duration: '10s',
  thresholds: DEFAULT_THRESHOLDS,
};

export const LOAD_TEST_OPTIONS = {
  vus: 10,
  duration: '30s',
  thresholds: DEFAULT_THRESHOLDS,
};
```

**Helper Functions (tests/api/helpers.js):**
```javascript
export function calculateValue(pickOption, value) {
  if (pickOption === 'multiply') {
    return value * 1.60934;
  }
  if (pickOption === 'divide') {
    return value / 1.60934;
  }
  throw new Error(`Invalid pickOption: ${pickOption}`);
}

export function buildQueryParams(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `?${queryString}` : '';
}
```

**API Function (tests/api/v1/positions.js):**
```javascript
import http from 'k6/http';
import { baseUrl } from '../constant.js';

export function getPositionsAPI(id, parameters = {}) {
  const queryString = buildQueryParams(parameters);
  const url = `${baseUrl}/v1/satellites/${id}/positions${queryString}`;
  
  const response = http.get(url, {
    tags: { name: 'GetPositions' },
  });
  
  return response;
}

function buildQueryParams(params) {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  return queryString ? `?${queryString}` : '';
}
```

**Test Example (tests/e2e/v1/positions.js):**
```javascript
import { check, sleep } from 'k6';
import { getPositionsAPI } from '../../api/v1/positions.js';
import { calculateValue } from '../../api/helpers.js';
import { SMOKE_TEST_OPTIONS } from '../../api/constant.js';

// Test configuration
export const options = SMOKE_TEST_OPTIONS;

export default function () {
  // Test valid position request
  testValidPositionRequest();
  
  // Test unit conversion
  testUnitConversion();
  
  sleep(1);
}

function testValidPositionRequest() {
  const response = getPositionsAPI('25544', { timestamps: '1436029892' });
  
  check(response, {
    'Valid request: status is 200': (r) => r.status === 200,
    'Valid request: response time < 500ms': (r) => r.timings.duration < 500,
    'Valid request: has response body': (r) => r.body.length > 0,
  });
}

function testUnitConversion() {
  const milesResponse = getPositionsAPI('25544', {
    timestamps: '1036029892',
    units: 'miles',
  });
  
  const kmResponse = getPositionsAPI('25544', {
    timestamps: '1036029892',
    units: 'kilometers',
  });
  
  check(milesResponse, {
    'Miles request: status is 200': (r) => r.status === 200,
  });
  
  check(kmResponse, {
    'Kilometers request: status is 200': (r) => r.status === 200,
  });
}
```

**package.json (for linting only):**
```json
{
  "name": "api_k6",
  "version": "1.0.0",
  "scripts": {
    "test": "k6 run tests/e2e/v1/positions.js",
    "test:load": "k6 run --vus 10 --duration 30s tests/e2e/v1/positions.js",
    "test:stress": "k6 run --vus 100 --duration 60s tests/e2e/v1/positions.js",
    "lint": "eslint '**/*.js' --quiet --fix",
    "format": "prettier --write '**/*.js'"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}
```

**Running k6 Tests:**
```bash
# Smoke test
k6 run tests/e2e/v1/positions.js

# Load test (10 VUs for 30s)
k6 run --vus 10 --duration 30s tests/e2e/v1/positions.js

# Stress test (100 VUs for 60s)
k6 run --vus 100 --duration 60s tests/e2e/v1/positions.js

# With stages (ramp pattern)
k6 run --stage 30s:10,1m:20,30s:0 tests/e2e/v1/positions.js

# Output to JSON for reporting
k6 run --out json=results.json tests/e2e/v1/positions.js
```

**Key k6 Concepts:**
- **VUs (Virtual Users)**: Concurrent users executing the test
- **Duration**: How long the test runs
- **Stages**: Ramp up/down patterns for load
- **Thresholds**: Pass/fail criteria for performance metrics
- **Checks**: Assertions (like tests, but don't stop execution)
- **Metrics**: Built-in performance metrics (http_req_duration, http_reqs, etc.)
