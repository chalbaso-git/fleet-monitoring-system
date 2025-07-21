/**
 * GPS Coordinate entity representing a vehicle's location at a specific time
 */
export interface GpsCoordinate {
  vehicleId: string;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO date string
}

/**
 * Extended GPS coordinate with additional metadata
 */
export interface GpsCoordinateWithMetadata extends GpsCoordinate {
  id?: string;
  accuracy?: number; // GPS accuracy in meters
  speed?: number; // Speed in km/h
  heading?: number; // Direction in degrees (0-360)
  altitude?: number; // Altitude in meters
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Vehicle location with calculated distance and movement data
 */
export interface VehicleLocation {
  vehicleId: string;
  currentPosition: GpsCoordinate;
  previousPosition?: GpsCoordinate;
  distanceTraveled?: number; // Distance in kilometers since last update
  isMoving: boolean;
  lastUpdated: string;
}

/**
 * Geofence boundary definition
 */
export interface Geofence {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  center?: { latitude: number; longitude: number }; // For circle type
  radius?: number; // For circle type, in meters
  coordinates?: Array<{ latitude: number; longitude: number }>; // For polygon type
  vehicleIds: string[]; // Vehicles assigned to this geofence
  isActive: boolean;
  createdAt: string;
}

/**
 * Vehicle tracking status
 */
export interface VehicleTrackingStatus {
  vehicleId: string;
  isOnline: boolean;
  lastSeenAt: string;
  batteryLevel?: number;
  signalStrength?: number;
  gpsStatus: 'active' | 'inactive' | 'error';
  locationAccuracy: 'high' | 'medium' | 'low';
}

// Export constants and utilities
export * from './constants';
export * from './utils';
