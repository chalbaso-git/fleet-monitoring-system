import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { routeApiService } from '@/services/api/route/routeApiService';
import { AddRouteRequest, CreateRouteRequest, GetRoutesByVehicleAndDateRequest } from '@/types/requests/route';
import { AddRouteResponse, GetRoutesResponse, RouteHistoryResponse } from '@/types/responses/route';
import { Route } from '@/types/entities/route';
import { ROUTE_QUERY_KEYS } from '@/hooks/api/route/queryKeys';

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Hook to fetch all routes
 */
export function useRoutes(): UseQueryResult<GetRoutesResponse, Error> {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.ALL,
    queryFn: () => routeApiService.getRoutes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a specific route by ID
 */
export function useRoute(routeId: string): UseQueryResult<Route, Error> {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.DETAIL(routeId),
    queryFn: () => routeApiService.getRouteById(routeId),
    enabled: !!routeId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch routes by vehicle and date range
 */
export function useRoutesByVehicleAndDate(
  request: GetRoutesByVehicleAndDateRequest
): UseQueryResult<RouteHistoryResponse, Error> {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.BY_VEHICLE_DATE(
      request.vehicleId,
      request.startDate.toISOString(),
      request.endDate.toISOString()
    ),
    queryFn: () => routeApiService.getRoutesByVehicleAndDate(request),
    enabled: !!request.vehicleId && !!request.startDate && !!request.endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch routes by vehicle
 */
export function useRoutesByVehicle(
  vehicleId: string,
  limit?: number
): UseQueryResult<Route[], Error> {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.BY_VEHICLE(vehicleId, limit),
    queryFn: () => routeApiService.getRoutesByVehicle(vehicleId, limit),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch recent routes
 */
export function useRecentRoutes(limit: number = 50): UseQueryResult<Route[], Error> {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.RECENT(limit),
    queryFn: () => routeApiService.getRecentRoutes(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

/**
 * Hook to fetch route analytics
 */
export function useRouteAnalytics(
  startDate: Date,
  endDate: Date,
  vehicleId?: string
) {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.ANALYTICS(
      startDate.toISOString(),
      endDate.toISOString(),
      vehicleId
    ),
    queryFn: () => routeApiService.getRouteAnalytics(startDate, endDate, vehicleId),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch route performance
 */
export function useRoutePerformance(routeId: string) {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.PERFORMANCE(routeId),
    queryFn: () => routeApiService.getRoutePerformance(routeId),
    enabled: !!routeId,
    staleTime: 10 * 60 * 1000, // Performance data doesn't change often
  });
}

/**
 * Hook to fetch route templates
 */
export function useRouteTemplates() {
  return useQuery({
    queryKey: ROUTE_QUERY_KEYS.TEMPLATES,
    queryFn: () => routeApiService.getRouteTemplates(),
    staleTime: 30 * 60 * 1000, // Templates don't change often
  });
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Hook to add a new route
 */
export function useAddRoute(): UseMutationResult<AddRouteResponse, Error, AddRouteRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddRouteRequest) => routeApiService.addRoute(request),
    onSuccess: (data, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ 
        queryKey: ROUTE_QUERY_KEYS.BY_VEHICLE(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.RECENT() });
      
      // Optionally add the new route to the cache
      if (data.route) {
        queryClient.setQueryData(
          ROUTE_QUERY_KEYS.DETAIL(data.route.id),
          data.route
        );
      }
    },
    onError: (error) => {
      console.error('Failed to add route:', error);
    },
  });
}

/**
 * Hook to create a new route with optimization
 */
export function useCreateRoute(): UseMutationResult<AddRouteResponse, Error, CreateRouteRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateRouteRequest) => routeApiService.createRoute(request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ 
        queryKey: ROUTE_QUERY_KEYS.BY_VEHICLE(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.RECENT() });

      if (data.route) {
        queryClient.setQueryData(
          ROUTE_QUERY_KEYS.DETAIL(data.route.id),
          data.route
        );
      }
    },
  });
}

