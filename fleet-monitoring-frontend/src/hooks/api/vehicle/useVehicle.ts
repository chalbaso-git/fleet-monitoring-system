import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { vehicleApiService } from '@/services/api/vehicle/vehicleApiService';
import { 
  CreateVehicleRequest,
  UpdateVehicleRequest,
  GetVehiclesRequest,
  UpdateVehicleLocationRequest,
  AssignDriverRequest,
  AddMaintenanceRecordRequest,
  UpdateVehicleStatusRequest,
  GetVehicleAnalyticsRequest,
  ExportVehiclesRequest,
  BulkUpdateVehiclesRequest,
  GetVehicleHistoryRequest,
  ScheduleMaintenanceRequest
} from '@/types/requests/vehicle';
import {
  DeleteVehicleResponse,
  CreateVehicleResponse,
  UpdateVehicleResponse,
  GetVehiclesResponse,
  GetVehicleDetailResponse,
  VehicleFleetSummaryResponse,
  VehicleLocationResponse,
  VehicleMaintenanceResponse,
  VehicleStatusResponse,
  BulkVehicleOperationResponse,
  VehicleExportResponse,
  VehicleRecommendationsResponse,
  VehicleHealthCheckResponse
} from '@/types/responses/vehicle';
import { Vehicle, VehicleWithMetadata } from '@/types/entities/vehicle';
import { VEHICLE_QUERY_KEYS } from '@/hooks/api/vehicle/queryKeys';

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Hook to fetch vehicles with optional filtering
 */
export function useVehicles(request?: GetVehiclesRequest): UseQueryResult<GetVehiclesResponse, Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.LIST(request),
    queryFn: () => vehicleApiService.getVehicles(request),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch a specific vehicle's detailed information
 */
export function useVehicleDetail(vehicleId: string): UseQueryResult<GetVehicleDetailResponse, Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId),
    queryFn: () => vehicleApiService.getVehicleById(vehicleId),
    enabled: !!vehicleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch basic vehicle information
 */
export function useVehicle(vehicleId: string): UseQueryResult<Vehicle, Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId),
    queryFn: () => vehicleApiService.getVehicle(vehicleId),
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch active vehicles
 */
export function useActiveVehicles(): UseQueryResult<Vehicle[], Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.ACTIVE,
    queryFn: () => vehicleApiService.getActiveVehicles(),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch vehicles by status
 */
export function useVehiclesByStatus(status: string): UseQueryResult<Vehicle[], Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.BY_STATUS(status),
    queryFn: () => vehicleApiService.getVehiclesByStatus(status),
    enabled: !!status,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch vehicles by type
 */
export function useVehiclesByType(type: string): UseQueryResult<Vehicle[], Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.BY_TYPE(type),
    queryFn: () => vehicleApiService.getVehiclesByType(type),
    enabled: !!type,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch vehicles with alerts
 */
export function useVehiclesWithAlerts(): UseQueryResult<VehicleWithMetadata[], Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.WITH_ALERTS,
    queryFn: () => vehicleApiService.getVehiclesWithAlerts(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

/**
 * Hook to fetch vehicles due for maintenance
 */
export function useVehiclesDueForMaintenance(): UseQueryResult<VehicleWithMetadata[], Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.MAINTENANCE_DUE,
    queryFn: () => vehicleApiService.getVehiclesDueForMaintenance(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

/**
 * Hook to fetch vehicles requiring attention
 */
export function useVehiclesRequiringAttention() {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.REQUIRING_ATTENTION,
    queryFn: () => vehicleApiService.getVehiclesRequiringAttention(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}

/**
 * Hook to fetch fleet summary
 */
export function useFleetSummary(): UseQueryResult<VehicleFleetSummaryResponse, Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.FLEET_SUMMARY,
    queryFn: () => vehicleApiService.getFleetSummary(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

/**
 * Hook to fetch vehicle analytics
 */
export function useVehicleAnalytics(request: GetVehicleAnalyticsRequest) {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.ANALYTICS(
      request.vehicleId,
      request.startDate.toISOString(),
      request.endDate.toISOString(),
      {
        includePerformance: request.includePerformance,
        includeUtilization: request.includeUtilization,
        includeMaintenance: request.includeMaintenance,
        includeCosts: request.includeCosts,
        groupBy: request.groupBy,
      }
    ),
    queryFn: () => vehicleApiService.getVehicleAnalytics(request),
    enabled: !!request.startDate && !!request.endDate,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch vehicle history
 */
export function useVehicleHistory(request: GetVehicleHistoryRequest) {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.HISTORY(request.vehicleId, {
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
      includeLocations: request.includeLocations,
      includeAlerts: request.includeAlerts,
      includeMaintenance: request.includeMaintenance,
      includeRoutes: request.includeRoutes,
      limit: request.limit,
      offset: request.offset,
    }),
    queryFn: () => vehicleApiService.getVehicleHistory(request),
    enabled: !!request.vehicleId && !!request.startDate && !!request.endDate,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch vehicle recommendations
 */
export function useVehicleRecommendations(vehicleId: string): UseQueryResult<VehicleRecommendationsResponse, Error> {
  return useQuery({
    queryKey: VEHICLE_QUERY_KEYS.RECOMMENDATIONS(vehicleId),
    queryFn: () => vehicleApiService.getVehicleRecommendations(vehicleId),
    enabled: !!vehicleId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Hook to create a new vehicle
 */
export function useCreateVehicle(): UseMutationResult<CreateVehicleResponse, Error, CreateVehicleRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateVehicleRequest) => vehicleApiService.createVehicle(request),
    onSuccess: (data) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASE });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.FLEET_SUMMARY });
      
      // Add new vehicle to cache if available
      if (data.vehicle) {
        queryClient.setQueryData(
          VEHICLE_QUERY_KEYS.BASIC(data.vehicle.id),
          data.vehicle
        );
      }
    },
    onError: (error) => {
      console.error('Failed to create vehicle:', error);
    },
  });
}

