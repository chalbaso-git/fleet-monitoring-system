import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getRoutingApiService } from '../../../services/api/routing';
import {
  CalculateRouteRequest,
  OptimizeRouteRequest,
  BatchRouteCalculationRequest,
  ConfigureCircuitBreakerRequest,
  ResetCircuitBreakerRequest,
  ClearRouteCacheRequest,
  AcquireZoneLockRequest,
  ReleaseZoneLockRequest,
} from '../../../types/requests/routing';
import {
  CalculateRouteResponse,
  OptimizeRouteResponse,
  BatchRouteCalculationResponse,
  CircuitBreakerResponse,
  RouteCacheResponse,
  ZoneLockResponse,
} from '../../../types/responses/routing';
import { routingQueryKeys } from './queryKeys';

const routingApiService = getRoutingApiService();

/**
 * Mutation for calculating routes
 */
export const useCalculateRouteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CalculateRouteResponse, Error, CalculateRouteRequest>({
    mutationFn: (request: CalculateRouteRequest) => 
      routingApiService.calculateRoute(request),
    
    onSuccess: (data, variables) => {
      console.log('Route calculated successfully');
      
      // Update cache with new calculation
      queryClient.setQueryData(
        routingQueryKeys.calculation(variables.requestId),
        data
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.calculations()
      });
    },
    
    onError: (error: Error) => {
      console.error('Route calculation failed:', error);
    },
    
    retry: (failureCount, error) => {
      if (error.message.includes('circuit breaker')) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

/**
 * Mutation for optimizing routes
 */
export const useOptimizeRouteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<OptimizeRouteResponse, Error, OptimizeRouteRequest>({
    mutationFn: (request: OptimizeRouteRequest) => 
      routingApiService.optimizeRoute(request),
    
    onSuccess: (data, variables) => {
      console.log('Route optimized successfully');
      
      queryClient.setQueryData(
        routingQueryKeys.optimization(variables.requestId),
        data
      );

      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.optimizations()
      });
    },
    
    onError: (error: Error) => {
      console.error('Route optimization failed:', error);
    },
  });
};

/**
 * Mutation for batch route calculations
 */
export const useBatchCalculateRoutesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<BatchRouteCalculationResponse, Error, BatchRouteCalculationRequest>({
    mutationFn: (request: BatchRouteCalculationRequest) => 
      routingApiService.calculateBatchRoutes(request),
    
    onSuccess: (data, variables) => {
      const successCount = data.results.filter(r => r.status === 'success').length;
      console.log(`Batch calculation completed: ${successCount}/${data.results.length} routes calculated`);
      
      queryClient.setQueryData(
        routingQueryKeys.batch(variables.batchId),
        data
      );

      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.batches()
      });
    },
    
    onError: (error: Error) => {
      console.error('Batch route calculation failed:', error);
    },
  });
};

/**
 * Mutation for configuring circuit breaker
 */
export const useConfigureCircuitBreakerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CircuitBreakerResponse, Error, ConfigureCircuitBreakerRequest>({
    mutationFn: (request: ConfigureCircuitBreakerRequest) => 
      routingApiService.configureCircuitBreaker(request),
    
    onSuccess: (data) => {
      console.log(data.success ? 'Circuit breaker configured successfully' : 'Configuration completed with warnings');
      
      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.circuitBreakerStatus()
      });
    },
    
    onError: (error: Error) => {
      console.error('Circuit breaker configuration failed:', error);
    },
  });
};

/**
 * Mutation for resetting circuit breaker
 */
export const useResetCircuitBreakerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CircuitBreakerResponse, Error, ResetCircuitBreakerRequest>({
    mutationFn: (request: ResetCircuitBreakerRequest) => 
      routingApiService.resetCircuitBreaker(request),
    
    onSuccess: (data) => {
      console.log(data.success ? 'Circuit breaker reset successfully' : 'Reset completed with warnings');
      
      if (data.success) {
        routingApiService.forceResetLocalCircuitBreaker();
      }
      
      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.circuitBreakerStatus()
      });
    },
    
    onError: (error: Error) => {
      console.error('Circuit breaker reset failed:', error);
    },
  });
};

/**
 * Mutation for clearing route cache
 */
export const useClearRouteCacheMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RouteCacheResponse, Error, ClearRouteCacheRequest>({
    mutationFn: (request: ClearRouteCacheRequest) => 
      routingApiService.clearRouteCache(request),
    
    onSuccess: (data) => {
      console.log(data.success ? `Cache cleared: ${data.itemsAffected} items removed` : 'Cache clear completed with warnings');
      
      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.cacheStatus()
      });
    },
    
    onError: (error: Error) => {
      console.error('Cache clear failed:', error);
    },
  });
};

/**
 * Mutation for acquiring zone locks
 */
export const useAcquireZoneLockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ZoneLockResponse, Error, AcquireZoneLockRequest>({
    mutationFn: (request: AcquireZoneLockRequest) => 
      routingApiService.acquireZoneLock(request),
    
    onSuccess: (data, variables) => {
      console.log(data.success ? `Zone lock acquired for ${variables.zoneId}` : 'Lock acquisition completed with warnings');
      
      queryClient.setQueryData(
        routingQueryKeys.lockStatus(variables.zoneId),
        data
      );

      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.locks()
      });
    },
    
    onError: (error: Error) => {
      console.error('Zone lock acquisition failed:', error);
    },
  });
};

/**
 * Mutation for releasing zone locks
 */
export const useReleaseZoneLockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ZoneLockResponse, Error, ReleaseZoneLockRequest>({
    mutationFn: (request: ReleaseZoneLockRequest) => 
      routingApiService.releaseZoneLock(request),
    
    onSuccess: (data) => {
      console.log(data.success ? 'Zone lock released successfully' : 'Lock release completed with warnings');
      
      queryClient.invalidateQueries({
        queryKey: routingQueryKeys.locks()
      });
    },
    
    onError: (error: Error) => {
      console.error('Zone lock release failed:', error);
    },
  });
};

/**
 * Hook for invalidating all routing-related cache
 */
export const useInvalidateRoutingCache = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({
      queryKey: routingQueryKeys.all
    });
    console.log('Routing cache invalidated');
  };
};
