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

export function getTlesAPI(id, parameters = {}) {
  const queryString = buildQueryParams(parameters);
  const url = `${baseUrl}/v1/satellites/${id}/tles${queryString}`;
  
  const response = http.get(url, {
    tags: { name: 'GetTLEs' },
  });
  
  return response;
}
