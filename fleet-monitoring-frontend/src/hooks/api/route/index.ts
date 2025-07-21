import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import RouteApiService from '../../../services/api/route';
import { Route } from '../../../types/entities/route';

// Query keys
const ROUTE_KEYS = {
  all: ['routes'] as const,
  lists: () => [...ROUTE_KEYS.all, 'list'] as const,
  byVehicleAndDate: (vehicleId: string, date: string) => 
    [...ROUTE_KEYS.all, 'byVehicleAndDate', vehicleId, date] as const,
};

/**
 * Hook to fetch all routes
 * Uses GET /api/route
 */
export const useGetRoutes = () => {
  return useQuery({
    queryKey: ROUTE_KEYS.lists(),
    queryFn: RouteApiService.getRoutes,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to fetch routes by vehicle and date
 * Uses GET /api/route/by-vehicle-and-date
 */
export const useGetRoutesByVehicleAndDate = (vehicleId: string, date: string) => {
  return useQuery({
    queryKey: ROUTE_KEYS.byVehicleAndDate(vehicleId, date),
    queryFn: () => RouteApiService.getRoutesByVehicleAndDate(vehicleId, date),
    enabled: !!vehicleId && !!date,
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Hook to add a new route
 * Uses POST /api/route
 */
export const useAddRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (route: Omit<Route, 'id'>) => RouteApiService.addRoute(route),
    onSuccess: () => {
      // Invalidate routes queries to refetch data
      queryClient.invalidateQueries({ queryKey: ROUTE_KEYS.all });
    },
    onError: (error) => {
      console.error('Error adding route:', error);
    },
  });
};
