/**
 * Route entity representing a calculated route for a vehicle - matches backend RouteDto
 */
export interface Route {
  id: number;
  vehicleId: string;
  path: string; // Serialized path data (coordinates, waypoints, etc.)
  distance: number; // Distance in kilometers
  calculatedAt: string; // ISO date string
}

/**
 * Extended route with additional metadata and parsed data
 */
export interface RouteWithMetadata extends Route {
  name?: string;
  description?: string;
  status: 'active' | 'completed' | 'cancelled' | 'planned';
  estimatedDuration?: number; // Minutes
  actualDuration?: number; // Minutes (when completed)
  startTime?: string;
  endTime?: string;
  waypoints: RouteWaypoint[];
  trafficConditions?: TrafficCondition[];
  fuelConsumption?: number; // Liters
  createdBy?: string;
  updatedAt?: string;
}

/**
 * Route waypoint with detailed information
 */
export interface RouteWaypoint {
  id: string;
  latitude: number;
  longitude: number;
  address?: string;
  type: 'start' | 'waypoint' | 'stop' | 'destination';
  arrivalTime?: string;
  departureTime?: string;
  stopDuration?: number; // Minutes
  order: number;
  isCompleted: boolean;
  notes?: string;
}

/**
 * Traffic condition information
 */
export interface TrafficCondition {
  segmentId: string;
  severity: 'light' | 'moderate' | 'heavy' | 'severe';
  description: string;
  expectedDelay: number; // Minutes
  coordinates: Array<{ latitude: number; longitude: number }>;
  reportedAt: string;
  source: 'automatic' | 'manual' | 'third_party';
}

/**
 * Route optimization parameters
 */
export interface RouteOptimization {
  criteria: 'shortest' | 'fastest' | 'fuel_efficient' | 'avoid_traffic';
  avoidTolls: boolean;
  avoidHighways: boolean;
  vehicleType: 'car' | 'truck' | 'van' | 'motorcycle';
  maxSpeed?: number; // km/h
  breakDuration?: number; // Minutes for mandatory breaks
  workingHours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
}

/**
 * Route performance metrics
 */
export interface RoutePerformance {
  routeId: number;
  plannedDistance: number;
  actualDistance: number;
  plannedDuration: number; // Minutes
  actualDuration: number; // Minutes
  fuelEfficiency: number; // km/liter
  averageSpeed: number; // km/h
  deviations: RouteDeviation[];
  completionRate: number; // Percentage
  punctuality: number; // Percentage (on-time arrivals)
}

/**
 * Route deviation from planned path
 */
export interface RouteDeviation {
  id: string;
  type: 'detour' | 'stop' | 'delay' | 'speed_violation';
  description: string;
  location: { latitude: number; longitude: number };
  timestamp: string;
  impact: 'minor' | 'moderate' | 'major';
  additionalDistance?: number; // km
  additionalTime?: number; // minutes
  reason?: string;
}

/**
 * Route template for recurring routes
 */
export interface RouteTemplate {
  id: string;
  name: string;
  description?: string;
  vehicleTypes: string[]; // Compatible vehicle types
  waypoints: Omit<RouteWaypoint, 'id' | 'isCompleted'>[];
  estimatedDistance: number;
  estimatedDuration: number;
  optimization: RouteOptimization;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Multi-vehicle route planning
 */
export interface MultiVehicleRoute {
  id: string;
  name: string;
  vehicleRoutes: Array<{
    vehicleId: string;
    route: RouteWithMetadata;
    priority: 'high' | 'medium' | 'low';
    dependencies?: string[]; // Other vehicle IDs this route depends on
  }>;
  coordinationPoints: Array<{
    location: { latitude: number; longitude: number };
    scheduledTime: string;
    involvedVehicles: string[];
    purpose: 'meeting' | 'handover' | 'checkpoint';
  }>;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

/**
 * Route cost analysis
 */
export interface RouteCostAnalysis {
  routeId: number;
  fuelCost: number;
  tollCost: number;
  driverCost: number; // Labor cost
  vehicleWearCost: number; // Depreciation and maintenance
  timeCost: number; // Opportunity cost
  totalCost: number;
  costPerKm: number;
  currency: string;
  calculatedAt: string;
}

/**
 * Real-time route tracking
 */
export interface RouteTracking {
  routeId: number;
  vehicleId: string;
  currentWaypoint: number;
  completedWaypoints: number[];
  estimatedArrival: string;
  distanceRemaining: number;
  timeRemaining: number; // Minutes
  currentSpeed: number;
  isOnSchedule: boolean;
  delayMinutes: number;
  lastUpdate: string;
}

// Export constants and utilities
export * from './constants';
export * from './utils';
