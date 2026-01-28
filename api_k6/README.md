## Installation
```
Install Node: https://nodejs.org/en/download/
```

## Project Setup
In terminal, navigate to project root folder, then type:
```
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suite
```bash
# Positions endpoint tests
npm run test:positions

# TLE endpoint tests
npm run test:tles
```

### Run Different Test Types

#### Smoke Test (1 VU, 10s)
```bash
npm run test:smoke
# or
k6 run tests/e2e/v1/positions.js
```

#### Load Test (10 VUs, 30s)
```bash
npm run test:load
# or
k6 run --vus 10 --duration 30s tests/e2e/v1/positions.js
```

#### Stress Test (Ramp up to 100 VUs)
```bash
npm run test:stress
# or
k6 run --vus 100 --duration 60s tests/e2e/v1/positions.js
```

#### Spike Test (Traffic Spikes)
```bash
npm run test:spike
# or
k6 run --stage 10s:0,5s:100,10s:0 tests/e2e/v1/positions.js
```

### Custom Test Execution

#### Run with Custom VUs and Duration
```bash
k6 run --vus 50 --duration 2m tests/e2e/v1/positions.js
```

#### Run with Stages (Ramp Pattern)
```bash
k6 run --stage 30s:10,1m:20,30s:0 tests/e2e/v1/positions.js
```

#### Run with JSON Output
```bash
npm run test:html
# or
k6 run --out json=results.json tests/e2e/v1/positions.js
```

## Performance Thresholds

Default thresholds configured in `tests/api/constant.js`:

```javascript
{
  http_req_duration: ['p(95)<500'],    // 95% of requests < 500ms
  http_req_failed: ['rate<0.1'],       // < 10% failure rate
  http_reqs: ['rate>10'],              // > 10 requests per second
}
```

## Linting and Formatting

### Run Linter
```bash
npm run lint
```

## Test Configuration Examples

### Smoke Test Configuration
```javascript
export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};
```

### Load Test Configuration
```javascript
export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
    http_reqs: ['rate>10'],
  },
};
```

### Stress Test Configuration
```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 10 },
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '5m', target: 0 },
  ],
};
```
