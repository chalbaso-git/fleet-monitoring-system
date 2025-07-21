import { environmentConfig } from '../config/environment';

// API Endpoints - Using environment configuration
export const API_ENDPOINTS = {
  BASE_URL: environmentConfig.apiBaseUrl,
  GEOLOCATION: environmentConfig.geolocationServiceUrl,
  ROUTING: environmentConfig.routingServiceUrl,
  AUDIT: environmentConfig.auditServiceUrl,
  WEBSOCKET: environmentConfig.websocketUrl,
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

// GPS Configuration - Using environment configuration
export const GPS_CONFIG = {
  UPDATE_INTERVAL: environmentConfig.gpsConfig.updateInterval,
  FAILURE_RATE: environmentConfig.gpsConfig.failureRate,
  DATA_TTL: environmentConfig.gpsConfig.dataTtl,
} as const;

// Map Configuration - Using environment configuration  
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    LAT: environmentConfig.mapConfig.defaultCenter.lat,
    LNG: environmentConfig.mapConfig.defaultCenter.lng,
  },
  DEFAULT_ZOOM: environmentConfig.mapConfig.defaultZoom,
  MIN_ZOOM: 5,
  MAX_ZOOM: 18,
} as const;

// Circuit Breaker Configuration - Using environment configuration
export const CIRCUIT_BREAKER_CONFIG = {
  FAILURE_THRESHOLD: environmentConfig.circuitBreakerConfig.failureThreshold,
  TIMEOUT: environmentConfig.circuitBreakerConfig.timeout,
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
