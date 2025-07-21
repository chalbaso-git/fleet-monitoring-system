// Type aliases for union types
export type WaypointType = 'start' | 'waypoint' | 'stop' | 'destination';
export type OptimizationCriteria = 'shortest' | 'fastest' | 'fuel_efficient' | 'avoid_traffic';
export type VehicleType = 'car' | 'truck' | 'van' | 'motorcycle';

/**
 * Request DTO for adding a route - matches backend RouteDto
 */
export interface AddRouteRequest {
  vehicleId: string;
  path: string; // Serialized path data
  distance: number; // Distance in kilometers
  calculatedAt: string; // ISO date string
}

// Additional request types for route management
export interface GetRoutesByVehicleAndDateRequest {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  includeWaypoints?: boolean;
}

/**
 * Enhanced route creation request with additional parameters
 */
export interface CreateRouteRequest {
  vehicleId: string;
  name?: string;
  description?: string;
  waypoints: Array<{
    latitude: number;
    longitude: number;
    address?: string;
    type?: WaypointType;
    stopDuration?: number; // Minutes
    notes?: string;
  }>;
  optimization?: {
    criteria: OptimizationCriteria;
    avoidTolls?: boolean;
    avoidHighways?: boolean;
    vehicleType?: VehicleType;
  };
  scheduledStartTime?: string;
  maxDuration?: number; // Minutes
}

/**
 * Route history query parameters - matches backend GetRoutesByVehicleAndDate
 */
export interface RouteHistoryFilters {
  vehicleId: string;
  from: string; // ISO date string
  to: string; // ISO date string
  includeDetails?: boolean;
  sortBy?: 'calculatedAt' | 'distance' | 'duration';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Route optimization request
 */
export interface OptimizeRouteRequest {
  vehicleId: string;
  waypoints: Array<{
    latitude: number;
    longitude: number;
    address?: string;
    stopDuration?: number;
  }>;
  constraints?: {
    maxDistance?: number; // km
    maxDuration?: number; // minutes
    workingHours?: {
      start: string; // HH:MM
      end: string; // HH:MM
    };
    breaks?: Array<{
      afterHours: number;
      duration: number; // minutes
    }>;
  };
  preferences?: {
    criteria: 'shortest' | 'fastest' | 'fuel_efficient' | 'balanced';
    avoidTolls: boolean;
    avoidHighways: boolean;
    allowUTurns: boolean;
  };
}

/**
 * Bulk route creation request
 */
export interface BulkRouteRequest {
  routes: CreateRouteRequest[];
  validateAll?: boolean; // Validate all routes before creating any
  continueOnError?: boolean; // Continue creating routes even if some fail
}

/**
 * Route template creation request
 */
export interface CreateRouteTemplateRequest {
  name: string;
  description?: string;
  category: 'delivery' | 'pickup' | 'maintenance' | 'emergency' | 'regular_service' | 'custom';
  vehicleTypes: string[];
  waypoints: Array<{
    latitude: number;
    longitude: number;
    address?: string;
    type: 'start' | 'waypoint' | 'stop' | 'destination';
    stopDuration?: number;
    notes?: string;
  }>;
  optimization: {
    criteria: 'shortest' | 'fastest' | 'fuel_efficient' | 'avoid_traffic';
    avoidTolls: boolean;
    avoidHighways: boolean;
    vehicleType: 'car' | 'truck' | 'van' | 'motorcycle';
  };
  tags?: string[];
}

/**
 * Multi-vehicle route planning request
 */
export interface MultiVehicleRouteRequest {
  name: string;
  vehicleAssignments: Array<{
    vehicleId: string;
    waypoints: Array<{
      latitude: number;
      longitude: number;
      address?: string;
      stopDuration?: number;
    }>;
    priority: 'high' | 'medium' | 'low';
    timeWindow?: {
      earliestStart: string;
      latestStart: string;
      maxDuration: number;
    };
  }>;
  coordinationPoints?: Array<{
    latitude: number;
    longitude: number;
    scheduledTime: string;
    involvedVehicles: string[];
    purpose: 'meeting' | 'handover' | 'checkpoint';
  }>;
  globalConstraints?: {
    maxTotalDistance: number;
    maxTotalDuration: number;
    synchronizationTolerance: number; // minutes
  };
}

/**
 * Route update request
 */
export interface UpdateRouteRequest {
  id: number;
  vehicleId?: string;
  path?: string;
  distance?: number;
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'cancelled' | 'planned';
  waypoints?: Array<{
    id?: string;
    latitude: number;
    longitude: number;
    address?: string;
    type: 'start' | 'waypoint' | 'stop' | 'destination';
    stopDuration?: number;
    notes?: string;
    isCompleted?: boolean;
  }>;
}

/**
 * Route search and filtering request
 */
export interface RouteSearchFilters {
  vehicleIds?: string[];
  status?: Array<'active' | 'completed' | 'cancelled' | 'planned'>;
  dateRange?: {
    from: string;
    to: string;
  };
  distanceRange?: {
    min: number;
    max: number;
  };
  durationRange?: {
    min: number; // minutes
    max: number; // minutes
  };
  boundingBox?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  tags?: string[];
  textSearch?: string; // Search in name, description, addresses
  includeTemplates?: boolean;
  sortBy?: 'calculatedAt' | 'distance' | 'duration' | 'name';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Route performance analysis request
 */
export interface RoutePerformanceRequest {
  routeId: number;
  includeDeviations?: boolean;
  includeTrafficData?: boolean;
  includeWeatherData?: boolean;
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
}

/**
 * Route comparison request
 */
export interface RouteComparisonRequest {
  routeIds: number[];
  comparisonMetrics: Array<'distance' | 'duration' | 'cost' | 'efficiency' | 'punctuality'>;
  includeVisualization?: boolean;
}

/**
 * Real-time route tracking subscription request
 */
export interface RouteTrackingRequest {
  routeId: number;
  updateInterval?: number; // milliseconds
  includeETA?: boolean;
  includeTraffic?: boolean;
  alertThresholds?: {
    delayMinutes?: number;
    deviationDistance?: number; // km
    speedLimits?: {
      min: number;
      max: number;
    };
  };
}

/**
 * Route sharing/collaboration request
 */
export interface RouteShareRequest {
  routeId: number;
  shareWith: string[]; // User IDs or email addresses
  permissions: Array<'view' | 'edit' | 'track'>;
  expiresAt?: string; // ISO date string
  message?: string;
}

// Export validation utilities
// Validation functions available but not exported as a module
