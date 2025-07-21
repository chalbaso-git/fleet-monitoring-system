import {
  RouteCalculation,
  RoutingWaypoint,
  CircuitBreakerState,
  RouteCache,
  ZoneLock,
  AuditLog,
  RoutingPerformanceMetrics,
  RoutingAnalytics,
} from '../../entities/routing';
import {
  Coordinates,
  TrafficConditions,
  WeatherConditions,
  VehicleConstraints,
} from '../../requests/routing';

/**
 * Response from route calculation
 */
export interface CalculateRouteResponse {
  /** The calculated route */
  route: RouteCalculation;
  
  /** Alternative routes if requested */
  alternativeRoutes?: RouteCalculation[];
  
  /** Calculation details */
  calculationDetails: RouteCalculationDetails;
  
  /** Performance metrics for this calculation */
  performanceMetrics: CalculationPerformanceMetrics;
  
  /** Warnings or notifications */
  warnings?: RouteWarning[];
  
  /** Whether the result came from cache */
  fromCache: boolean;
  
  /** Cache expiry time if from cache */
  cacheExpiresAt?: Date;
  
  /** Timestamp of the response */
  timestamp: Date;
}

export interface RouteCalculationDetails {
  /** Algorithm used for calculation */
  algorithmUsed: string;
  
  /** Execution time in milliseconds */
  executionTime: number;
  
  /** Number of nodes explored */
  nodesExplored?: number;
  
  /** Number of iterations performed */
  iterations?: number;
  
  /** Optimization level achieved */
  optimizationLevel: 'basic' | 'standard' | 'advanced' | 'optimal';
  
  /** Whether traffic data was considered */
  trafficDataUsed: boolean;
  
  /** Whether weather data was considered */
  weatherDataUsed: boolean;
  
  /** Configuration used for calculation */
  configurationUsed: RouteCalculationConfiguration;
  
  /** Any errors or issues encountered */
  issues?: CalculationIssue[];
}

export interface RouteCalculationConfiguration {
  algorithm: string;
  optimizationCriteria: string[];
  constraintsApplied: string[];
  dataSourcesUsed: string[];
  maxCalculationTime: number;
  accuracyLevel: 'low' | 'medium' | 'high' | 'maximum';
}

export interface CalculationPerformanceMetrics {
  /** Total calculation time */
  totalTime: number;
  
  /** Algorithm execution time */
  algorithmTime: number;
  
  /** Data preparation time */
  preparationTime: number;
  
  /** Result processing time */
  processingTime: number;
  
  /** Memory usage in MB */
  memoryUsed: number;
  
  /** CPU usage percentage */
  cpuUsage: number;
  
  /** Cache operations count */
  cacheOperations: number;
  
  /** Database queries count */
  databaseQueries: number;
}

export interface RouteWarning {
  /** Warning code */
  code: string;
  
  /** Warning message */
  message: string;
  
  /** Severity level */
  severity: 'info' | 'warning' | 'caution';
  
  /** Location where warning applies */
  location?: Coordinates;
  
  /** Additional details */
  details?: Record<string, any>;
}

export interface CalculationIssue {
  /** Issue type */
  type: 'warning' | 'error' | 'limitation';
  
  /** Issue description */
  description: string;
  
  /** Impact on route quality */
  impact: 'none' | 'minimal' | 'moderate' | 'significant';
  
  /** Suggested resolution */
  resolution?: string;
}

/**
 * Response from route optimization
 */
export interface OptimizeRouteResponse {
  /** Original route */
  originalRoute: RouteCalculation;
  
  /** Optimized route */
  optimizedRoute: RouteCalculation;
  
  /** Improvement metrics */
  improvements: OptimizationImprovements;
  
  /** Optimization details */
  optimizationDetails: OptimizationDetails;
  
  /** Performance metrics */
  performanceMetrics: CalculationPerformanceMetrics;
  
  /** Timestamp of the response */
  timestamp: Date;
}

export interface OptimizationImprovements {
  /** Time improvement in minutes */
  timeSaving: number;
  
