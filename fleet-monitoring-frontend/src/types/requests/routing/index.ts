import {
  RoutingWaypoint,
  CircuitBreakerState,
  AlgorithmConfig,
  RouteCache,
  WaypointType,
  VehicleSize,
  TrafficLevel,
  RoadCondition,
  RoutingAlgorithm,
} from '../../entities/routing';

// Define types that aren't in the routing entities
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RouteCalculationConfiguration {
  algorithm?: RoutingAlgorithm;
  algorithmConfig?: AlgorithmConfig;
  useTrafficData?: boolean;
  useWeatherData?: boolean;
  optimizeFor?: 'time' | 'distance' | 'fuel' | 'cost';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  maxDeviationDistance?: number;
  includeAlternativeRoutes?: boolean;
  realTimeUpdates?: boolean;
}

export interface CircuitBreakerConfiguration {
  failureThreshold: number;
  timeoutDuration: number;
  halfOpenMaxAttempts: number;
  resetTimeWindow: number;
  enabled: boolean;
}

export interface CacheConfiguration {
  ttl: number;
  maxSize: number;
  compressionEnabled: boolean;
  cleanupInterval: number;
}

export interface OptimizationPreference {
  primary: 'time' | 'distance' | 'fuel' | 'cost';
  secondary?: 'time' | 'distance' | 'fuel' | 'cost';
  weights?: {
    time?: number;
    distance?: number;
    fuel?: number;
    cost?: number;
  };
}

export interface VehicleConstraints {
  maxSpeed?: number;
  fuelCapacity?: number;
  cargoCapacity?: number;
  size: VehicleSize;
  restrictions?: string[];
  allowedRoadTypes?: string[];
}

export interface TrafficConditions {
  level: TrafficLevel;
  incidents?: TrafficIncident[];
  roadClosures?: RoadClosure[];
  avgSpeed?: number;
  congestionZones?: string[];
}

export interface TrafficIncident {
  id: string;
  type: 'accident' | 'construction' | 'event' | 'hazard';
  severity: 'minor' | 'major' | 'severe';
  location: Coordinates;
  description: string;
  estimatedClearTime?: Date;
}

export interface RoadClosure {
  id: string;
  roadName: string;
  startLocation: Coordinates;
  endLocation: Coordinates;
  reason: string;
  startTime: Date;
  endTime?: Date;
  alternativeRoute?: string;
}

export interface WeatherConditions {
  temperature: number;
  humidity: number;
  precipitation: number;
  visibility: number;
  windSpeed: number;
  conditions: string;
  roadCondition: RoadCondition;
}

export interface RoutePreference {
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  avoidFerries?: boolean;
  preferScenic?: boolean;
  minimizeLeftTurns?: boolean;
  allowUTurns?: boolean;
}

/**
 * Request to calculate a route between points
 */
export interface CalculateRouteRequest {
  /** Unique identifier for the calculation request */
  requestId: string;
  
  /** ID of the vehicle for which the route is being calculated */
  vehicleId: string;
  
  /** Starting point of the route */
  origin: Coordinates;
  
  /** Destination point of the route */
  destination: Coordinates;
  
  /** Optional intermediate waypoints */
  waypoints?: RoutingWaypoint[];
  
  /** Vehicle constraints for route calculation */
  vehicleConstraints?: VehicleConstraints;
  
  /** Current traffic conditions */
  trafficConditions?: TrafficConditions;
  
  /** Current weather conditions */
  weatherConditions?: WeatherConditions;
  
  /** Route preferences */
  routePreference?: RoutePreference;
  
  /** Optimization preferences */
  optimizationPreference?: OptimizationPreference;
  
  /** Routing algorithm to use (optional, server will choose optimal if not specified) */
  preferredAlgorithm?: string;
  
  /** Configuration for the route calculation */
  configuration?: RouteCalculationConfiguration;
  
  /** Whether to use cached results if available */
  useCache?: boolean;
  
  /** Maximum acceptable calculation time in milliseconds */
  maxCalculationTime?: number;
  
  /** User ID making the request */
  userId: string;
  
  /** Additional metadata for the request */
  metadata?: Record<string, any>;
  
  /** Timestamp when the request was created */
  createdAt?: Date;
}

