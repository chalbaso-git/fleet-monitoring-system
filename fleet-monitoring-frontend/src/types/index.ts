// Export all type modules
export * from './entities/alert';
export * from './entities/geolocation';
export * from './requests/alert';
export * from './requests/geolocation';
export * from './responses/alert';
export * from './responses/geolocation';
export * from './enums';

// Common types
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Geolocation types
export interface GPSCoordinate {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: string;
}

export interface VehicleLocation extends BaseEntity {
  vehicleId: string;
  coordinate: GPSCoordinate;
  speed?: number;
  heading?: number;
  status: VehicleStatus;
}

// Vehicle types
export interface Vehicle extends BaseEntity {
  name: string;
  licensePlate: string;
  model: string;
  year: number;
  status: VehicleStatus;
  currentLocation?: VehicleLocation;
  lastSeen?: string;
}

export type VehicleStatus = 'active' | 'inactive' | 'maintenance' | 'offline';

// Route types
export interface RoutePoint {
  latitude: number;
  longitude: number;
  order: number;
}

export interface Route extends BaseEntity {
  name: string;
  vehicleId: string;
  startPoint: GPSCoordinate;
  endPoint: GPSCoordinate;
  waypoints: RoutePoint[];
  estimatedDuration: number; // in minutes
  estimatedDistance: number; // in kilometers
  status: RouteStatus;
}

export type RouteStatus = 'planned' | 'active' | 'completed' | 'cancelled';

// Alert types
export interface Alert extends BaseEntity {
  vehicleId?: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  resolved: boolean;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

export type AlertType = 
  | 'gps_failure' 
  | 'route_deviation' 
  | 'circuit_breaker' 
  | 'network_error' 
  | 'system_error';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

// Audit types
export interface AuditLog extends BaseEntity {
  vehicleId?: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, any>;
  userId?: string;
  ipAddress?: string;
}

// System health types
export interface ServiceHealth {
  serviceName: string;
  status: ServiceStatus;
  uptime: number;
  lastCheck: string;
  responseTime?: number;
  errorRate?: number;
}

export type ServiceStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';

export interface CircuitBreakerStatus {
  serviceName: string;
  state: CircuitBreakerState;
  failureCount: number;
  lastFailure?: string;
  nextAttempt?: string;
}

export type CircuitBreakerState = 'closed' | 'open' | 'half-open';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// WebSocket types
export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: string;
}

export interface VehicleLocationUpdate extends WebSocketMessage {
  type: 'VEHICLE_LOCATION_UPDATE';
  payload: VehicleLocation;
}

export interface AlertUpdate extends WebSocketMessage {
  type: 'ALERT_UPDATE';
  payload: Alert;
}

export interface SystemHealthUpdate extends WebSocketMessage {
  type: 'SYSTEM_HEALTH_UPDATE';
  payload: ServiceHealth[];
}