  /** Distance improvement in kilometers */
  distanceSaving: number;
  
  /** Fuel saving in liters */
  fuelSaving?: number;
  
  /** Cost saving in currency units */
  costSaving?: number;
  
  /** Percentage improvements */
  percentageImprovements: {
    time: number;
    distance: number;
    fuel?: number;
    cost?: number;
  };
}

export interface OptimizationDetails {
  /** Optimization algorithm used */
  algorithm: string;
  
  /** Number of optimization iterations */
  iterations: number;
  
  /** Convergence achieved */
  converged: boolean;
  
  /** Final optimization score */
  optimizationScore: number;
  
  /** Changes made to the route */
  changesSummary: string[];
}

/**
 * Response from batch route calculation
 */
export interface BatchRouteCalculationResponse {
  /** Batch ID */
  batchId: string;
  
  /** Overall batch status */
  status: 'completed' | 'partial' | 'failed';
  
  /** Individual route results */
  results: BatchRouteResult[];
  
  /** Batch summary */
  summary: BatchSummary;
  
  /** Batch performance metrics */
  performanceMetrics: BatchPerformanceMetrics;
  
  /** Timestamp of completion */
  completedAt: Date;
}

export interface BatchRouteResult {
  /** Request ID from the original request */
  requestId: string;
  
  /** Status of this specific calculation */
  status: 'success' | 'failed' | 'timeout';
  
  /** Route calculation response if successful */
  response?: CalculateRouteResponse;
  
  /** Error details if failed */
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface BatchSummary {
  /** Total number of requests */
  totalRequests: number;
  
  /** Number of successful calculations */
  successfulCalculations: number;
  
  /** Number of failed calculations */
  failedCalculations: number;
  
  /** Number of timeouts */
  timeouts: number;
  
  /** Success rate percentage */
  successRate: number;
  
  /** Average calculation time */
  averageCalculationTime: number;
}

export interface BatchPerformanceMetrics {
  /** Total batch processing time */
  totalProcessingTime: number;
  
  /** Average per-route time */
  averageRouteTime: number;
  
  /** Peak memory usage */
  peakMemoryUsage: number;
  
  /** Total CPU time used */
  totalCpuTime: number;
  
  /** Parallelization efficiency */
  parallelizationEfficiency: number;
}

/**
 * Response from circuit breaker operations
 */
export interface CircuitBreakerResponse {
  /** Current circuit breaker state */
  state: CircuitBreakerState;
  
  /** Operation performed */
  operation: 'configure' | 'reset' | 'status';
  
  /** Whether operation was successful */
  success: boolean;
  
  /** Message describing the result */
  message: string;
  
  /** Timestamp of the operation */
  timestamp: Date;
}

/**
 * Response from cache operations
 */
export interface RouteCacheResponse {
  /** Operation performed */
  operation: 'clear' | 'configure' | 'status';
  
  /** Whether operation was successful */
  success: boolean;
  
  /** Cache statistics */
  statistics: CacheStatistics;
  
  /** Items affected by the operation */
  itemsAffected?: number;
  
  /** Message describing the result */
  message: string;
  
  /** Timestamp of the operation */
  timestamp: Date;
}

export interface CacheStatistics {
  /** Total number of cache entries */
  totalEntries: number;
  
  /** Cache size in MB */
  totalSizeMB: number;
  
  /** Hit rate percentage */
  hitRate: number;
  
  /** Miss rate percentage */
  missRate: number;
  
  /** Average response time for cache hits */
  averageHitTime: number;
  
  /** Number of evictions */
  evictions: number;
  
  /** Cache utilization percentage */
  utilization: number;
}

/**
 * Response from zone lock operations
 */
export interface ZoneLockResponse {
  /** Operation performed */
  operation: 'acquire' | 'release' | 'status';
  
  /** Whether operation was successful */
  success: boolean;
  
  /** Lock information if successful */
  lock?: ZoneLock;
  
  /** Error details if failed */
  error?: {
    code: string;
    message: string;
    suggestedRetryAfter?: number;
  };
  
