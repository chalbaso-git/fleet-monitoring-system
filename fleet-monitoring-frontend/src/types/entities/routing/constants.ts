/**
 * Routing-related constants and enums
 */

// Route Calculation Status Constants
export const ROUTE_CALCULATION_STATUS = {
  PENDING: 'pending',
  CALCULATING: 'calculating',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CACHED: 'cached',
  TIMEOUT: 'timeout',
  CIRCUIT_BREAKER_OPEN: 'circuit_breaker_open',
} as const;

// Routing Algorithm Constants
export const ROUTING_ALGORITHMS = {
  ASTAR: 'astar',
  DIJKSTRA: 'dijkstra',
  BELLMAN_FORD: 'bellman_ford',
  FLOYD_WARSHALL: 'floyd_warshall',
  GENETIC_ALGORITHM: 'genetic_algorithm',
  SIMULATED_ANNEALING: 'simulated_annealing',
  NEAREST_NEIGHBOR: 'nearest_neighbor',
  MOCK_ALGORITHM: 'mock_algorithm',
} as const;

// Circuit Breaker Status Constants
export const CIRCUIT_BREAKER_STATUS = {
  CLOSED: 'closed',
  OPEN: 'open',
  HALF_OPEN: 'half_open',
} as const;

// Waypoint Type Constants
export const WAYPOINT_TYPES = {
  ORIGIN: 'origin',
  DESTINATION: 'destination',
  INTERMEDIATE: 'intermediate',
  OPTIONAL: 'optional',
  SERVICE_POINT: 'service_point',
  FUEL_STATION: 'fuel_station',
  REST_AREA: 'rest_area',
  CHECKPOINT: 'checkpoint',
  DELIVERY_POINT: 'delivery_point',
  PICKUP_POINT: 'pickup_point',
} as const;

// Vehicle Size Constants
export const VEHICLE_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  EXTRA_LARGE: 'extra_large',
  OVERSIZED: 'oversized',
} as const;

// Traffic Level Constants
export const TRAFFIC_LEVELS = {
  LIGHT: 'light',
  MODERATE: 'moderate',
  HEAVY: 'heavy',
  SEVERE: 'severe',
  UNKNOWN: 'unknown',
} as const;

// Road Condition Constants
export const ROAD_CONDITIONS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
  UNDER_CONSTRUCTION: 'under_construction',
  CLOSED: 'closed',
  UNKNOWN: 'unknown',
} as const;

// Audit Event Type Constants
export const AUDIT_EVENT_TYPES = {
  ROUTE_CALCULATED: 'RouteCalculated',
  ROUTE_CALCULATION_FAILED: 'RouteCalculationFailed',
  CIRCUIT_BREAKER_OPEN: 'CircuitBreakerOpen',
  CIRCUIT_BREAKER_CLOSED: 'CircuitBreakerClosed',
  CIRCUIT_BREAKER_RESET: 'CircuitBreakerReset',
  CIRCUIT_BREAKER_ACTIVATED: 'CircuitBreakerActivated',
  CACHE_HIT: 'CacheHit',
  CACHE_MISS: 'CacheMiss',
  LOCK_ACQUIRED: 'LockAcquired',
  LOCK_RELEASED: 'LockReleased',
  DEADLOCK_DETECTED: 'DeadlockDetected',
  ALGORITHM_SELECTED: 'AlgorithmSelected',
  OPTIMIZATION_APPLIED: 'OptimizationApplied',
  ERROR_RECOVERY: 'ErrorRecovery',
  PERFORMANCE_ALERT: 'PerformanceAlert',
} as const;

// Audit Severity Constants
export const AUDIT_SEVERITY = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
} as const;

// Audit Category Constants
export const AUDIT_CATEGORIES = {
  ROUTING: 'routing',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  SYSTEM: 'system',
  USER_ACTION: 'user_action',
  CIRCUIT_BREAKER: 'circuit_breaker',
  CACHE: 'cache',
  LOCK_MANAGEMENT: 'lock_management',
} as const;

// Lock Purpose Constants
export const LOCK_PURPOSES = {
  ROUTE_CALCULATION: 'route_calculation',
  OPTIMIZATION: 'optimization',
  CACHE_UPDATE: 'cache_update',
  MAINTENANCE: 'maintenance',
  ANALYTICS: 'analytics',
} as const;

// Default Circuit Breaker Configuration
export const DEFAULT_CIRCUIT_BREAKER_CONFIG = {
  FAILURE_THRESHOLD: 3,
  TIMEOUT_DURATION: 30000, // 30 seconds
  HALF_OPEN_MAX_ATTEMPTS: 3,
  RESET_TIME_WINDOW: 60, // 1 minute
} as const;

