/**
 * Query keys for vehicle-related React Query operations
 */
export const VEHICLE_QUERY_KEYS = {
  BASE: ['vehicles'] as const,
  
  // List queries
  ALL: ['vehicles', 'all'] as const,
  LIST: (filters?: any) => ['vehicles', 'list', { filters }] as const,
  ACTIVE: ['vehicles', 'active'] as const,
  BY_STATUS: (status: string) => ['vehicles', 'by-status', status] as const,
  BY_TYPE: (type: string) => ['vehicles', 'by-type', type] as const,
  WITH_ALERTS: ['vehicles', 'with-alerts'] as const,
  MAINTENANCE_DUE: ['vehicles', 'maintenance-due'] as const,
  REQUIRING_ATTENTION: ['vehicles', 'requiring-attention'] as const,
  
  // Detail queries
  DETAIL: (vehicleId: string) => ['vehicles', 'detail', vehicleId] as const,
  BASIC: (vehicleId: string) => ['vehicles', 'basic', vehicleId] as const,
  LOCATION: (vehicleId: string) => ['vehicles', 'location', vehicleId] as const,
  
  // Analytics queries
  ANALYTICS: (vehicleId?: string, startDate?: string, endDate?: string, options?: any) =>
    ['vehicles', 'analytics', { vehicleId, startDate, endDate, options }] as const,
  FLEET_SUMMARY: ['vehicles', 'fleet-summary'] as const,
  HISTORY: (vehicleId: string, filters?: any) => 
    ['vehicles', 'history', vehicleId, { filters }] as const,
  
  // Maintenance queries
  MAINTENANCE: (vehicleId: string) => ['vehicles', 'maintenance', vehicleId] as const,
  RECOMMENDATIONS: (vehicleId: string) => ['vehicles', 'recommendations', vehicleId] as const,
  HEALTH_CHECK: (vehicleId: string) => ['vehicles', 'health-check', vehicleId] as const,
  
  // Document and geofence queries
  DOCUMENTS: (vehicleId: string) => ['vehicles', 'documents', vehicleId] as const,
  GEOFENCES: (vehicleId: string) => ['vehicles', 'geofences', vehicleId] as const,
} as const;

/**
 * Helper functions for query key management
 */
export const VehicleQueryUtils = {
  /**
   * Get all vehicle-related query keys
   */
  getAllKeys: () => VEHICLE_QUERY_KEYS.BASE,
  
  /**
   * Get all keys for a specific vehicle
   */
  getVehicleKeys: (vehicleId: string) => 
    ['vehicles', vehicleId] as const,
  
  /**
   * Get all list query keys
   */
  getListKeys: () => ['vehicles', 'list'] as const,
  
  /**
   * Get all analytics keys
   */
  getAnalyticsKeys: () => ['vehicles', 'analytics'] as const,
  
  /**
   * Get all maintenance keys
   */
  getMaintenanceKeys: () => ['vehicles', 'maintenance'] as const,
  
  /**
   * Check if a query key is vehicle-related
   */
  isVehicleKey: (queryKey: unknown[]): boolean => {
    return Array.isArray(queryKey) && queryKey[0] === 'vehicles';
  },
  
  /**
   * Extract vehicle ID from a vehicle query key if present
   */
  extractVehicleId: (queryKey: unknown[]): string | undefined => {
    if (!VehicleQueryUtils.isVehicleKey(queryKey)) return undefined;
    
    // For detail/basic queries: ['vehicles', 'detail', vehicleId]
    if (queryKey.length >= 3 && typeof queryKey[2] === 'string') {
      return queryKey[2];
    }
    
    // For other queries with object parameters
    if (queryKey.length >= 3 && typeof queryKey[2] === 'object') {
      const params = queryKey[2] as any;
      return params?.vehicleId;
    }
    
    return undefined;
  },
  
  /**
   * Check if a query key represents a list query
   */
  isListQuery: (queryKey: unknown[]): boolean => {
    if (!VehicleQueryUtils.isVehicleKey(queryKey)) return false;
    
    const listTypes = [
      'all', 'list', 'active', 'by-status', 'by-type', 
      'with-alerts', 'maintenance-due', 'requiring-attention'
    ];
    return queryKey.length >= 2 && listTypes.includes(queryKey[1] as string);
  },
  
  /**
   * Check if a query key represents a detail query
   */
  isDetailQuery: (queryKey: unknown[]): boolean => {
    if (!VehicleQueryUtils.isVehicleKey(queryKey)) return false;
    
    const detailTypes = ['detail', 'basic', 'location', 'recommendations', 'health-check'];
    return queryKey.length >= 2 && detailTypes.includes(queryKey[1] as string);
  },
  
  /**
   * Check if a query key represents an analytics query
   */
  isAnalyticsQuery: (queryKey: unknown[]): boolean => {
    if (!VehicleQueryUtils.isVehicleKey(queryKey)) return false;
    
    const analyticsTypes = ['analytics', 'fleet-summary', 'history'];
    return queryKey.length >= 2 && analyticsTypes.includes(queryKey[1] as string);
  },
  
  /**
   * Check if a query key represents a maintenance query
   */
  isMaintenanceQuery: (queryKey: unknown[]): boolean => {
    if (!VehicleQueryUtils.isVehicleKey(queryKey)) return false;
    
    const maintenanceTypes = ['maintenance', 'recommendations', 'health-check'];
    return queryKey.length >= 2 && maintenanceTypes.includes(queryKey[1] as string);
  },
} as const;
