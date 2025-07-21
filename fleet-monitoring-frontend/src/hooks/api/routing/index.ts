import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoutingApiService } from '../../../services/api/routing';
import { RouteCalculationRequest } from '../../../types/entities/routing';

// Hook para calcular una ruta
export const useCalculateRoute = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: RouteCalculationRequest) => RoutingApiService.calculateRoute(request),
    onSuccess: () => {
      // Invalidar consultas de rutas calculadas
      queryClient.invalidateQueries({ queryKey: ['route-calculations'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
    onError: (error) => {
      console.error('Error al calcular ruta:', error);
    },
  });
};

// Hook para resetear el circuit breaker
export const useResetCircuit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => RoutingApiService.resetCircuit(),
    onSuccess: () => {
      // Invalidar consultas del estado del sistema
      queryClient.invalidateQueries({ queryKey: ['system-health'] });
      queryClient.invalidateQueries({ queryKey: ['circuit-breaker'] });
    },
    onError: (error) => {
      console.error('Error al resetear circuit breaker:', error);
    },
  });
};

const routingHooks = { useCalculateRoute, useResetCircuit };
export default routingHooks;
