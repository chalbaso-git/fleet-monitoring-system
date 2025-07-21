// Alert Types
export enum AlertType {
  GPS_FAILURE = 'gps_failure',
  ROUTE_DEVIATION = 'route_deviation',
  CIRCUIT_BREAKER = 'circuit_breaker',
  NETWORK_ERROR = 'network_error',
  SYSTEM_ERROR = 'system_error',
  MAINTENANCE_REQUIRED = 'maintenance_required',
  SPEED_VIOLATION = 'speed_violation',
  GEOFENCE_VIOLATION = 'geofence_violation',
  ENGINE_WARNING = 'engine_warning',
  FUEL_LOW = 'fuel_low',
}

// Alert Severity levels
export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Vehicle Status
export enum VehicleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline',
}

// Route Status
export enum RouteStatus {
  PLANNED = 'planned',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
}

// System Health Status
export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  UNHEALTHY = 'unhealthy',
  UNKNOWN = 'unknown',
}

// Circuit Breaker States
export enum CircuitBreakerState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half_open',
}

// WebSocket Event Types
export enum WebSocketEventType {
  VEHICLE_LOCATION_UPDATE = 'vehicle_location_update',
  ALERT_UPDATE = 'alert_update',
  SYSTEM_HEALTH_UPDATE = 'system_health_update',
  ROUTE_UPDATE = 'route_update',
  CIRCUIT_BREAKER_UPDATE = 'circuit_breaker_update',
}