/**
 * Request to optimize an existing route
 */
export interface OptimizeRouteRequest {
  /** ID of the existing route to optimize */
  routeId: string;
  
  /** Unique identifier for the optimization request */
  requestId: string;
  
  /** ID of the vehicle */
  vehicleId: string;
  
  /** Optimization preferences */
  optimizationPreference: OptimizationPreference;
  
  /** Algorithm to use for optimization */
  algorithm?: string;
  
  /** Algorithm-specific configuration */
  algorithmConfiguration?: AlgorithmConfig;
  
  /** Whether to preserve existing waypoints */
  preserveWaypoints?: boolean;
  
  /** Current traffic conditions */
  trafficConditions?: TrafficConditions;
  
  /** Maximum optimization time in milliseconds */
  maxOptimizationTime?: number;
  
  /** User ID making the request */
  userId: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Request for batch route calculations
 */
export interface BatchRouteCalculationRequest {
  /** Unique identifier for the batch request */
  batchId: string;
  
  /** Individual route calculation requests */
  requests: CalculateRouteRequest[];
  
  /** Whether to process requests in parallel */
  parallelProcessing?: boolean;
  
  /** Maximum number of concurrent calculations */
  maxConcurrentCalculations?: number;
  
  /** Whether to stop on first error */
  stopOnError?: boolean;
  
  /** Batch-level optimization preferences */
  batchOptimization?: OptimizationPreference;
  
  /** Priority level for the batch */
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  
  /** User ID making the request */
  userId: string;
  
  /** Callback URL for batch completion notification */
  callbackUrl?: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Request to configure circuit breaker settings
 */
export interface ConfigureCircuitBreakerRequest {
  /** Circuit breaker configuration */
  configuration: CircuitBreakerConfiguration;
  
  /** User ID making the request */
  userId: string;
  
  /** Whether to apply immediately or schedule for next reset */
  applyImmediately?: boolean;
  
  /** Reason for configuration change */
  reason?: string;
}

/**
 * Request to reset circuit breaker
 */
export interface ResetCircuitBreakerRequest {
  /** User ID making the request */
  userId: string;
  
  /** Force reset even if conditions are not met */
  forceReset?: boolean;
  
  /** Reason for reset */
  reason?: string;
}

/**
 * Request to clear route cache
 */
export interface ClearRouteCacheRequest {
  /** Specific cache keys to clear (if empty, clears all) */
  cacheKeys?: string[];
  
  /** Vehicle IDs to clear cache for */
  vehicleIds?: string[];
  
  /** Clear only expired entries */
  expiredOnly?: boolean;
  
  /** User ID making the request */
  userId: string;
  
  /** Reason for cache clear */
  reason?: string;
}

/**
 * Request to configure cache settings
 */
export interface ConfigureCacheRequest {
  /** Cache configuration */
  configuration: CacheConfiguration;
  
  /** User ID making the request */
  userId: string;
  
  /** Whether to clear existing cache */
  clearExistingCache?: boolean;
  
  /** Reason for configuration change */
  reason?: string;
}

/**
 * Request to acquire zone lock
 */
export interface AcquireZoneLockRequest {
  /** Zone identifier */
  zoneId: string;
  
  /** Purpose of the lock */
  purpose: string;
  
  /** Vehicle ID acquiring the lock */
  vehicleId: string;
  
  /** Maximum lock duration in milliseconds */
  maxDuration?: number;
  
  /** Whether to wait if zone is already locked */
  waitForLock?: boolean;
  
  /** Maximum wait time in milliseconds */
  maxWaitTime?: number;
  
  /** User ID making the request */
  userId: string;
  
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Request to release zone lock
 */
export interface ReleaseZoneLockRequest {
  /** Lock ID to release */
  lockId: string;
  
  /** User ID making the request */
  userId: string;
  
  /** Reason for release */
  reason?: string;
}

/**
 * Request for routing analytics
 */
export interface RoutingAnalyticsRequest {
  /** Start date for analytics */
  startDate: Date;
  
  /** End date for analytics */
  endDate: Date;
  
  /** Vehicle IDs to include (if empty, includes all) */
  vehicleIds?: string[];
  