  /** Timestamp of the operation */
  timestamp: Date;
}

/**
 * Response from routing analytics
 */
export interface RoutingAnalyticsResponse {
  /** Analytics data */
  analytics: RoutingAnalytics;
  
  /** Time period covered */
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  /** Data points included */
  dataPoints: number;
  
  /** Aggregation level used */
  aggregationLevel: string;
  
  /** Generation time */
  generatedAt: Date;
}

/**
 * Response from performance analytics
 */
export interface PerformanceAnalyticsResponse {
  /** Performance metrics */
  metrics: RoutingPerformanceMetrics;
  
  /** Trend analysis */
  trends?: PerformanceTrends;
  
  /** Predictions if requested */
  predictions?: PerformancePredictions;
  
  /** Time period analyzed */
  period: {
    startDate: Date;
    endDate: Date;
  };
  
  /** Analysis generated at */
  generatedAt: Date;
}

export interface PerformanceTrends {
  /** Calculation time trend */
  calculationTime: TrendData;
  
  /** Cache performance trend */
  cachePerformance: TrendData;
  
  /** System load trend */
  systemLoad: TrendData;
  
  /** Error rate trend */
  errorRate: TrendData;
}

export interface TrendData {
  /** Trend direction */
  direction: 'improving' | 'stable' | 'degrading';
  
  /** Trend strength */
  strength: 'weak' | 'moderate' | 'strong';
  
  /** Rate of change */
  changeRate: number;
  
  /** Confidence level */
  confidence: number;
  
  /** Data points used */
  dataPoints: number;
}

export interface PerformancePredictions {
  /** Predicted performance for next period */
  nextPeriod: {
    averageCalculationTime: number;
    expectedCacheHitRate: number;
    predictedSystemLoad: number;
    confidence: number;
  };
  
  /** Potential issues predicted */
  potentialIssues: PredictedIssue[];
  
  /** Recommended actions */
  recommendations: PerformanceRecommendation[];
}

export interface PredictedIssue {
  /** Issue type */
  type: 'performance_degradation' | 'capacity_limit' | 'system_overload';
  
  /** Probability of occurrence */
  probability: number;
  
  /** Expected impact */
  impact: 'low' | 'medium' | 'high' | 'critical';
  
  /** Estimated time until issue */
  timeToIssue?: number;
  
  /** Mitigation suggestions */
  mitigation: string[];
}

export interface PerformanceRecommendation {
  /** Recommendation type */
  type: 'configuration' | 'scaling' | 'optimization' | 'maintenance';
  
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  /** Recommendation description */
  description: string;
  
  /** Expected benefit */
  expectedBenefit: string;
  
  /** Implementation effort */
  effort: 'low' | 'medium' | 'high';
}

/**
 * Response from audit log export
 */
export interface ExportAuditLogsResponse {
  /** Export ID */
  exportId: string;
  
  /** Export status */
  status: 'completed' | 'failed' | 'in_progress';
  
  /** Download URL if completed */
  downloadUrl?: string;
  
  /** Export details */
  details: {
    totalRecords: number;
    exportFormat: string;
    fileSize?: number;
    compressed: boolean;
  };
  
  /** Export validity period */
  validUntil?: Date;
  
  /** Generated at */
  generatedAt: Date;
}

/**
 * Response from route validation
 */
export interface ValidateRouteResponse {
  /** Whether the route request is valid */
  isValid: boolean;
  
  /** Validation results */
  validationResults: ValidationResult[];
  
  /** Route feasibility assessment */
  feasibility?: FeasibilityAssessment;
  
  /** Recommendations for improvement */
  recommendations?: string[];
  
  /** Validated at */
  validatedAt: Date;
}

export interface ValidationResult {
  /** Validation rule checked */
  rule: string;
  
  /** Whether this rule passed */
  passed: boolean;
  
  /** Severity if failed */
  severity?: 'warning' | 'error' | 'critical';
  
  /** Validation message */
  message: string;
  
