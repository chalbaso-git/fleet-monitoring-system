// Vehicle hooks exports
export * from './useVehicle';
export * from './queryKeys';

// Re-export common hook patterns for convenience
export {
  useVehicles,
  useVehicle,
  useVehicleDetail,
  useActiveVehicles,
  useVehiclesByStatus,
  useVehiclesByType,
  useVehiclesWithAlerts,
  useVehiclesDueForMaintenance,
  useVehiclesRequiringAttention,
  useFleetSummary,
  useVehicleAnalytics,
  useVehicleHistory,
  useVehicleRecommendations,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useUpdateVehicleLocation,
  useUpdateVehicleStatus,
  useAssignDriver,
  useUnassignDriver,
  useAddMaintenanceRecord,
  useScheduleMaintenance,
  usePerformHealthCheck,
  useBulkUpdateVehicles,
  useBulkDeleteVehicles,
  useExportVehicles,
} from './useVehicle';

export {
  VEHICLE_QUERY_KEYS,
  VehicleQueryUtils,
} from './queryKeys';
