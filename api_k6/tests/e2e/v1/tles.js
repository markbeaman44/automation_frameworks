import { check, sleep } from 'k6';
import { getTlesAPI } from '../../api/v1/tles.js';
import { SMOKE_TEST_OPTIONS } from '../../api/constant.js';

// Test configuration
export const options = SMOKE_TEST_OPTIONS;

export default function () {
  // Test 1: Valid TLE request returns 200
  testValidTLERequest();
  
  // Test 2: Verify TLE data structure
  testTLEDataStructure();
  
  // Test 3: Invalid satellite ID returns 404
  testInvalidSatelliteId();
  
  // Test 4: Format parameter validation
  testFormatParameter();
  
  sleep(1);
}

/**
 * Test valid TLE request returns 200
 */
function testValidTLERequest() {
  const response = getTlesAPI('25544');
  
  check(response, {
    'Valid TLE request: status is 200': (r) => r.status === 200,
    'Valid TLE request: response time < 500ms': (r) => r.timings.duration < 500,
    'Valid TLE request: has response body': (r) => r.body.length > 0,
  });
}

/**
 * Test TLE data structure
 */
function testTLEDataStructure() {
  const response = getTlesAPI('25544');
  
  check(response, {
    'TLE structure: status is 200': (r) => r.status === 200,
    'TLE structure: response is object': (r) => {
      try {
        const data = JSON.parse(r.body);
        return typeof data === 'object' && !Array.isArray(data);
      } catch {
        return false;
      }
    },
    'TLE structure: has required fields': (r) => {
      try {
        const data = JSON.parse(r.body);
        return (
          data.hasOwnProperty('@context') &&
          data.hasOwnProperty('@id') &&
          data.hasOwnProperty('satelliteId') &&
          data.hasOwnProperty('name') &&
          data.hasOwnProperty('date') &&
          data.hasOwnProperty('line1') &&
          data.hasOwnProperty('line2')
        );
      } catch {
        return false;
      }
    },
    'TLE structure: satellite ID matches': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.satelliteId === 25544;
      } catch {
        return false;
      }
    },
  });
}

/**
 * Test invalid satellite ID returns 404
 */
function testInvalidSatelliteId() {
  const response = getTlesAPI('99999');
  
  check(response, {
    'Invalid satellite ID: status is 404': (r) => r.status === 404,
  });
}

/**
 * Test format parameter (JSON, text, XML)
 */
function testFormatParameter() {
  // Test JSON format (default)
  const jsonResponse = getTlesAPI('25544', { format: 'json' });
  
  check(jsonResponse, {
    'JSON format: status is 200': (r) => r.status === 200,
    'JSON format: content type is JSON': (r) => {
      const contentType = r.headers['Content-Type'] || r.headers['content-type'] || '';
      return contentType.includes('application/json');
    },
    'JSON format: valid JSON body': (r) => {
      try {
        JSON.parse(r.body);
        return true;
      } catch {
        return false;
      }
    },
  });
  
  // Test text format
  const textResponse = getTlesAPI('25544', { format: 'text' });
  
  check(textResponse, {
    'Text format: status is 200': (r) => r.status === 200,
    'Text format: has TLE lines': (r) => {
      return r.body.includes('ISS') && r.body.split('\n').length >= 3;
    },
  });
}
