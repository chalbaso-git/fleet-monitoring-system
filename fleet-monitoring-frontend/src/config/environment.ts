// Environment Configuration Manager
export interface EnvironmentConfig {
  apiBaseUrl: string;
  geolocationServiceUrl: string;
  routingServiceUrl: string;
  auditServiceUrl: string;
  websocketUrl: string;
  env: 'development' | 'production' | 'test';
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  gpsConfig: {
    updateInterval: number;
    failureRate: number;
    dataTtl: number;
  };
  mapConfig: {
    defaultCenter: {
      lat: number;
      lng: number;
    };
    defaultZoom: number;
  };
  circuitBreakerConfig: {
    failureThreshold: number;
    timeout: number;
  };
  httpsConfig: {
    enabled: boolean;
    rejectUnauthorized: boolean;
  };
}

// Get current environment configuration
export const getEnvironmentConfig = (): EnvironmentConfig => {
  return {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://localhost:5001',
    geolocationServiceUrl: process.env.REACT_APP_GEOLOCATION_SERVICE_URL || 'https://localhost:5001',
    routingServiceUrl: process.env.REACT_APP_ROUTING_SERVICE_URL || 'https://localhost:5001',
    auditServiceUrl: process.env.REACT_APP_AUDIT_SERVICE_URL || 'https://localhost:5001',
    websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || 'wss://localhost:5001/hubs/monitoring',
    env: (process.env.REACT_APP_ENV as any) || 'development',
    logLevel: (process.env.REACT_APP_LOG_LEVEL as any) || 'debug',
    gpsConfig: {
      updateInterval: Number(process.env.REACT_APP_GPS_UPDATE_INTERVAL) || 2000,
      failureRate: Number(process.env.REACT_APP_GPS_FAILURE_RATE) || 0.15,
      dataTtl: Number(process.env.REACT_APP_GPS_DATA_TTL) || 300000,
    },
    mapConfig: {
      defaultCenter: {
        lat: Number(process.env.REACT_APP_MAP_DEFAULT_CENTER_LAT) || 4.570868,
        lng: Number(process.env.REACT_APP_MAP_DEFAULT_CENTER_LNG) || -74.297333,
      },
      defaultZoom: Number(process.env.REACT_APP_MAP_DEFAULT_ZOOM) || 10,
    },
    circuitBreakerConfig: {
      failureThreshold: Number(process.env.REACT_APP_CIRCUIT_BREAKER_THRESHOLD) || 3,
      timeout: Number(process.env.REACT_APP_CIRCUIT_BREAKER_TIMEOUT) || 30000,
    },
    httpsConfig: {
      enabled: process.env.NODE_ENV === 'production' || process.env.HTTPS === 'true',
      rejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
    },
  };
};

// Current environment configuration instance
export const environmentConfig = getEnvironmentConfig();

// Development helpers
export const isDevelopment = () => environmentConfig.env === 'development';
export const isProduction = () => environmentConfig.env === 'production';
export const isHttpsEnabled = () => environmentConfig.httpsConfig.enabled;

// Logging helper based on environment
export const logger = {
  debug: (...args: any[]) => {
    if (environmentConfig.logLevel === 'debug' && isDevelopment()) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (['debug', 'info'].includes(environmentConfig.logLevel)) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (['debug', 'info', 'warn'].includes(environmentConfig.logLevel)) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

// Validate environment configuration
export const validateEnvironmentConfig = (): boolean => {
  const config = environmentConfig;
  
  if (!config.apiBaseUrl) {
    logger.error('API Base URL is not configured');
    return false;
  }
  
  if (!config.websocketUrl) {
    logger.error('WebSocket URL is not configured');
    return false;
  }
  
  logger.info('Environment configuration validated successfully', {
    env: config.env,
    apiBaseUrl: config.apiBaseUrl,
    websocketUrl: config.websocketUrl,
  });
  
  return true;
};
