/**
 * Vehicle response types for API communication
 */

import { 
  Vehicle, 
  VehicleWithMetadata, 
  VehiclePerformanceMetrics,
  VehicleMaintenanceRecord,
  VehicleAlert,
  VehicleDocument,
  VehicleGeofence
} from '@/types/entities/vehicle';

/**
 * Standard API response wrapper for vehicles
 */
export interface VehicleApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Response for vehicle deletion - matches backend response
 */
export interface DeleteVehicleResponse {
  success: boolean;
  message: string;
  vehicleId?: string;
  timestamp: string;
}

/**
 * Response for creating a new vehicle
 */
export interface CreateVehicleResponse {
  success: boolean;
  message: string;
  vehicle?: Vehicle;
  vehicleId?: string;
  timestamp: string;
}

/**
 * Response for updating a vehicle
 */
export interface UpdateVehicleResponse {
  success: boolean;
  message: string;
  vehicle?: Vehicle;
  changes?: Record<string, { from: any; to: any }>;
  timestamp: string;
}

/**
 * Response for getting vehicles list
 */
export interface GetVehiclesResponse {
  success: boolean;
  vehicles: Vehicle[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  filters?: Record<string, any>;
  timestamp: string;
}

/**
 * Response for getting detailed vehicle information
 */
export interface GetVehicleDetailResponse {
  success: boolean;
  vehicle: VehicleWithMetadata;
  relatedData?: {
    maintenanceRecords: VehicleMaintenanceRecord[];
    recentAlerts: VehicleAlert[];
    documents: VehicleDocument[];
    geofences: VehicleGeofence[];
  };
  timestamp: string;
}

/**
 * Response for vehicle analytics
 */
export interface VehicleAnalyticsResponse {
  success: boolean;
  vehicleId?: string;
  period: {
    startDate: string;
    endDate: string;
  };
  analytics: {
    performance: VehiclePerformanceMetrics;
    utilization: {
      totalHours: number;
      activeHours: number;
      idleHours: number;
      utilizationRate: number;
      efficiency: number;
    };
    maintenance: {
      totalCost: number;
      serviceCount: number;
      averageCostPerService: number;
      upcomingServices: number;
      overdueServices: number;
    };
    costs: {
      fuel: number;
      maintenance: number;
      insurance: number;
      depreciation: number;
      total: number;
      costPerKm: number;
      costPerDay: number;
    };
    trends: {
      daily: Array<{
        date: string;
        mileage: number;
        fuelConsumption: number;
        costs: number;
        alerts: number;
      }>;
      weekly: Array<{
        week: string;
        averageMileage: number;
        totalCosts: number;
        alertCount: number;
        utilizationRate: number;
      }>;
      monthly: Array<{
        month: string;
        totalMileage: number;
        totalCosts: number;
        maintenanceCount: number;
        avgUtilization: number;
      }>;
    };
  };
  timestamp: string;
}

/**
 * Response for vehicle fleet summary
 */
export interface VehicleFleetSummaryResponse {
  success: boolean;
  summary: {
    totalVehicles: number;
    activeVehicles: number;
    inactiveVehicles: number;
    inMaintenance: number;
    outOfService: number;
    vehiclesByType: Record<string, number>;
    vehiclesByStatus: Record<string, number>;
    averageAge: number;
    totalMileage: number;
    alertsSummary: {
      total: number;
      critical: number;
      high: number;
      medium: number;
      low: number;
    };
    maintenanceSummary: {
      upToDate: number;
      dueSoon: number;
      overdue: number;
      inMaintenance: number;
      critical: number;
    };
    performance: {
      averageFuelEfficiency: number;
      averageUtilization: number;
      averageUptime: number;
      totalCarbonEmissions: number;
    };
  };
  timestamp: string;
}

/**
 * Response for vehicle location updates
 */
export interface VehicleLocationResponse {
  success: boolean;
  message: string;
  location: {
    vehicleId: string;
    latitude: number;
    longitude: number;
    address?: string;
    timestamp: string;
    speed?: number;
    heading?: number;
    accuracy?: number;
  };
  timestamp: string;
}

/**
 * Response for vehicle maintenance operations
 */
export interface VehicleMaintenanceResponse {
  success: boolean;
  message: string;
  maintenanceRecord?: VehicleMaintenanceRecord;
  updatedVehicle?: Vehicle;
  nextScheduledMaintenance?: {
    type: string;
    scheduledFor: string;
    estimatedCost: number;
  };
  timestamp: string;
}

/**
 * Response for vehicle document operations
 */
export interface VehicleDocumentResponse {
  success: boolean;
  message: string;
  document?: VehicleDocument;
  uploadUrl?: string;
  downloadUrl?: string;
  timestamp: string;
}

/**
 * Response for vehicle geofence operations
 */
export interface VehicleGeofenceResponse {
  success: boolean;
  message: string;
  geofence?: VehicleGeofence;
  activeGeofences?: VehicleGeofence[];
  violations?: Array<{
    type: 'entry' | 'exit' | 'dwell';
    timestamp: string;
    location: {
      latitude: number;
      longitude: number;
    };
  }>;
  timestamp: string;
}

/**
 * Response for vehicle status updates
 */
export interface VehicleStatusResponse {
  success: boolean;
  message: string;
  previousStatus: string;
  newStatus: string;
  vehicle?: Vehicle;
  statusHistory?: Array<{
    status: string;
    changedAt: string;
    changedBy: string;
    reason?: string;
  }>;
  timestamp: string;
}

/**
 * Response for bulk vehicle operations
 */
export interface BulkVehicleOperationResponse {
  success: boolean;
  message: string;
  results: Array<{
    vehicleId: string;
    success: boolean;
    message?: string;
    error?: string;
  }>;
  successCount: number;
  failureCount: number;
  timestamp: string;
}

/**
 * Response for vehicle export operations
 */
export interface VehicleExportResponse {
  success: boolean;
  message: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: number;
  format: string;
  expiresAt: string;
  timestamp: string;
}

/**
 * Response for vehicle transfer operations
 */
export interface VehicleTransferResponse {
  success: boolean;
  message: string;
  transfer: {
    vehicleId: string;
    fromOwnerId: string;
    toOwnerId: string;
    transferDate: string;
    status: 'pending' | 'completed' | 'cancelled';
  };
  updatedVehicle?: Vehicle;
  timestamp: string;
}

/**
 * Response for vehicle recommendations
 */
export interface VehicleRecommendationsResponse {
  success: boolean;
  vehicleId: string;
  recommendations: {
    maintenance: Array<{
      type: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      estimatedCost: number;
      dueDate?: string;
      impact: string;
    }>;
    performance: Array<{
      category: 'fuel' | 'utilization' | 'maintenance' | 'safety';
      suggestion: string;
      potentialSavings: number;
      difficulty: 'easy' | 'medium' | 'hard';
    }>;
    cost: Array<{
      category: 'fuel' | 'maintenance' | 'insurance' | 'operations';
      description: string;
      currentCost: number;
      potentialSavings: number;
      timeframe: string;
    }>;
  };
  timestamp: string;
}

/**
 * Response for vehicle health check
 */
export interface VehicleHealthCheckResponse {
  success: boolean;
  vehicleId: string;
  healthScore: number; // 0-100
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  checks: Array<{
    category: string;
    status: 'pass' | 'warning' | 'fail';
    score: number;
    message: string;
    details?: string;
  }>;
  recommendations: string[];
  nextCheckDate: string;
  timestamp: string;
}
