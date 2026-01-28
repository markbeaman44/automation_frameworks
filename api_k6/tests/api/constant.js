export const baseUrl = 'https://api.wheretheiss.at';

export const DEFAULT_THRESHOLDS = {
  http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  http_req_failed: ['rate<0.1'], // Less than 10% of requests should fail
  http_reqs: ['rate>10'], // Minimum 10 requests per second
};

export const LOAD_TEST_OPTIONS = {
  vus: 10, // 10 virtual users
  duration: '30s', // Run for 30 seconds
  thresholds: DEFAULT_THRESHOLDS,
};

export const STRESS_TEST_OPTIONS = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '5m', target: 0 }, // Ramp down to 0 users
  ],
  thresholds: DEFAULT_THRESHOLDS,
};

export const SMOKE_TEST_OPTIONS = {
  vus: 1, // 1 virtual user
  duration: '10s', // Run for 10 seconds
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests < 1000ms (more lenient for smoke test)
    http_req_failed: ['rate<0.5'], // Less than 50% of requests should fail (smoke test validates functionality)
  },
};

export const SPIKE_TEST_OPTIONS = {
  stages: [
    { duration: '10s', target: 0 }, // Start at 0 users
    { duration: '5s', target: 100 }, // Spike to 100 users
    { duration: '10s', target: 0 }, // Drop back to 0 users
  ],
  thresholds: DEFAULT_THRESHOLDS,
};