// Default Algorithm Configuration
export const DEFAULT_ALGORITHM_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  MAX_ITERATIONS: 1000,
  CONVERGENCE_THRESHOLD: 0.001,
  HEURISTIC_WEIGHT: 1.0,
  OPTIMIZATION_LEVEL: 'balanced',
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_TTL: 3600, // 1 hour in seconds
  MAX_CACHE_SIZE: 1000, // number of entries
  COMPRESSION_THRESHOLD: 1024, // bytes
  CLEANUP_INTERVAL: 300, // 5 minutes in seconds
} as const;

// Performance Thresholds
export const PERFORMANCE_THRESHOLDS = {
  CALCULATION_TIME: {
    FAST: 1000, // milliseconds
    ACCEPTABLE: 5000,
    SLOW: 10000,
    TIMEOUT: 30000,
  },
  CACHE_HIT_RATE: {
    EXCELLENT: 90, // percentage
    GOOD: 75,
    FAIR: 50,
    POOR: 25,
  },
  SYSTEM_LOAD: {
    LOW: 30, // percentage
    MEDIUM: 60,
    HIGH: 80,
    CRITICAL: 95,
  },
  MEMORY_USAGE: {
    LOW: 512, // MB
    MEDIUM: 1024,
    HIGH: 2048,
    CRITICAL: 4096,
  },
} as const;

// Routing Limits and Constraints
export const ROUTING_LIMITS = {
  MAX_WAYPOINTS: 50,
  MAX_DISTANCE: 10000, // kilometers
  MAX_CALCULATION_TIME: 30000, // milliseconds
  MAX_CACHE_ENTRIES: 10000,
  MAX_CONCURRENT_CALCULATIONS: 100,
  MAX_RETRY_ATTEMPTS: 3,
  MAX_LOCK_DURATION: 300000, // 5 minutes
  MAX_AUDIT_LOG_SIZE: 10000, // entries
} as const;

// Algorithm-specific Constants
export const ASTAR_CONFIG = {
  HEURISTIC_FUNCTIONS: {
    MANHATTAN: 'manhattan',
    EUCLIDEAN: 'euclidean',
    HAVERSINE: 'haversine',
  },
  DEFAULT_HEURISTIC_WEIGHT: 1.0,
  DEFAULT_TIE_BREAKER: 0.001,
} as const;

export const GENETIC_ALGORITHM_CONFIG = {
  DEFAULT_POPULATION_SIZE: 100,
  DEFAULT_MUTATION_RATE: 0.01,
  DEFAULT_CROSSOVER_RATE: 0.8,
  DEFAULT_ELITISM_RATE: 0.1,
  DEFAULT_MAX_GENERATIONS: 1000,
  SELECTION_METHODS: {
    TOURNAMENT: 'tournament',
    ROULETTE: 'roulette',
    RANK: 'rank',
  },
} as const;

// Status Colors for UI
export const STATUS_COLORS = {
  ROUTE_CALCULATION_STATUS: {
    [ROUTE_CALCULATION_STATUS.PENDING]: '#FF9800', // Orange
    [ROUTE_CALCULATION_STATUS.CALCULATING]: '#2196F3', // Blue
    [ROUTE_CALCULATION_STATUS.COMPLETED]: '#4CAF50', // Green
    [ROUTE_CALCULATION_STATUS.FAILED]: '#F44336', // Red
    [ROUTE_CALCULATION_STATUS.CACHED]: '#9C27B0', // Purple
    [ROUTE_CALCULATION_STATUS.TIMEOUT]: '#FF5722', // Deep Orange
    [ROUTE_CALCULATION_STATUS.CIRCUIT_BREAKER_OPEN]: '#D32F2F', // Dark Red
  },
  CIRCUIT_BREAKER_STATUS: {
    [CIRCUIT_BREAKER_STATUS.CLOSED]: '#4CAF50', // Green
    [CIRCUIT_BREAKER_STATUS.OPEN]: '#F44336', // Red
    [CIRCUIT_BREAKER_STATUS.HALF_OPEN]: '#FF9800', // Orange
  },
  TRAFFIC_LEVELS: {
    [TRAFFIC_LEVELS.LIGHT]: '#4CAF50', // Green
    [TRAFFIC_LEVELS.MODERATE]: '#FF9800', // Orange
    [TRAFFIC_LEVELS.HEAVY]: '#F44336', // Red
    [TRAFFIC_LEVELS.SEVERE]: '#D32F2F', // Dark Red
    [TRAFFIC_LEVELS.UNKNOWN]: '#9E9E9E', // Grey
  },
  AUDIT_SEVERITY: {
    [AUDIT_SEVERITY.INFO]: '#2196F3', // Blue
    [AUDIT_SEVERITY.WARNING]: '#FF9800', // Orange
    [AUDIT_SEVERITY.ERROR]: '#F44336', // Red
    [AUDIT_SEVERITY.CRITICAL]: '#D32F2F', // Dark Red
  },
} as const;

