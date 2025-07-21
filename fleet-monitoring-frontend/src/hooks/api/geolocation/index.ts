import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GeolocationApiService } from '@/services/api/geolocation';
import { 
  StoreCoordinateRequest,
  BulkCoordinateRequest,
  CreateGeofenceRequest,
  LocationQueryFilters,
  RouteAnalysisRequest
} from '@/types/requests/geolocation';
import { 
  VehicleLocation,
  Geofence,
  GpsCoordinate
} from '@/types/entities/geolocation';

// Query keys for React Query
export const GEOLOCATION_QUERY_KEYS = {
  all: ['geolocation'] as const,
  vehicles: () => [...GEOLOCATION_QUERY_KEYS.all, 'vehicles'] as const,
  vehicleLocations: (filters?: LocationQueryFilters) => 
    [...GEOLOCATION_QUERY_KEYS.vehicles(), 'locations', filters] as const,
  vehicleLocation: (vehicleId: string) => 
    [...GEOLOCATION_QUERY_KEYS.vehicles(), vehicleId, 'location'] as const,
  vehicleHistory: (vehicleId: string, startDate: string, endDate: string) =>
    [...GEOLOCATION_QUERY_KEYS.vehicles(), vehicleId, 'history', startDate, endDate] as const,
  realTimeTracking: (vehicleIds: string[]) =>
    [...GEOLOCATION_QUERY_KEYS.vehicles(), 'real-time', vehicleIds] as const,
  
  fleet: () => [...GEOLOCATION_QUERY_KEYS.all, 'fleet'] as const,
  fleetOverview: () => [...GEOLOCATION_QUERY_KEYS.fleet(), 'overview'] as const,
  
  geofences: () => [...GEOLOCATION_QUERY_KEYS.all, 'geofences'] as const,
  geofence: (geofenceId: string) => [...GEOLOCATION_QUERY_KEYS.geofences(), geofenceId] as const,
  geofenceViolations: (filters?: object) => [...GEOLOCATION_QUERY_KEYS.geofences(), 'violations', filters] as const,
  geofenceAnalytics: (geofenceId: string, startDate: string, endDate: string) =>
    [...GEOLOCATION_QUERY_KEYS.geofences(), geofenceId, 'analytics', startDate, endDate] as const,
    
  routes: () => [...GEOLOCATION_QUERY_KEYS.all, 'routes'] as const,
  routeAnalysis: (request: RouteAnalysisRequest) => [...GEOLOCATION_QUERY_KEYS.routes(), 'analysis', request] as const,
  routeOptimization: (vehicleId: string, waypoints: object) => 
    [...GEOLOCATION_QUERY_KEYS.routes(), 'optimization', vehicleId, waypoints] as const,
    
  analytics: () => [...GEOLOCATION_QUERY_KEYS.all, 'analytics'] as const,
  locationAnalytics: (vehicleIds: string[], startDate: string, endDate: string) =>
    [...GEOLOCATION_QUERY_KEYS.analytics(), 'location', vehicleIds, startDate, endDate] as const,
};

/**
 * Hook to get vehicle locations with optional filtering
 */
export const useVehicleLocations = (filters?: LocationQueryFilters) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations(filters),
    queryFn: () => GeolocationApiService.getVehicleLocations(filters),
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    refetchIntervalInBackground: true,
  });
};

/**
 * Hook to get a specific vehicle's location
 */
export const useVehicleLocation = (vehicleId: string) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(vehicleId),
    queryFn: () => GeolocationApiService.getVehicleLocation(vehicleId),
    enabled: !!vehicleId,
    staleTime: 15000, // 15 seconds for individual vehicle
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

/**
 * Hook to get vehicle tracking history
 */
export const useVehicleTrackingHistory = (
  vehicleId: string,
  startDate: string,
  endDate: string,
  enabled = true
) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.vehicleHistory(vehicleId, startDate, endDate),
    queryFn: () => GeolocationApiService.getVehicleTrackingHistory(vehicleId, startDate, endDate),
    enabled: enabled && !!vehicleId && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes - historical data doesn't change often
  });
};

/**
 * Hook to get real-time tracking for multiple vehicles
 */
export const useRealTimeTracking = (vehicleIds: string[]) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.realTimeTracking(vehicleIds),
    queryFn: () => GeolocationApiService.getRealTimeTracking(vehicleIds),
    enabled: vehicleIds.length > 0,
    staleTime: 10000, // 10 seconds for real-time data
    refetchInterval: 15000, // Refetch every 15 seconds
    refetchIntervalInBackground: true,
  });
};

/**
 * Hook to get fleet overview
 */
export const useFleetOverview = () => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview(),
    queryFn: GeolocationApiService.getFleetOverview,
    staleTime: 30000,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
};

/**
 * Hook to get all geofences
 */
