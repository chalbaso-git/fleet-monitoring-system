/**
 * Routing entity types for advanced route calculation and management
 */

export interface RouteCalculation {
  id: string;
  vehicleId: string;
  origin: string;
  destination: string;
  path: string[];
  distance: number;
  estimatedDuration: number; // minutes
  calculatedAt: string;
  status: RouteCalculationStatus;
  algorithm: RoutingAlgorithm;
  metadata: RouteCalculationMetadata;
}

export interface RouteCalculationMetadata {
  waypointCount: number;
  algorithmExecutionTime: number; // milliseconds
  cacheHit: boolean;
  circuitBreakerStatus: CircuitBreakerStatus;
  lockAcquired: boolean;
  lockDuration?: number; // milliseconds
  optimizationApplied: boolean;
  trafficConsideration: boolean;
  weatherConsideration: boolean;
  errorDetails?: string;
}

export interface RoutingWaypoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: WaypointType;
  zone: string;
  isActive: boolean;
  priority: number;
  attributes: WaypointAttributes;
  createdAt: string;
  updatedAt: string;
}

export interface WaypointAttributes {
  accessRestrictions: string[];
  maxVehicleSize: VehicleSize;
  operatingHours: OperatingHours;
  serviceType: string[];
  costFactors: CostFactors;
  trafficLevel: TrafficLevel;
  roadCondition: RoadCondition;
}

export interface OperatingHours {
  isAlwaysOpen: boolean;
  schedule: DailySchedule[];
  timeZone: string;
  specialDates: SpecialDateSchedule[];
}

export interface DailySchedule {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  openTime: string; // HH:mm format
  closeTime: string; // HH:mm format
  isOpen: boolean;
}

export interface SpecialDateSchedule {
  date: string; // YYYY-MM-DD format
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  description: string;
}

export interface CostFactors {
  tollCost: number;
  fuelMultiplier: number;
  timeMultiplier: number;
  maintenanceRisk: number; // 0-1 scale
  securityRisk: number; // 0-1 scale
}

export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime?: string;
  openedAt?: string;
  halfOpenAttempts: number;
  state: CircuitBreakerStatus;
  threshold: CircuitBreakerThreshold;
  statistics: CircuitBreakerStatistics;
}

export interface CircuitBreakerThreshold {
  failureThreshold: number;
  timeoutDuration: number; // milliseconds
  halfOpenMaxAttempts: number;
  resetTimeWindow: number; // minutes
}

export interface CircuitBreakerStatistics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastResetTime: string;
  uptime: number; // percentage
}

export interface AuditLog {
  id: string;
  vehicleId: string;
  eventType: AuditEventType;
  details: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  severity: AuditSeverity;
  category: AuditCategory;
  metadata: Record<string, any>;
}

export interface RouteCache {
  id: string;
  cacheKey: string;
  vehicleId: string;
  origin: string;
  destination: string;
  routeData: RouteCalculation;
  cachedAt: string;
  expiresAt: string;
  hitCount: number;
  lastAccessedAt: string;
  size: number; // bytes
  compressionRatio?: number;
}

export interface ZoneLock {
  id: string;
  origin: string;
  destination: string;
  vehicleId: string;
  lockId: string;
  acquiredAt: string;
  expiresAt: string;
  purpose: LockPurpose;
  metadata: ZoneLockMetadata;
}

export interface ZoneLockMetadata {
  requestId: string;
  priority: number;
  timeout: number; // milliseconds
  retryCount: number;
  deadlockDetected: boolean;
  lockDuration?: number;
}

export interface RoutingPerformanceMetrics {
  calculationId: string;
  vehicleId: string;
  timestamp: string;
  metrics: {
    algorithmExecutionTime: number;
    totalProcessingTime: number;
    cachePerformance: CachePerformanceMetrics;
    networkLatency: number;
    memoryUsage: number;
    cpuUsage: number;
    waypointProcessingTime: number;
    pathOptimizationTime: number;
  };
  quality: RouteQualityMetrics;
}

export interface CachePerformanceMetrics {
  hitRate: number; // percentage
  missRate: number; // percentage
  evictionRate: number; // percentage
  averageRetrievalTime: number;
  cacheSize: number;
  memoryUsage: number;
}