  /** Algorithms to analyze */
  algorithms?: string[];
  
  /** Metrics to include */
  metrics?: string[];
  
  /** Aggregation level */
  aggregationLevel?: 'hour' | 'day' | 'week' | 'month';
  
  /** Whether to include detailed breakdown */
  includeBreakdown?: boolean;
  
  /** User ID making the request */
  userId: string;
}

/**
 * Request for performance analytics
 */
export interface PerformanceAnalyticsRequest {
  /** Time period for analysis */
  timePeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  /** Performance categories to analyze */
  categories?: ('calculation_time' | 'cache_performance' | 'circuit_breaker' | 'system_load')[];
  
  /** Granularity of data points */
  granularity?: 'minute' | 'hour' | 'day';
  
  /** Whether to include trends analysis */
  includeTrends?: boolean;
  
  /** Whether to include predictions */
  includePredictions?: boolean;
  
  /** User ID making the request */
  userId: string;
}

/**
 * Request to export audit logs
 */
export interface ExportAuditLogsRequest {
  /** Start date for export */
  startDate: Date;
  
  /** End date for export */
  endDate: Date;
  
  /** Event types to include */
  eventTypes?: string[];
  
  /** Severity levels to include */
  severityLevels?: string[];
  
  /** Categories to include */
  categories?: string[];
  
  /** Export format */
  format?: 'json' | 'csv' | 'xml';
  
  /** Whether to compress the export */
  compress?: boolean;
  
  /** User ID making the request */
  userId: string;
  
  /** Additional filters */
  filters?: Record<string, any>;
}

/**
 * Request to validate route calculation request
 */
export interface ValidateRouteRequestRequest {
  /** Route calculation request to validate */
  routeRequest: CalculateRouteRequest;
  
  /** Validation level */
  validationLevel?: 'basic' | 'standard' | 'strict';
  
  /** Whether to check route feasibility */
  checkFeasibility?: boolean;
  
  /** User ID making the request */
  userId: string;
}

/**
 * Request for algorithm performance comparison
 */
export interface AlgorithmComparisonRequest {
  /** Route parameters for comparison */
  routeParameters: {
    origin: Coordinates;
    destination: Coordinates;
    waypoints?: RoutingWaypoint[];
    vehicleConstraints?: VehicleConstraints;
  };
  
  /** Algorithms to compare */
  algorithms: string[];
  
  /** Number of test runs per algorithm */
  testRuns?: number;
  
  /** Metrics to compare */
  comparisonMetrics?: string[];
  
  /** User ID making the request */
  userId: string;
}

/**
 * Request to update algorithm configuration
 */
export interface UpdateAlgorithmConfigRequest {
  /** Algorithm name */
  algorithm: string;
  
  /** New configuration */
  configuration: AlgorithmConfig;
  
  /** User ID making the request */
  userId: string;
  
  /** Whether to apply to future calculations only */
  futureOnly?: boolean;
  
  /** Reason for configuration change */
  reason?: string;
}

/**
 * Request for system health check
 */
export interface SystemHealthCheckRequest {
  /** Components to check */
  components?: ('routing_service' | 'cache' | 'circuit_breaker' | 'database' | 'locks')[];
  
  /** Include performance metrics */
  includeMetrics?: boolean;
  
  /** Include recent errors */
  includeErrors?: boolean;
  
  /** User ID making the request */
  userId: string;
}

// Type unions for common request types
export type RoutingRequest = 
  | CalculateRouteRequest 
  | OptimizeRouteRequest 
  | BatchRouteCalculationRequest;

export type ConfigurationRequest = 
  | ConfigureCircuitBreakerRequest 
  | ConfigureCacheRequest 
  | UpdateAlgorithmConfigRequest;

export type ManagementRequest = 
  | ClearRouteCacheRequest 
  | ResetCircuitBreakerRequest 
  | AcquireZoneLockRequest 
  | ReleaseZoneLockRequest;

export type AnalyticsRequest = 
  | RoutingAnalyticsRequest 
  | PerformanceAnalyticsRequest 
  | AlgorithmComparisonRequest;

export type UtilityRequest = 
  | ExportAuditLogsRequest 
  | ValidateRouteRequestRequest 
  | SystemHealthCheckRequest;
