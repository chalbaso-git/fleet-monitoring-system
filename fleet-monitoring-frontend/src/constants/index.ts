// API Endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
  GEOLOCATION: process.env.REACT_APP_GEOLOCATION_SERVICE_URL || 'http://localhost:8081',
  ROUTING: process.env.REACT_APP_ROUTING_SERVICE_URL || 'http://localhost:8082',
  AUDIT: process.env.REACT_APP_AUDIT_SERVICE_URL || 'http://localhost:8083',
  WEBSOCKET: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8084',
} as const;

// Application Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  GEOLOCATION: '/geolocation',
  ROUTING: '/routing',
  AUDIT: '/audit',
  MONITORING: '/monitoring',
  VEHICLES: '/vehicles',
  REPORTS: '/reports',
} as const;

// GPS Configuration
export const GPS_CONFIG = {
  UPDATE_INTERVAL: Number(process.env.REACT_APP_GPS_UPDATE_INTERVAL) || 2000,
  FAILURE_RATE: Number(process.env.REACT_APP_GPS_FAILURE_RATE) || 0.15,
  DATA_TTL: Number(process.env.REACT_APP_GPS_DATA_TTL) || 300000, // 5 minutes
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    LAT: Number(process.env.REACT_APP_MAP_DEFAULT_CENTER_LAT) || 4.570868,
    LNG: Number(process.env.REACT_APP_MAP_DEFAULT_CENTER_LNG) || -74.297333,
  },
  DEFAULT_ZOOM: Number(process.env.REACT_APP_MAP_DEFAULT_ZOOM) || 10,
  MIN_ZOOM: 5,
  MAX_ZOOM: 18,
} as const;

// Circuit Breaker Configuration
export const CIRCUIT_BREAKER_CONFIG = {
  FAILURE_THRESHOLD: Number(process.env.REACT_APP_CIRCUIT_BREAKER_THRESHOLD) || 3,
  TIMEOUT: Number(process.env.REACT_APP_CIRCUIT_BREAKER_TIMEOUT) || 30000, // 30 seconds
} as const;

// Vehicle Status
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  OFFLINE: 'offline',
} as const;

// Alert Types
export const ALERT_TYPES = {
  GPS_FAILURE: 'gps_failure',
  ROUTE_DEVIATION: 'route_deviation',
  CIRCUIT_BREAKER: 'circuit_breaker',
  NETWORK_ERROR: 'network_error',
  SYSTEM_ERROR: 'system_error',
} as const;

// Alert Severity
export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: '#1976d2',
    SECONDARY: '#dc004e',
    SUCCESS: '#2e7d32',
    WARNING: '#ed6c02',
    ERROR: '#d32f2f',
    INFO: '#0288d1',
  },
} as const;

// Polling Intervals
export const POLLING_INTERVALS = {
  VEHICLE_LOCATIONS: 5000, // 5 seconds
  SYSTEM_HEALTH: 10000, // 10 seconds
  CIRCUIT_BREAKER_STATUS: 3000, // 3 seconds
  AUDIT_LOGS: 30000, // 30 seconds
} as const;
