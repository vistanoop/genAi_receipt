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
  host: 'localhost',
  port: process.env.PORT || 5000,
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

healthCheck.on('timeout', () => {
  process.exit(1);
});

healthCheck.end();
