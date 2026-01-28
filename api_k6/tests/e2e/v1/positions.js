import { check, sleep } from 'k6';
import { getPositionsAPI } from '../../api/v1/positions.js';
import { calculateValue } from '../../api/helpers.js';
import { SMOKE_TEST_OPTIONS } from '../../api/constant.js';

// Test configuration
export const options = SMOKE_TEST_OPTIONS;

export default function () {
  // Test 1: Valid request returns 200
  testValidPositionRequest();
  
  // Test 2: Missing timestamps returns 400
  testMissingTimestamps();
  
  // Test 3: Invalid satellite ID returns 404
  testInvalidSatelliteId();
  
  // Test 4: Verify specific timestamp data
  testSpecificTimestampData();
  
  // Test 5: Multiple timestamps (within 10 limit)
  testMultipleTimestamps();
  
  // Test 6: Unit conversion validation
  testUnitConversion();
  
  sleep(1);
}

/**
 * Test valid position request returns 200
 */
function testValidPositionRequest() {
  const response = getPositionsAPI('25544', { timestamps: '1436029892' });
  
  check(response, {
    'Valid request: status is 200': (r) => r.status === 200,
    'Valid request: response time < 500ms': (r) => r.timings.duration < 500,
    'Valid request: has response body': (r) => r.body.length > 0,
  });
}

/**
 * Test missing timestamps parameter returns 400
 */
function testMissingTimestamps() {
  const response = getPositionsAPI('25544', {});
  
  check(response, {
    'Missing timestamps: status is 400': (r) => r.status === 400,
  });
}

/**
 * Test invalid satellite ID returns 404
 */
function testInvalidSatelliteId() {
  const response = getPositionsAPI('25543', { timestamps: '1436029892' });
  
  check(response, {
    'Invalid satellite ID: status is 404': (r) => r.status === 404,
  });
}

/**
 * Test specific timestamp data matches expected format
 */
function testSpecificTimestampData() {
  const response = getPositionsAPI('25544', { timestamps: '1436029902' });
  
  check(response, {
    'Specific timestamp: status is 200': (r) => r.status === 200,
    'Specific timestamp: response is array': (r) => {
      try {
        const data = JSON.parse(r.body);
        return Array.isArray(data);
      } catch {
        return false;
      }
    },
    'Specific timestamp: has required fields': (r) => {
      try {
        const data = JSON.parse(r.body);
        if (data.length === 0) return false;
        const item = data[0];
        return (
          item.hasOwnProperty('satid') &&
          item.hasOwnProperty('satlatitude') &&
          item.hasOwnProperty('satlongitude') &&
          item.hasOwnProperty('sataltitude')
        );
      } catch {
        return false;
      }
    },
  });
}

/**
 * Test multiple timestamps (within 10 limit)
 */
function testMultipleTimestamps() {
  const timestamps = [];
  for (let i = 1; i <= 5; i++) {
    timestamps.push(`${i}436029902`);
  }
  
  const response = getPositionsAPI('25544', { timestamps: timestamps.join(',') });
  
  check(response, {
    'Multiple timestamps: status is 200': (r) => r.status === 200,
    'Multiple timestamps: returns correct count': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.length === 5;
      } catch {
        return false;
      }
    },
  });
}

/**
 * Test unit conversion between miles and kilometers
 */
function testUnitConversion() {
  // Get position in miles
  const milesResponse = getPositionsAPI('25544', {
    timestamps: '1036029892',
    units: 'miles',
  });
  
  // Get position in kilometers
  const kmResponse = getPositionsAPI('25544', {
    timestamps: '1036029892',
    units: 'kilometers',
  });
  
  check(milesResponse, {
    'Miles request: status is 200': (r) => r.status === 200,
    'Miles request: units field is miles': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.length > 0 && data[0].units === 'miles';
      } catch {
        return false;
      }
    },
  });
  
  check(kmResponse, {
    'Kilometers request: status is 200': (r) => r.status === 200,
    'Kilometers request: units field is kilometers': (r) => {
      try {
        const data = JSON.parse(r.body);
        return data.length > 0 && data[0].units === 'kilometers';
      } catch {
        return false;
      }
    },
  });
  
  // Validate conversion calculation
  try {
    const milesData = JSON.parse(milesResponse.body);
    const kmData = JSON.parse(kmResponse.body);
    
    if (milesData.length > 0 && kmData.length > 0) {
      const milesAltitude = milesData[0].sataltitude;
      const kmAltitude = kmData[0].sataltitude;
      const convertedValue = calculateValue('divide', kmAltitude);
      const isConversionValid = Math.abs(milesAltitude - convertedValue) < 0.01;
      
      check(milesResponse, {
        'Unit conversion: calculation is correct': () => isConversionValid,
      });
    }
  } catch (error) {
    console.error('Unit conversion validation failed:', error);
  }
}
