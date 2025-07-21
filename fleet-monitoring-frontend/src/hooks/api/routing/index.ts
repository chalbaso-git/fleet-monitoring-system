import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getRoutingApiService } from '../../../services/api/routing';
import {
  RoutingAnalyticsRequest,
  PerformanceAnalyticsRequest,
  AlgorithmComparisonRequest,
  SystemHealthCheckRequest,
} from '../../../types/requests/routing';
import {
  CircuitBreakerResponse,
  RouteCacheResponse,
  ZoneLockResponse,
  RoutingAnalyticsResponse,
  PerformanceAnalyticsResponse,
  AlgorithmComparisonResponse,
  SystemHealthCheckResponse,
} from '../../../types/responses/routing';
import { routingQueryKeys } from './queryKeys';

const routingApiService = getRoutingApiService();

/**
 * Hook to get circuit breaker status
 */
export const useCircuitBreakerStatus = (
  options?: Omit<UseQueryOptions<CircuitBreakerResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.circuitBreakerStatus(),
    queryFn: () => routingApiService.getCircuitBreakerStatus(),
    refetchInterval: 10000, // Check every 10 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
    ...options,
  });
};

/**
 * Hook to get cache status and statistics
 */
export const useCacheStatus = (
  options?: Omit<UseQueryOptions<RouteCacheResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.cacheStatus(),
    queryFn: () => routingApiService.getCacheStatus(),
    refetchInterval: 30000, // Check every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    ...options,
  });
};

/**
 * Hook to get zone lock status
 */
export const useZoneLockStatus = (
  zoneId: string,
  options?: Omit<UseQueryOptions<ZoneLockResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.lockStatus(zoneId),
    queryFn: () => routingApiService.getZoneLockStatus(zoneId),
    enabled: !!zoneId,
    refetchInterval: 5000, // Check every 5 seconds for locks
    staleTime: 2000, // Consider data stale after 2 seconds
    ...options,
  });
};

/**
 * Hook to get routing analytics
 */
export const useRoutingAnalytics = (
  request: RoutingAnalyticsRequest,
  options?: Omit<UseQueryOptions<RoutingAnalyticsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.routingAnalytics(request),
    queryFn: () => routingApiService.getRoutingAnalytics(request),
    enabled: !!(request.startDate && request.endDate),
    staleTime: 60000, // Analytics data is considered fresh for 1 minute
    ...options,
  });
};

/**
 * Hook to get performance analytics
 */
export const usePerformanceAnalytics = (
  request: PerformanceAnalyticsRequest,
  options?: Omit<UseQueryOptions<PerformanceAnalyticsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.performanceAnalytics(request),
    queryFn: () => routingApiService.getPerformanceAnalytics(request),
    enabled: !!(request.timePeriod.startDate && request.timePeriod.endDate),
    staleTime: 60000, // Performance data is considered fresh for 1 minute
    ...options,
  });
};

/**
 * Hook to get available algorithms
 */
export const useAvailableAlgorithms = (
  options?: Omit<UseQueryOptions<{ algorithms: string[]; configurations: Record<string, any> }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.algorithmList(),
    queryFn: () => routingApiService.getAvailableAlgorithms(),
    staleTime: 300000, // Algorithm list doesn't change often, fresh for 5 minutes
    ...options,
  });
};

/**
 * Hook to compare algorithms
 */
export const useAlgorithmComparison = (
  request: AlgorithmComparisonRequest,
  options?: Omit<UseQueryOptions<AlgorithmComparisonResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.algorithmComparison(request),
    queryFn: () => routingApiService.compareAlgorithms(request),
    enabled: !!(request.algorithms && request.algorithms.length > 1),
    staleTime: 120000, // Comparison results are fresh for 2 minutes
    ...options,
  });
};

/**
 * Hook to perform system health check
 */
export const useSystemHealthCheck = (
  request: SystemHealthCheckRequest,
  options?: Omit<UseQueryOptions<SystemHealthCheckResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.healthStatus(),
    queryFn: () => routingApiService.performHealthCheck(request),
    refetchInterval: 30000, // Check health every 30 seconds
    staleTime: 10000, // Health data is stale after 10 seconds
    retry: 3, // Retry failed health checks
    ...options,
  });
};

