/**
 * Route-related constants and configuration
 */

// Route status types
export const ROUTE_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PLANNED: 'planned',
} as const;

// Waypoint types
export const WAYPOINT_TYPES = {
  START: 'start',
  WAYPOINT: 'waypoint',
  STOP: 'stop',
  DESTINATION: 'destination',
} as const;

// Route optimization criteria
export const OPTIMIZATION_CRITERIA = {
  SHORTEST: 'shortest',
  FASTEST: 'fastest',
  FUEL_EFFICIENT: 'fuel_efficient',
  AVOID_TRAFFIC: 'avoid_traffic',
} as const;

// Vehicle types for route planning
export const VEHICLE_TYPES = {
  CAR: 'car',
  TRUCK: 'truck',
  VAN: 'van',
  MOTORCYCLE: 'motorcycle',
} as const;

// Traffic severity levels
export const TRAFFIC_SEVERITY = {
  LIGHT: 'light',
  MODERATE: 'moderate',
  HEAVY: 'heavy',
  SEVERE: 'severe',
} as const;

// Route deviation types
export const DEVIATION_TYPES = {
  DETOUR: 'detour',
  STOP: 'stop',
  DELAY: 'delay',
  SPEED_VIOLATION: 'speed_violation',
} as const;

// Route planning limits and defaults
export const ROUTE_LIMITS = {
  MAX_WAYPOINTS: 25,
  MAX_DISTANCE_KM: 2000, // 2000 km max route length
  MIN_DISTANCE_KM: 0.1, // 100 meters minimum
  MAX_DURATION_HOURS: 48, // 48 hours max driving time
  DEFAULT_SPEED_KMH: 50,
  MAX_SPEED_KMH: 130,
  MIN_STOP_DURATION_MINUTES: 5,
  MAX_STOP_DURATION_MINUTES: 480, // 8 hours
} as const;

// Fuel consumption rates by vehicle type (liters per 100km)
export const FUEL_CONSUMPTION_RATES = {
  [VEHICLE_TYPES.CAR]: 8,
  [VEHICLE_TYPES.VAN]: 12,
  [VEHICLE_TYPES.TRUCK]: 25,
  [VEHICLE_TYPES.MOTORCYCLE]: 4,
} as const;

// Average speeds by road type (km/h)
export const ROAD_SPEEDS = {
  HIGHWAY: 100,
  ARTERIAL: 60,
  COLLECTOR: 40,
  LOCAL: 30,
  RESIDENTIAL: 25,
} as const;

// Route planning tolerances
export const ROUTE_TOLERANCES = {
  ARRIVAL_TIME_MINUTES: 15, // Consider on-time if within 15 minutes
  DISTANCE_DEVIATION_PERCENT: 10, // Allow 10% distance deviation
  WAYPOINT_RADIUS_METERS: 100, // Waypoint completion radius
  SPEED_TOLERANCE_PERCENT: 20, // Speed limit tolerance
} as const;

// Route cost factors (base rates - would be configurable)
export const COST_FACTORS = {
  FUEL_PRICE_PER_LITER: 1.5, // Base fuel price
  DRIVER_COST_PER_HOUR: 25, // Driver labor cost
  VEHICLE_COST_PER_KM: 0.15, // Vehicle wear and maintenance
  TOLL_AVERAGE_PER_KM: 0.05, // Average toll cost
  TIME_VALUE_PER_HOUR: 15, // Opportunity cost of time
} as const;

// Route update intervals
export const UPDATE_INTERVALS = {
  ROUTE_TRACKING_MS: 30000, // 30 seconds for active route tracking
  ROUTE_HISTORY_MS: 300000, // 5 minutes for historical routes
  TRAFFIC_UPDATE_MS: 120000, // 2 minutes for traffic conditions
  ETA_CALCULATION_MS: 60000, // 1 minute for ETA updates
} as const;

// Route quality thresholds
export const QUALITY_THRESHOLDS = {
  EXCELLENT_EFFICIENCY: 95, // % of planned performance
  GOOD_EFFICIENCY: 85,
  FAIR_EFFICIENCY: 70,
  POOR_EFFICIENCY: 50,
  PUNCTUALITY_EXCELLENT: 95, // % on-time arrivals
  PUNCTUALITY_GOOD: 85,
  PUNCTUALITY_FAIR: 70,
} as const;

// Multi-vehicle coordination
export const COORDINATION = {
  MAX_VEHICLES_PER_ROUTE: 10,
  SYNC_TOLERANCE_MINUTES: 10, // Coordination point tolerance
  DEPENDENCY_TIMEOUT_MINUTES: 60, // Max wait time for dependencies
} as const;

// Route template categories
export const TEMPLATE_CATEGORIES = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup',
  MAINTENANCE: 'maintenance',
  EMERGENCY: 'emergency',
  REGULAR_SERVICE: 'regular_service',
  CUSTOM: 'custom',
} as const;

// Export as types for TypeScript strict checking
export type RouteStatusType = typeof ROUTE_STATUS[keyof typeof ROUTE_STATUS];
export type WaypointType = typeof WAYPOINT_TYPES[keyof typeof WAYPOINT_TYPES];
export type OptimizationCriteria = typeof OPTIMIZATION_CRITERIA[keyof typeof OPTIMIZATION_CRITERIA];
export type VehicleType = typeof VEHICLE_TYPES[keyof typeof VEHICLE_TYPES];
export type TrafficSeverityType = typeof TRAFFIC_SEVERITY[keyof typeof TRAFFIC_SEVERITY];
export type DeviationType = typeof DEVIATION_TYPES[keyof typeof DEVIATION_TYPES];