  /** Field that failed validation */
  field?: string;
}

export interface FeasibilityAssessment {
  /** Overall feasibility score (0-100) */
  score: number;
  
  /** Route is feasible */
  feasible: boolean;
  
  /** Factors affecting feasibility */
  factors: FeasibilityFactor[];
  
  /** Estimated success probability */
  successProbability: number;
}

export interface FeasibilityFactor {
  /** Factor name */
  name: string;
  
  /** Impact on feasibility */
  impact: 'positive' | 'negative' | 'neutral';
  
  /** Weight of this factor */
  weight: number;
  
  /** Factor description */
  description: string;
}

/**
 * Response from algorithm comparison
 */
export interface AlgorithmComparisonResponse {
  /** Comparison results */
  results: AlgorithmComparisonResult[];
  
  /** Summary of comparison */
  summary: ComparisonSummary;
  
  /** Test parameters used */
  testParameters: {
    testRuns: number;
    routeParameters: any;
    comparisonMetrics: string[];
  };
  
  /** Comparison performed at */
  comparedAt: Date;
}

export interface AlgorithmComparisonResult {
  /** Algorithm name */
  algorithm: string;
  
  /** Performance metrics */
  metrics: {
    averageCalculationTime: number;
    averageRouteDistance: number;
    averageRouteTime: number;
    successRate: number;
    memoryUsage: number;
  };
  
  /** Ranking for each metric */
  rankings: Record<string, number>;
  
  /** Overall score */
  overallScore: number;
}

export interface ComparisonSummary {
  /** Best algorithm overall */
  bestOverall: string;
  
  /** Best for speed */
  bestForSpeed: string;
  
  /** Best for accuracy */
  bestForAccuracy: string;
  
  /** Best for efficiency */
  bestForEfficiency: string;
  
  /** Recommendations */
  recommendations: AlgorithmRecommendation[];
}

export interface AlgorithmRecommendation {
  /** Use case */
  useCase: string;
  
  /** Recommended algorithm */
  algorithm: string;
  
  /** Reason for recommendation */
  reason: string;
  
  /** Expected benefits */
  benefits: string[];
}

/**
 * Response from system health check
 */
export interface SystemHealthCheckResponse {
  /** Overall system health */
  overallHealth: 'healthy' | 'degraded' | 'unhealthy' | 'critical';
  
  /** Individual component health */
  components: ComponentHealth[];
  
  /** System metrics */
  metrics?: SystemMetrics;
  
  /** Recent errors */
  recentErrors?: SystemError[];
  
  /** Health check performed at */
  checkedAt: Date;
}

export interface ComponentHealth {
  /** Component name */
  component: string;
  
  /** Health status */
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unavailable';
  
  /** Response time */
  responseTime?: number;
  
  /** Error details if unhealthy */
  error?: string;
  
  /** Last successful check */
  lastSuccessfulCheck?: Date;
}

export interface SystemMetrics {
  /** CPU usage percentage */
  cpuUsage: number;
  
  /** Memory usage in MB */
  memoryUsage: number;
  
  /** Disk usage percentage */
  diskUsage: number;
  
  /** Active connections */
  activeConnections: number;
  
  /** Requests per minute */
  requestsPerMinute: number;
  
  /** Average response time */
  averageResponseTime: number;
}

export interface SystemError {
  /** Error timestamp */
  timestamp: Date;
  
  /** Error message */
  message: string;
  
  /** Component that generated the error */
  component: string;
  
  /** Error severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Error count if recurring */
  count?: number;
}

// Type unions for common response types
export type RoutingResponse = 
  | CalculateRouteResponse 
  | OptimizeRouteResponse 
  | BatchRouteCalculationResponse;

export type ConfigurationResponse = 
  | CircuitBreakerResponse 
  | RouteCacheResponse;

export type AnalyticsResponse = 
  | RoutingAnalyticsResponse 
  | PerformanceAnalyticsResponse 
  | AlgorithmComparisonResponse;

export type UtilityResponse = 
  | ExportAuditLogsResponse 
  | ValidateRouteResponse 
  | SystemHealthCheckResponse;
