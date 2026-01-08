/**
 * Health Check Script for Docker Container
 * 
 * This script checks if the backend API is responding correctly.
 * Used by both Dockerfile HEALTHCHECK and docker-compose health checks.
 * 
 * Exit codes:
 * 0 - Healthy (API is responding)
 * 1 - Unhealthy (API is not responding or returned an error)
 */

const http = require('http');

const options = {
  host: '127.0.0.1',
  port: process.env.PORT || 5001,
  path: '/api/health',
  timeout: 3000,
  method: 'GET'
};

const healthCheck = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

healthCheck.on('error', () => {
  process.exit(1);
});

// Implement proper timeout
const timeoutId = setTimeout(() => {
  healthCheck.destroy();
  process.exit(1);
}, 3000);

healthCheck.on('response', () => {
  clearTimeout(timeoutId);
});

healthCheck.end();
