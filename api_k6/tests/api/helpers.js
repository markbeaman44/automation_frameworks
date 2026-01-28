export function calculateValue(pickOption, value) {
  if (pickOption === 'multiply') {
    return value * 1.60934;
  }
  if (pickOption === 'divide') {
    return value / 1.60934;
  }
  throw new Error(`Invalid pickOption: ${pickOption}`);
}

export function validateStatusCode(response, expectedStatus) {
  return response.status === expectedStatus;
}

export function validateResponseTime(duration, threshold) {
  return duration < threshold;
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

export function formatErrorMessage(testName, expected, actual) {
  return `${testName} failed: expected ${expected}, got ${actual}`;
}
