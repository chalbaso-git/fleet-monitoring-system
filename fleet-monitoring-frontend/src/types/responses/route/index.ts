import { Route, RouteWithMetadata, RoutePerformance, RouteCostAnalysis, RouteTemplate } from '@/types/entities/route';

/**
 * Standard API response wrapper for routes
 */
export interface RouteApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Response for successful route addition - matches backend response
 */
export interface AddRouteResponse {
  success: boolean;
  message: string;
  routeId?: number;
  calculatedDistance?: number;
  estimatedDuration?: number;
  createdAt: string;
}

/**
 * Response for getting all routes - matches backend GetRoutes
 */
export interface GetRoutesResponse {
  routes: Route[];
  totalCount: number;
  hasMore: boolean;
  nextOffset?: number;
}

/**
 * Enhanced routes response with metadata
 */
export interface GetRoutesWithMetadataResponse {
  routes: RouteWithMetadata[];
  summary: {
    totalRoutes: number;
    totalDistance: number;
    averageDistance: number;
    totalDuration: number;
    statusBreakdown: Record<string, number>;
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Response for route history query - matches backend GetRoutesByVehicleAndDate
 */
export interface RouteHistoryResponse {
  vehicleId: string;
  routes: Route[];
  dateRange: {
    from: string;
    to: string;
  };
  summary: {
    totalRoutes: number;
    totalDistance: number;
    totalDuration: number;
    averageDistance: number;
    longestRoute: number;
    shortestRoute: number;
  };
  trends: {
    dailyDistance: Array<{
      date: string;
      distance: number;
      routeCount: number;
    }>;
    weeklyPattern: Array<{
      dayOfWeek: number;
      averageDistance: number;
      averageRoutes: number;
    }>;
  };
}

/**
 * Route optimization response
 */
export interface RouteOptimizationResponse {
  originalRoute: Route;
  optimizedRoute: RouteWithMetadata;
  improvements: {
    distanceSaved: number; // km
    timeSaved: number; // minutes
    fuelSaved: number; // liters
    costSaved: number; // currency units
    efficiencyGain: number; // percentage
  };
  optimizationDetails: {
    algorithm: string;
    processingTime: number; // milliseconds
    iterations: number;
    wayPointChanges: Array<{
      originalOrder: number;
      newOrder: number;
      reason: string;
    }>;
  };
}

/**
 * Multi-vehicle route planning response
 */
export interface MultiVehicleRouteResponse {
  planId: string;
  routes: Array<{
    vehicleId: string;
    route: RouteWithMetadata;
    assignedPriority: 'high' | 'medium' | 'low';
    estimatedStartTime: string;
    estimatedEndTime: string;
    coordinationPoints: Array<{
      waypointId: string;
      scheduledTime: string;
      otherVehicles: string[];
    }>;
  }>;
  overallMetrics: {
    totalDistance: number;
    totalDuration: number;
    totalCost: number;
    vehicleUtilization: number; // percentage
    coordinationComplexity: 'low' | 'medium' | 'high';
  };
  feasibilityScore: number; // 0-100
  warnings: string[];
}

/**
 * Route performance analytics response
 */
export interface RoutePerformanceResponse {
  route: Route;
  performance: RoutePerformance;
  benchmarks: {
    industryAverage: {
      efficiency: number;
      punctuality: number;
      fuelEfficiency: number;
    };
    companyAverage: {
      efficiency: number;
      punctuality: number;
      fuelEfficiency: number;
    };
    vehicleAverage: {
      efficiency: number;
      punctuality: number;
      fuelEfficiency: number;
    };
  };
  recommendations: Array<{
    type: 'route_optimization' | 'timing_adjustment' | 'vehicle_maintenance' | 'driver_training';
    priority: 'high' | 'medium' | 'low';
    description: string;
    expectedImprovement: number; // percentage
    implementationCost: 'low' | 'medium' | 'high';
  }>;
}

/**
 * Route analytics dashboard response
 */
export interface RouteAnalyticsDashboard {
  timeRange: {
    from: string;
    to: string;
  };
  overviewMetrics: {
    totalRoutes: number;
    totalDistance: number;
    totalDuration: number;
    averageEfficiency: number;
    onTimePercentage: number;
    totalCost: number;
  };
  trends: {
    dailyMetrics: Array<{
      date: string;
      routeCount: number;
      totalDistance: number;
      averageEfficiency: number;
      onTimePercentage: number;
    }>;
    vehiclePerformance: Array<{
      vehicleId: string;
      efficiency: number;
      punctuality: number;
      utilization: number;
      totalRoutes: number;
    }>;
  };
  topRoutes: {
    mostEfficient: Route[];
    longestDistance: Route[];
    mostFrequent: Array<{
      route: Route;
      frequency: number;
      lastUsed: string;
    }>;
  };
  alerts: Array<{
    type: 'efficiency_drop' | 'frequent_delays' | 'cost_spike' | 'deviation_pattern';
    severity: 'high' | 'medium' | 'low';
    description: string;
    affectedRoutes: number[];
    detectedAt: string;
  }>;
}

/**
 * Route template management response
 */
export interface RouteTemplatesResponse {
  templates: RouteTemplate[];
  categories: Array<{
    name: string;
    count: number;
    mostUsed: RouteTemplate;
  }>;
  usage: {
    totalUsage: number;
    monthlyUsage: Array<{
      month: string;
      usageCount: number;
      uniqueTemplates: number;
    }>;
    topTemplates: Array<{
      template: RouteTemplate;
      usageCount: number;
      efficiency: number;
    }>;
  };
}

/**
 * Route cost analysis response
 */
export interface RouteCostResponse {
  route: Route;
  costAnalysis: RouteCostAnalysis;
  breakdown: {
    fixedCosts: {
      vehicleDepreciation: number;
      insurance: number;
      registration: number;
    };
    variableCosts: {
      fuel: number;
      maintenance: number;
      tires: number;
      driver: number;
    };
    externalCosts: {
      tolls: number;
      parking: number;
      permits: number;
    };
  };
  comparisons: {
    alternativeRoutes: Array<{
      route: Route;
      costDifference: number;
      savings: number;
      tradeoffs: string[];
    }>;
    historicalCosts: Array<{
      period: string;
      averageCost: number;
      trend: 'increasing' | 'decreasing' | 'stable';
    }>;
  };
}

/**
 * Real-time route tracking response
 */
export interface RouteTrackingResponse {
  routeId: number;
  vehicleId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed' | 'deviated';
  currentLocation: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
  progress: {
    completedWaypoints: number;
    totalWaypoints: number;
    distanceCompleted: number;
    distanceRemaining: number;
    percentComplete: number;
  };
  timing: {
    startTime: string;
    estimatedEndTime: string;
    actualArrivalTimes: Array<{
      waypointId: string;
      plannedTime: string;
      actualTime: string;
      delay: number; // minutes
    }>;
  };
  alerts: Array<{
    type: 'delay' | 'deviation' | 'traffic' | 'breakdown';
    severity: 'high' | 'medium' | 'low';
    message: string;
    location?: {
      latitude: number;
      longitude: number;
    };
    timestamp: string;
  }>;
}

/**
 * Route comparison analysis response
 */
export interface RouteComparisonResponse {
  routes: Route[];
  comparison: {
    metrics: Array<{
      name: string;
      values: Record<string, number>; // routeId -> value
      winner: number; // routeId with best value
      unit: string;
    }>;
    overallRanking: Array<{
      routeId: number;
      score: number;
      rank: number;
      strengths: string[];
      weaknesses: string[];
    }>;
  };
  visualization: {
    chartData: unknown; // Chart.js compatible data structure
    mapData: {
      routes: Array<{
        routeId: number;
        coordinates: Array<{
          latitude: number;
          longitude: number;
        }>;
        color: string;
        style: 'solid' | 'dashed' | 'dotted';
      }>;
    };
  };
  recommendations: {
    bestOverall: number;
    bestForDistance: number;
    bestForTime: number;
    bestForCost: number;
    notes: string[];
  };
}

/**
 * Route search results response
 */
export interface RouteSearchResponse {
  routes: RouteWithMetadata[];
  facets: {
    vehicleIds: Array<{ value: string; count: number }>;
    statuses: Array<{ value: string; count: number }>;
    distanceRanges: Array<{ range: string; count: number }>;
    timeRanges: Array<{ range: string; count: number }>;
  };
  searchStats: {
    totalResults: number;
    searchTime: number; // milliseconds
    query: string;
    filters: Record<string, unknown>;
  };
  suggestions: {
    didYouMean?: string;
    relatedSearches: string[];
    popularFilters: Array<{
      name: string;
      value: unknown;
      resultCount: number;
    }>;
  };
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Export analytics utilities
export * from './analytics';
