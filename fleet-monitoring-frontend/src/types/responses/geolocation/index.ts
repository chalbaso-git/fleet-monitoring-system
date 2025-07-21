import { GpsCoordinate, VehicleLocation, Geofence, VehicleTrackingStatus } from '@/types/entities/geolocation';

/**
 * Standard API response wrapper
 */
export interface GeolocationApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Response for successful coordinate storage
 */
export interface StoreCoordinateResponse {
  success: boolean;
  message: string;
  coordinateId?: string;
  processedAt: string;
}

/**
 * Vehicle locations response with metadata
 */
export interface VehicleLocationsResponse {
  vehicles: VehicleLocation[];
  totalCount: number;
  onlineCount: number;
  offlineCount: number;
  lastUpdated: string;
}

/**
 * Vehicle tracking history response
 */
export interface VehicleTrackingHistoryResponse {
  vehicleId: string;
  coordinates: GpsCoordinate[];
  totalDistance: number; // kilometers
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  totalDuration: number; // minutes
  startTime: string;
  endTime: string;
  stops: VehicleStop[];
}

/**
 * Vehicle stop information
 */
export interface VehicleStop {
  location: GpsCoordinate;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  address?: string;
}

/**
 * Geofence violations response
 */
export interface GeofenceViolationsResponse {
  violations: GeofenceViolation[];
  totalCount: number;
  summary: {
    byVehicle: Record<string, number>;
    byGeofence: Record<string, number>;
  };
}

/**
 * Geofence violation details
 */
export interface GeofenceViolation {
  id: string;
  vehicleId: string;
  geofenceId: string;
  geofenceName: string;
  violationType: 'enter' | 'exit';
  location: GpsCoordinate;
  timestamp: string;
  duration?: number; // minutes (for exit violations)
}

/**
 * Real-time tracking data
 */
export interface RealTimeTrackingResponse {
  vehicleId: string;
  location: GpsCoordinate;
  status: VehicleTrackingStatus;
  metadata: {
    speed: number;
    heading: number;
    accuracy: number;
    lastMovement: string;
  };
}

/**
 * Fleet overview response
 */
export interface FleetOverviewResponse {
  summary: {
    totalVehicles: number;
    onlineVehicles: number;
    movingVehicles: number;
    idleVehicles: number;
    offlineVehicles: number;
  };
  alerts: {
    geofenceViolations: number;
    lowBattery: number;
    gpsErrors: number;
    speedViolations: number;
  };
  recentActivity: RecentActivity[];
  lastUpdated: string;
}

/**
 * Recent fleet activity
 */
export interface RecentActivity {
  id: string;
  vehicleId: string;
  type: 'movement' | 'stop' | 'geofence' | 'alert';
  description: string;
  location?: GpsCoordinate;
  timestamp: string;
}

/**
 * Route optimization response
 */
export interface RouteOptimizationResponse {
  optimizedRoute: GpsCoordinate[];
  originalDistance: number; // kilometers
  optimizedDistance: number; // kilometers
  distanceSaved: number; // kilometers
  estimatedTimeSaved: number; // minutes
  waypoints: RouteWaypoint[];
}

/**
 * Route waypoint information
 */
export interface RouteWaypoint {
  location: GpsCoordinate;
  address?: string;
  estimatedArrival: string;
  stopDuration: number; // minutes
  order: number;
}

/**
 * Location analytics response
 */
export interface LocationAnalyticsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  metrics: {
    totalDistance: number; // kilometers
    totalDrivingTime: number; // minutes
    averageSpeed: number; // km/h
    fuelEfficiency: number; // km/liter
    idleTime: number; // minutes
  };
  patterns: {
    mostVisitedLocations: PopularLocation[];
    busyHours: HourlyActivity[];
    dailyActivity: DailyActivity[];
  };
}

/**
 * Popular location data
 */
export interface PopularLocation {
  location: GpsCoordinate;
  address?: string;
  visitCount: number;
  totalDuration: number; // minutes
  averageStayDuration: number; // minutes
}

/**
 * Hourly activity data
 */
export interface HourlyActivity {
  hour: number; // 0-23
  vehicleCount: number;
  totalDistance: number;
  averageSpeed: number;
}

/**
 * Daily activity data
 */
export interface DailyActivity {
  date: string;
  vehicleCount: number;
  totalDistance: number;
  totalDrivingTime: number;
  averageSpeed: number;
}

/**
 * Geofence analytics response
 */
export interface GeofenceAnalyticsResponse {
  geofence: Geofence;
  statistics: {
    totalEntries: number;
    totalExits: number;
    averageStayDuration: number; // minutes
    violationsCount: number;
  };
  vehicleActivity: VehicleGeofenceActivity[];
  timeline: GeofenceTimelineEvent[];
}

/**
 * Vehicle activity within geofence
 */
export interface VehicleGeofenceActivity {
  vehicleId: string;
  entries: number;
  exits: number;
  totalTimeInside: number; // minutes
  violations: number;
  lastEntry?: string;
  lastExit?: string;
}

/**
 * Geofence timeline event
 */
export interface GeofenceTimelineEvent {
  vehicleId: string;
  eventType: 'enter' | 'exit' | 'violation';
  timestamp: string;
  location: GpsCoordinate;
  duration?: number; // for exit events
}

// Export analytics utilities
export * from './analytics';