/**
 * Hook to update a vehicle
 */
export function useUpdateVehicle(): UseMutationResult<UpdateVehicleResponse, Error, UpdateVehicleRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateVehicleRequest) => vehicleApiService.updateVehicle(request),
    onSuccess: (data, variables) => {
      const { vehicleId } = variables;
      
      // Invalidate and update specific vehicle queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId) });
      
      // Update basic vehicle cache if available
      if (data.vehicle) {
        queryClient.setQueryData(
          VEHICLE_QUERY_KEYS.BASIC(vehicleId),
          data.vehicle
        );
      }
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASE });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.FLEET_SUMMARY });
    },
  });
}

/**
 * Hook to delete a vehicle with distributed transaction
 */
export function useDeleteVehicle(): UseMutationResult<DeleteVehicleResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => vehicleApiService.deleteVehicle(vehicleId),
    onSuccess: (data, vehicleId) => {
      // Remove vehicle from cache
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.LOCATION(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.MAINTENANCE(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.RECOMMENDATIONS(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.HEALTH_CHECK(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.DOCUMENTS(vehicleId) });
      queryClient.removeQueries({ queryKey: VEHICLE_QUERY_KEYS.GEOFENCES(vehicleId) });
      
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASE });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.FLEET_SUMMARY });
    },
    onError: (error) => {
      console.error('Failed to delete vehicle:', error);
    },
  });
}

/**
 * Hook to update vehicle location
 */
export function useUpdateVehicleLocation(): UseMutationResult<VehicleLocationResponse, Error, UpdateVehicleLocationRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateVehicleLocationRequest) => vehicleApiService.updateVehicleLocation(request),
    onSuccess: (data, variables) => {
      const { vehicleId } = variables;
      
      // Update location cache
      queryClient.setQueryData(
        VEHICLE_QUERY_KEYS.LOCATION(vehicleId),
        data.location
      );
      
      // Invalidate detail view to refresh with new location
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
    },
  });
}

/**
 * Hook to update vehicle status
 */
export function useUpdateVehicleStatus(): UseMutationResult<VehicleStatusResponse, Error, UpdateVehicleStatusRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateVehicleStatusRequest) => vehicleApiService.updateStatus(request),
    onSuccess: (data, variables) => {
      const { vehicleId } = variables;
      
      // Invalidate vehicle queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId) });
      
      // Invalidate status-based list queries
      queryClient.invalidateQueries({ 
        queryKey: VEHICLE_QUERY_KEYS.BASE,
        predicate: (query) => 
          Array.isArray(query.queryKey) && 
          query.queryKey.length > 1 && 
          query.queryKey[1] === 'by-status'
      });
      
      // Invalidate summary and attention lists
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.FLEET_SUMMARY });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.REQUIRING_ATTENTION });
    },
  });
}

/**
 * Hook to assign driver to vehicle
 */