// Display Labels
export const STATUS_LABELS = {
  ROUTE_CALCULATION_STATUS: {
    [ROUTE_CALCULATION_STATUS.PENDING]: 'Pending',
    [ROUTE_CALCULATION_STATUS.CALCULATING]: 'Calculating',
    [ROUTE_CALCULATION_STATUS.COMPLETED]: 'Completed',
    [ROUTE_CALCULATION_STATUS.FAILED]: 'Failed',
    [ROUTE_CALCULATION_STATUS.CACHED]: 'From Cache',
    [ROUTE_CALCULATION_STATUS.TIMEOUT]: 'Timeout',
    [ROUTE_CALCULATION_STATUS.CIRCUIT_BREAKER_OPEN]: 'Service Unavailable',
  },
  ROUTING_ALGORITHMS: {
    [ROUTING_ALGORITHMS.ASTAR]: 'A* Algorithm',
    [ROUTING_ALGORITHMS.DIJKSTRA]: 'Dijkstra Algorithm',
    [ROUTING_ALGORITHMS.BELLMAN_FORD]: 'Bellman-Ford Algorithm',
    [ROUTING_ALGORITHMS.FLOYD_WARSHALL]: 'Floyd-Warshall Algorithm',
    [ROUTING_ALGORITHMS.GENETIC_ALGORITHM]: 'Genetic Algorithm',
    [ROUTING_ALGORITHMS.SIMULATED_ANNEALING]: 'Simulated Annealing',
    [ROUTING_ALGORITHMS.NEAREST_NEIGHBOR]: 'Nearest Neighbor',
    [ROUTING_ALGORITHMS.MOCK_ALGORITHM]: 'Mock Algorithm',
  },
  CIRCUIT_BREAKER_STATUS: {
    [CIRCUIT_BREAKER_STATUS.CLOSED]: 'Operational',
    [CIRCUIT_BREAKER_STATUS.OPEN]: 'Circuit Open',
    [CIRCUIT_BREAKER_STATUS.HALF_OPEN]: 'Testing',
  },
  WAYPOINT_TYPES: {
    [WAYPOINT_TYPES.ORIGIN]: 'Origin',
    [WAYPOINT_TYPES.DESTINATION]: 'Destination',
    [WAYPOINT_TYPES.INTERMEDIATE]: 'Intermediate',
    [WAYPOINT_TYPES.OPTIONAL]: 'Optional',
    [WAYPOINT_TYPES.SERVICE_POINT]: 'Service Point',
    [WAYPOINT_TYPES.FUEL_STATION]: 'Fuel Station',
    [WAYPOINT_TYPES.REST_AREA]: 'Rest Area',
    [WAYPOINT_TYPES.CHECKPOINT]: 'Checkpoint',
    [WAYPOINT_TYPES.DELIVERY_POINT]: 'Delivery Point',
    [WAYPOINT_TYPES.PICKUP_POINT]: 'Pickup Point',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_REQUEST: 'Invalid route calculation request',
  MISSING_ORIGIN: 'Origin is required',
  MISSING_DESTINATION: 'Destination is required',
  INVALID_VEHICLE_ID: 'Valid vehicle ID is required',
  CIRCUIT_BREAKER_OPEN: 'Routing service is temporarily unavailable',
  CALCULATION_TIMEOUT: 'Route calculation timed out',
  ALGORITHM_ERROR: 'Algorithm execution failed',
  CACHE_ERROR: 'Cache operation failed',
  LOCK_TIMEOUT: 'Unable to acquire zone lock',
  DEADLOCK_DETECTED: 'Deadlock detected in zone lock',
  INVALID_WAYPOINTS: 'Invalid waypoint configuration',
  DISTANCE_EXCEEDED: 'Route distance exceeds maximum allowed',
  UNKNOWN_ERROR: 'An unknown error occurred during route calculation',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ROUTE_CALCULATED: 'Route calculated successfully',
  CIRCUIT_BREAKER_RESET: 'Circuit breaker reset successfully',
  CACHE_CLEARED: 'Route cache cleared successfully',
  ALGORITHM_OPTIMIZED: 'Route optimized successfully',
  PERFORMANCE_IMPROVED: 'Performance optimization applied',
} as const;
