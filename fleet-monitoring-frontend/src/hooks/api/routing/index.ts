import { useMutation } from '@tanstack/react-query';
import RoutingApiService from '../../../services/api/routing';
import { RouteCalculationRequest } from '../../../types/entities/routing';

/**
 * Hook to calculate route
 * Uses POST /api/routing/calculate
 */
export const useCalculateRoute = () => {
  return useMutation({
    mutationFn: (request: RouteCalculationRequest) => RoutingApiService.calculateRoute(request),
    onError: (error) => {
      console.error('Error calculating route:', error);
    },
  });
};

/**
 * Hook to reset circuit breaker
 * Uses POST /api/routing/reset-circuit
 */
export const useResetCircuit = () => {
  return useMutation({
    mutationFn: () => RoutingApiService.resetCircuit(),
    onError: (error) => {
      console.error('Error resetting circuit breaker:', error);
    },
  });
};
