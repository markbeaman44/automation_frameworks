import http from 'k6/http';
import { baseUrl } from '../constant.js';

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

export function getPositionsAPI(id, parameters = {}) {
  const queryString = buildQueryParams(parameters);
  const url = `${baseUrl}/v1/satellites/${id}/positions${queryString}`;
  
  const response = http.get(url, {
    tags: { name: 'GetPositions' },
  });
  
  return response;
}
