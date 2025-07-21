/**
 * GPS and geolocation related constants
 */

// GPS coordinate validation ranges
export const GPS_BOUNDS = {
  LATITUDE: {
    MIN: -90,
    MAX: 90,
  },
  LONGITUDE: {
    MIN: -180,
    MAX: 180,
  },
} as const;

// GPS accuracy levels in meters
export const GPS_ACCURACY_LEVELS = {
  HIGH: 5, // Less than 5 meters
  MEDIUM: 20, // 5-20 meters
  LOW: 50, // More than 20 meters
} as const;

// Vehicle movement thresholds
export const MOVEMENT_THRESHOLDS = {
  STATIONARY_SPEED: 2, // km/h - below this is considered stationary
  MIN_DISTANCE_FOR_UPDATE: 0.01, // km - minimum distance to trigger location update
  GPS_UPDATE_TOLERANCE: 1e-6, // Tolerance for coordinate comparison
} as const;

// Geofence types and limits
export const GEOFENCE = {
  TYPES: ['circle', 'polygon'] as const,
  MAX_POLYGON_POINTS: 50,
  MIN_RADIUS: 10, // meters
  MAX_RADIUS: 50000, // meters (50km)
  DEFAULT_RADIUS: 100, // meters
} as const;

// Update intervals and timeouts
export const TRACKING_INTERVALS = {
  REAL_TIME_UPDATE: 5000, // 5 seconds
  NORMAL_UPDATE: 30000, // 30 seconds
  OFFLINE_TIMEOUT: 300000, // 5 minutes - consider vehicle offline
  POSITION_HISTORY_LIMIT: 100, // Keep last 100 positions
} as const;

// Map display settings
export const MAP_SETTINGS = {
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 5,
  MAX_ZOOM: 18,
  CLUSTER_RADIUS: 50, // pixels
  MARKER_COLORS: {
    ONLINE: '#4CAF50', // Green
    OFFLINE: '#F44336', // Red
    WARNING: '#FF9800', // Orange
    IDLE: '#9E9E9E', // Gray
  },
} as const;

// Battery levels
export const BATTERY_LEVELS = {
  CRITICAL: 10, // %
  LOW: 25, // %
  MEDIUM: 50, // %
  HIGH: 75, // %
} as const;

// Signal strength levels
export const SIGNAL_STRENGTH = {
  NO_SIGNAL: 0,
  WEAK: 25,
  MODERATE: 50,
  STRONG: 75,
  EXCELLENT: 100,
} as const;
