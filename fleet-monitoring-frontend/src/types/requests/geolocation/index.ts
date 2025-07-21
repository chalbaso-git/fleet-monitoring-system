/**
 * Request DTO for storing GPS coordinates - matches backend GpsCoordinateDto
 */
export interface StoreCoordinateRequest {
  vehicleId: string;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO date string
}

/**
 * Enhanced coordinate request with additional metadata
 */
export interface EnhancedCoordinateRequest extends StoreCoordinateRequest {
  accuracy?: number; // GPS accuracy in meters
  speed?: number; // Speed in km/h
  heading?: number; // Direction in degrees (0-360)
  altitude?: number; // Altitude in meters
  batteryLevel?: number; // Device battery level percentage
  signalStrength?: number; // Signal strength percentage
}

/**
 * Bulk coordinate storage request
 */
export interface BulkCoordinateRequest {
  coordinates: StoreCoordinateRequest[];
  vehicleId: string;
}

/**
 * Vehicle tracking subscription request
 */
export interface TrackingSubscriptionRequest {
  vehicleIds: string[];
  updateInterval?: number; // Milliseconds between updates
  includeHistory?: boolean;
}

/**
 * Geofence creation request
 */
export interface CreateGeofenceRequest {
  name: string;
  type: 'circle' | 'polygon';
  center?: { latitude: number; longitude: number }; // Required for circle
  radius?: number; // Required for circle, in meters
  coordinates?: Array<{ latitude: number; longitude: number }>; // Required for polygon
  vehicleIds: string[];
  isActive?: boolean;
}

/**
 * Update geofence request
 */
export interface UpdateGeofenceRequest extends Partial<CreateGeofenceRequest> {
  id: string;
}

/**
 * Vehicle location query filters
 */
export interface LocationQueryFilters {
  vehicleIds?: string[];
  startDate?: string;
  endDate?: string;
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  includeOffline?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Route analysis request
 */
export interface RouteAnalysisRequest {
  vehicleId: string;
  startDate: string;
  endDate: string;
  includeStops?: boolean;
  minimumStopDuration?: number; // Minutes
}

// Export validation utilities
export * from './validation';