export interface RouteQualityMetrics {
  optimalityScore: number; // 0-100
  efficiencyRating: number; // 0-100
  reliabilityScore: number; // 0-100
  deviationFromOptimal: number; // percentage
  userSatisfactionScore?: number; // 0-100
}

export interface RoutingAnalytics {
  period: {
    startDate: string;
    endDate: string;
  };
  summary: {
    totalCalculations: number;
    successfulCalculations: number;
    failedCalculations: number;
    averageCalculationTime: number;
    cacheHitRate: number;
    circuitBreakerActivations: number;
    uniqueVehicles: number;
    uniqueRoutes: number;
  };
  performance: {
    averageDistance: number;
    averageDuration: number;
    algorithmDistribution: Record<RoutingAlgorithm, number>;
    peakUsageHours: number[];
    errorDistribution: Record<string, number>;
  };
  trends: {
    daily: Array<{
      date: string;
      calculations: number;
      averageTime: number;
      successRate: number;
    }>;
    hourly: Array<{
      hour: number;
      calculations: number;
      averageTime: number;
    }>;
  };
}

// Enums and Types
export type RouteCalculationStatus = 
  | 'pending'
  | 'calculating'
  | 'completed'
  | 'failed'
  | 'cached'
  | 'timeout'
  | 'circuit_breaker_open';

export type RoutingAlgorithm = 
  | 'astar'
  | 'dijkstra'
  | 'bellman_ford'
  | 'floyd_warshall'
  | 'genetic_algorithm'
  | 'simulated_annealing'
  | 'nearest_neighbor'
  | 'mock_algorithm';

export type CircuitBreakerStatus = 
  | 'closed'
  | 'open'
  | 'half_open';

export type WaypointType = 
  | 'origin'
  | 'destination'
  | 'intermediate'
  | 'optional'
  | 'service_point'
  | 'fuel_station'
  | 'rest_area'
  | 'checkpoint'
  | 'delivery_point'
  | 'pickup_point';

export type VehicleSize = 
  | 'small'
  | 'medium'
  | 'large'
  | 'extra_large'
  | 'oversized';

export type TrafficLevel = 
  | 'light'
  | 'moderate'
  | 'heavy'
  | 'severe'
  | 'unknown';

export type RoadCondition = 
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor'
  | 'under_construction'
  | 'closed'
  | 'unknown';

export type AuditEventType = 
  | 'RouteCalculated'
  | 'RouteCalculationFailed'
  | 'CircuitBreakerOpen'
  | 'CircuitBreakerClosed'
  | 'CircuitBreakerReset'
  | 'CircuitBreakerActivated'
  | 'CacheHit'
  | 'CacheMiss'
  | 'LockAcquired'
  | 'LockReleased'
  | 'DeadlockDetected'
  | 'AlgorithmSelected'
  | 'OptimizationApplied'
  | 'ErrorRecovery'
  | 'PerformanceAlert';

export type AuditSeverity = 
  | 'info'
  | 'warning'
  | 'error'
  | 'critical';

export type AuditCategory = 
  | 'routing'
  | 'performance'
  | 'security'
  | 'system'
  | 'user_action'
  | 'circuit_breaker'
  | 'cache'
  | 'lock_management';

export type LockPurpose = 
  | 'route_calculation'
  | 'optimization'
  | 'cache_update'
  | 'maintenance'
  | 'analytics';

// Algorithm-specific configurations
export interface AlgorithmConfig {
  algorithm: RoutingAlgorithm;
  parameters: Record<string, any>;
  timeout: number;
  maxIterations?: number;
  convergenceThreshold?: number;
  heuristicWeight?: number;
  optimizationLevel: 'fast' | 'balanced' | 'optimal';
}

export interface AStarConfig extends AlgorithmConfig {
  algorithm: 'astar';
  parameters: {
    heuristicFunction: 'manhattan' | 'euclidean' | 'haversine';
    allowDiagonal: boolean;
    heuristicWeight: number;
    tieBreaker: number;
  };
}

export interface GeneticAlgorithmConfig extends AlgorithmConfig {
  algorithm: 'genetic_algorithm';
  parameters: {
    populationSize: number;
    mutationRate: number;
    crossoverRate: number;
    elitismRate: number;
    maxGenerations: number;
    selectionMethod: 'tournament' | 'roulette' | 'rank';
  };
}