export function useAssignDriver(): UseMutationResult<UpdateVehicleResponse, Error, AssignDriverRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AssignDriverRequest) => vehicleApiService.assignDriver(request),
    onSuccess: (data, variables) => {
      const { vehicleId } = variables;
      
      // Invalidate vehicle queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId) });
      
      // Update vehicle cache if available
      if (data.vehicle) {
        queryClient.setQueryData(
          VEHICLE_QUERY_KEYS.BASIC(vehicleId),
          data.vehicle
        );
      }
    },
  });
}

/**
 * Hook to unassign driver from vehicle
 */
export function useUnassignDriver(): UseMutationResult<UpdateVehicleResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => vehicleApiService.unassignDriver(vehicleId),
    onSuccess: (data, vehicleId) => {
      // Invalidate vehicle queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId) });
      
      // Update vehicle cache if available
      if (data.vehicle) {
        queryClient.setQueryData(
          VEHICLE_QUERY_KEYS.BASIC(vehicleId),
          data.vehicle
        );
      }
    },
  });
}

/**
 * Hook to add maintenance record
 */
export function useAddMaintenanceRecord(): UseMutationResult<VehicleMaintenanceResponse, Error, AddMaintenanceRecordRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AddMaintenanceRecordRequest) => vehicleApiService.addMaintenanceRecord(request),
    onSuccess: (data, variables) => {
      const { vehicleId } = variables;
      
      // Invalidate maintenance-related queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.MAINTENANCE(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.RECOMMENDATIONS(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.HEALTH_CHECK(vehicleId) });
      
      // Invalidate maintenance-related lists
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.MAINTENANCE_DUE });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.REQUIRING_ATTENTION });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.FLEET_SUMMARY });
    },
  });
}

/**
 * Hook to schedule maintenance
 */
export function useScheduleMaintenance(): UseMutationResult<VehicleMaintenanceResponse, Error, ScheduleMaintenanceRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ScheduleMaintenanceRequest) => vehicleApiService.scheduleMaintenance(request),
    onSuccess: (data, variables) => {
      const { vehicleId } = variables;
      
      // Invalidate maintenance-related queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.MAINTENANCE(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.RECOMMENDATIONS(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.MAINTENANCE_DUE });
    },
  });
}

/**
 * Hook to perform health check
 */
export function usePerformHealthCheck(): UseMutationResult<VehicleHealthCheckResponse, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleId: string) => vehicleApiService.performHealthCheck(vehicleId),
    onSuccess: (data, vehicleId) => {
      // Update health check cache
      queryClient.setQueryData(
        VEHICLE_QUERY_KEYS.HEALTH_CHECK(vehicleId),
        data
      );
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.RECOMMENDATIONS(vehicleId) });
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.REQUIRING_ATTENTION });
    },
  });
}

/**
 * Hook to bulk update vehicles
 */
export function useBulkUpdateVehicles(): UseMutationResult<BulkVehicleOperationResponse, Error, BulkUpdateVehiclesRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: BulkUpdateVehiclesRequest) => vehicleApiService.bulkUpdateVehicles(request),
    onSuccess: (data, variables) => {
      // Invalidate all vehicle-related queries since multiple vehicles changed
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASE });
      
      // Specifically invalidate affected vehicles
      variables.vehicleIds.forEach(vehicleId => {
        queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.DETAIL(vehicleId) });
        queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASIC(vehicleId) });
      });
    },
  });
}

/**
 * Hook to bulk delete vehicles
 */
export function useBulkDeleteVehicles(): UseMutationResult<BulkVehicleOperationResponse, Error, string[]> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vehicleIds: string[]) => vehicleApiService.bulkDeleteVehicles(vehicleIds),
    onSuccess: (data, vehicleIds) => {
      // Remove all affected vehicles from cache
      vehicleIds.forEach(vehicleId => {
        queryClient.removeQueries({ 
          queryKey: VEHICLE_QUERY_KEYS.BASE,
          predicate: (query) => 
            Array.isArray(query.queryKey) && 
            query.queryKey.includes(vehicleId)
        });
      });
      
      // Invalidate all list queries
      queryClient.invalidateQueries({ queryKey: VEHICLE_QUERY_KEYS.BASE });
    },
  });
}

/**
 * Hook to export vehicles
 */
export function useExportVehicles(): UseMutationResult<VehicleExportResponse, Error, ExportVehiclesRequest> {
  return useMutation({
    mutationFn: (request: ExportVehiclesRequest) => vehicleApiService.exportVehicles(request),
    onSuccess: (data) => {
      // Auto-download if download URL is provided
      if (data.downloadUrl) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.fileName || `vehicles_export.${data.format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
  });
}