export const useGeofences = () => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.geofences(),
    queryFn: GeolocationApiService.getGeofences,
    staleTime: 5 * 60 * 1000, // 5 minutes - geofences don't change often
  });
};

/**
 * Hook to get a specific geofence
 */
export const useGeofence = (geofenceId: string) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.geofence(geofenceId),
    queryFn: () => GeolocationApiService.getGeofence(geofenceId),
    enabled: !!geofenceId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get geofence violations
 */
export const useGeofenceViolations = (
  startDate?: string,
  endDate?: string,
  vehicleIds?: string[],
  geofenceIds?: string[]
) => {
  const filters = { startDate, endDate, vehicleIds, geofenceIds };
  
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.geofenceViolations(filters),
    queryFn: () => GeolocationApiService.getGeofenceViolations(startDate, endDate, vehicleIds, geofenceIds),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook to get location analytics
 */
export const useLocationAnalytics = (
  vehicleIds: string[],
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.locationAnalytics(vehicleIds, startDate, endDate),
    queryFn: () => GeolocationApiService.getLocationAnalytics(vehicleIds, startDate, endDate),
    enabled: vehicleIds.length > 0 && !!startDate && !!endDate,
    staleTime: 10 * 60 * 1000, // 10 minutes - analytics are expensive to compute
  });
};

/**
 * Hook to get route analysis
 */
export const useRouteAnalysis = (request: RouteAnalysisRequest, enabled = true) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.routeAnalysis(request),
    queryFn: () => GeolocationApiService.getRouteAnalysis(request),
    enabled: enabled && !!request.vehicleId && !!request.startDate && !!request.endDate,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get route optimization
 */
export const useRouteOptimization = (
  vehicleId: string,
  waypoints: Array<{ latitude: number; longitude: number }>
) => {
  return useQuery({
    queryKey: GEOLOCATION_QUERY_KEYS.routeOptimization(vehicleId, waypoints),
    queryFn: () => GeolocationApiService.getRouteOptimization(vehicleId, waypoints),
    enabled: !!vehicleId && waypoints.length > 1,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to store a GPS coordinate
 */
export const useStoreCoordinate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: StoreCoordinateRequest) => GeolocationApiService.storeCoordinate(request),
    onSuccess: (data, variables) => {
      // Invalidate vehicle location queries
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() 
      });
      
      console.log('GPS coordinate stored successfully');
    },
    onError: (error: any) => {
      console.error(`Failed to store GPS coordinate: ${error.message}`);
    },
  });
};

/**
 * Hook to store bulk GPS coordinates
 */
export const useStoreBulkCoordinates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkCoordinateRequest) => GeolocationApiService.storeBulkCoordinates(request),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() 
      });
      
      console.log(`Stored ${variables.coordinates.length} coordinates successfully`);
    },
    onError: (error: any) => {
      console.error(`Failed to store bulk coordinates: ${error.message}`);
    },
  });
};

/**
 * Hook to create a geofence
 */
export const useCreateGeofence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateGeofenceRequest) => GeolocationApiService.createGeofence(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.geofences() });
      console.log('Geofence created successfully');
    },
    onError: (error: any) => {
      console.error(`Failed to create geofence: ${error.message}`);
    },
  });
};

/**
 * Hook to update a geofence
 */
export const useUpdateGeofence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: { id: string } & Partial<CreateGeofenceRequest>) => 
      GeolocationApiService.updateGeofence(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.geofences() });
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.geofence(data.id) });
      console.log('Geofence updated successfully');
    },
    onError: (error: any) => {
      console.error(`Failed to update geofence: ${error.message}`);
    },
  });
};

/**
 * Hook to delete a geofence
 */
export const useDeleteGeofence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (geofenceId: string) => GeolocationApiService.deleteGeofence(geofenceId),
    onSuccess: (_, geofenceId) => {
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.geofences() });
      queryClient.removeQueries({ queryKey: GEOLOCATION_QUERY_KEYS.geofence(geofenceId) });
      console.log('Geofence deleted successfully');
    },
    onError: (error: any) => {
      console.error(`Failed to delete geofence: ${error.message}`);
    },
  });
};

/**
 * Hook to get geolocation system health
 */
export const useGeolocationSystemHealth = () => {
  return useQuery({
    queryKey: [...GEOLOCATION_QUERY_KEYS.all, 'health'],
    queryFn: GeolocationApiService.getSystemHealth,
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

/**
 * Hook to process pending coordinate queue
 */
export const useProcessPendingQueue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: GeolocationApiService.processPendingQueue,
    onSuccess: (data) => {
      // Refresh all location data after processing queue
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() });
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() });
      
      console.log(`Processed ${data.processed} pending coordinates, ${data.failed} failed`);
    },
    onError: (error: any) => {
      console.error(`Failed to process pending queue: ${error.message}`);
    },
  });
};

// Export specialized hooks
export * from './analytics';
export * from './mutations';