/**
 * Hook to update an existing route
 */
export function useUpdateRoute(): UseMutationResult<
  AddRouteResponse,
  Error,
  { routeId: string; updates: Partial<AddRouteRequest> }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, updates }) => routeApiService.updateRoute(routeId, updates),
    onSuccess: (data, variables) => {
      const { routeId } = variables;
      
      // Update the specific route in cache
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.DETAIL(routeId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.RECENT() });
      
      // If we have the updated route data, update the cache directly
      if (data.route) {
        queryClient.setQueryData(
          ROUTE_QUERY_KEYS.DETAIL(routeId),
          data.route
        );
        
        // Update vehicle-specific queries if vehicle ID is available
        queryClient.invalidateQueries({ 
          queryKey: ROUTE_QUERY_KEYS.BY_VEHICLE(data.route.vehicleId) 
        });
      }
    },
  });
}

/**
 * Hook to delete a route
 */
export function useDeleteRoute(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => routeApiService.deleteRoute(routeId),
    onSuccess: (_, routeId) => {
      // Remove the route from cache
      queryClient.removeQueries({ queryKey: ROUTE_QUERY_KEYS.DETAIL(routeId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.RECENT() });
      
      // Invalidate all vehicle-specific queries (we don't know which vehicle)
      queryClient.invalidateQueries({ 
        queryKey: ROUTE_QUERY_KEYS.BASE,
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey.length > 1 && 
          query.queryKey[1] === 'by-vehicle'
      });
    },
  });
}

/**
 * Hook to optimize a route
 */
export function useOptimizeRoute(): UseMutationResult<
  {
    originalRoute: Route;
    optimizedRoute: Route;
    estimatedSavings: { distance: number; time: number; fuel: number };
  },
  Error,
  string
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routeId: string) => routeApiService.optimizeRoute(routeId),
    onSuccess: (data, routeId) => {
      // Update the route with optimized version
      queryClient.setQueryData(
        ROUTE_QUERY_KEYS.DETAIL(routeId),
        data.optimizedRoute
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ 
        queryKey: ROUTE_QUERY_KEYS.BY_VEHICLE(data.optimizedRoute.vehicleId) 
      });
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.RECENT() });
      queryClient.invalidateQueries({ 
        queryKey: ROUTE_QUERY_KEYS.PERFORMANCE(routeId) 
      });
    },
  });
}

/**
 * Hook to validate a route
 */
export function useValidateRoute(): UseMutationResult<
  {
    isValid: boolean;
    issues: string[];
    estimatedDistance: number;
    estimatedDuration: number;
  },
  Error,
  { path: string; vehicleId: string }
> {
  return useMutation({
    mutationFn: ({ path, vehicleId }) => routeApiService.validateRoute(path, vehicleId),
  });
}

/**
 * Hook to export routes
 */
export function useExportRoutes(): UseMutationResult<
  Blob,
  Error,
  {
    format: 'csv' | 'xlsx' | 'gpx';
    filters?: {
      vehicleId?: string;
      startDate?: Date;
      endDate?: Date;
    };
  }
> {
  return useMutation({
    mutationFn: ({ format, filters }) => routeApiService.exportRoutes(format, filters),
    onSuccess: (blob, variables) => {
      // Auto-download the exported file
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `routes_export.${variables.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

/**
 * Hook to create route template
 */
export function useCreateRouteTemplate(): UseMutationResult<
  { templateId: string },
  Error,
  {
    routeId: string;
    template: {
      name: string;
      description: string;
      isPublic?: boolean;
    };
  }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ routeId, template }) => 
      routeApiService.createRouteTemplate(routeId, template),
    onSuccess: () => {
      // Refresh templates list
      queryClient.invalidateQueries({ queryKey: ROUTE_QUERY_KEYS.TEMPLATES });
    },
  });
}