/**
 * Hook to get system metrics
 */
export const useSystemMetrics = (
  options?: Omit<UseQueryOptions<{ metrics: Record<string, any>; timestamp: Date }, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: routingQueryKeys.systemMetrics(),
    queryFn: () => routingApiService.getSystemMetrics(),
    refetchInterval: 15000, // Refresh metrics every 15 seconds
    staleTime: 5000, // Metrics are stale after 5 seconds
    ...options,
  });
};

/**
 * Hook to get local circuit breaker state
 */
export const useLocalCircuitBreakerState = () => {
  return routingApiService.getLocalCircuitBreakerState();
};

/**
 * Custom hook for real-time routing performance monitoring
 */
export const useRoutingPerformanceMonitor = () => {
  const circuitBreakerQuery = useCircuitBreakerStatus();
  const cacheQuery = useCacheStatus();
  const metricsQuery = useSystemMetrics();
  const healthQuery = useSystemHealthCheck({ userId: 'system' });

  return {
    circuitBreaker: circuitBreakerQuery.data,
    cache: cacheQuery.data,
    metrics: metricsQuery.data,
    health: healthQuery.data,
    isLoading: circuitBreakerQuery.isLoading || cacheQuery.isLoading || 
               metricsQuery.isLoading || healthQuery.isLoading,
    hasError: circuitBreakerQuery.isError || cacheQuery.isError || 
              metricsQuery.isError || healthQuery.isError,
    errors: {
      circuitBreaker: circuitBreakerQuery.error,
      cache: cacheQuery.error,
      metrics: metricsQuery.error,
      health: healthQuery.error,
    },
  };
};

/**
 * Hook for routing analytics dashboard
 */
export const useRoutingDashboard = (dateRange: { startDate: Date; endDate: Date }) => {
  const routingAnalyticsQuery = useRoutingAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    userId: 'dashboard',
    includeBreakdown: true,
  });

  const performanceAnalyticsQuery = usePerformanceAnalytics({
    timePeriod: dateRange,
    userId: 'dashboard',
    includeTrends: true,
  });

  const algorithmsQuery = useAvailableAlgorithms();

  return {
    routingData: routingAnalyticsQuery.data,
    performanceData: performanceAnalyticsQuery.data,
    algorithms: algorithmsQuery.data,
    isLoading: routingAnalyticsQuery.isLoading || 
               performanceAnalyticsQuery.isLoading || 
               algorithmsQuery.isLoading,
    isError: routingAnalyticsQuery.isError || 
             performanceAnalyticsQuery.isError || 
             algorithmsQuery.isError,
    errors: {
      routing: routingAnalyticsQuery.error,
      performance: performanceAnalyticsQuery.error,
      algorithms: algorithmsQuery.error,
    },
    refetch: () => {
      routingAnalyticsQuery.refetch();
      performanceAnalyticsQuery.refetch();
      algorithmsQuery.refetch();
    },
  };
};

/**
 * Hook for algorithm performance comparison
 */
export const useAlgorithmPerformanceDashboard = (
  routeParameters: {
    origin: { latitude: number; longitude: number };
    destination: { latitude: number; longitude: number };
    algorithms: string[];
  }
) => {
  const comparisonQuery = useAlgorithmComparison({
    routeParameters,
    algorithms: routeParameters.algorithms,
    testRuns: 5,
    userId: 'performance-dashboard',
    comparisonMetrics: ['calculation_time', 'route_distance', 'route_time', 'memory_usage'],
  }, {
    enabled: routeParameters.algorithms.length > 1,
  });

  const algorithmsQuery = useAvailableAlgorithms();

  return {
    comparison: comparisonQuery.data,
    availableAlgorithms: algorithmsQuery.data,
    isLoading: comparisonQuery.isLoading || algorithmsQuery.isLoading,
    isError: comparisonQuery.isError || algorithmsQuery.isError,
    error: comparisonQuery.error || algorithmsQuery.error,
    refetch: () => {
      comparisonQuery.refetch();
      algorithmsQuery.refetch();
    },
  };
};

// Re-export mutations and query keys for convenience
export * from './mutations';
export * from './queryKeys';
