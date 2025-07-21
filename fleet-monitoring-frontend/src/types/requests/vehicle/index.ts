/**
 * Vehicle request types for API communication
 */

import { VehicleStatus, VehicleType, InsuranceCoverage, DocumentType, GeofenceType } from '@/types/entities/vehicle';

/**
 * Request to delete a vehicle - matches backend VehicleController.DeleteVehicle
 */
export interface DeleteVehicleRequest {
  vehicleId: string;
}

/**
 * Request to create a new vehicle
 */
export interface CreateVehicleRequest {
  name: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin?: string;
  type: VehicleType;
  status?: VehicleStatus;
  initialMileage?: number;
  fuelCapacity?: number;
  color?: string;
  notes?: string;
}

/**
 * Request to update vehicle information
 */
export interface UpdateVehicleRequest {
  vehicleId: string;
  name?: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  type?: VehicleType;
  status?: VehicleStatus;
  notes?: string;
  isActive?: boolean;
}

/**
 * Request to get vehicles with filters
 */
export interface GetVehiclesRequest {
  status?: VehicleStatus[];
  type?: VehicleType[];
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  isActive?: boolean;
  hasAlerts?: boolean;
  maintenanceDue?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'name' | 'make' | 'model' | 'year' | 'licensePlate' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

/**
 * Request to update vehicle location
 */
export interface UpdateVehicleLocationRequest {
  vehicleId: string;
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: string;
  speed?: number;
  heading?: number;
  accuracy?: number;
}

/**
 * Request to assign driver to vehicle
 */
export interface AssignDriverRequest {
  vehicleId: string;
  driverId: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

/**
 * Request to add vehicle maintenance record
 */
export interface AddMaintenanceRecordRequest {
  vehicleId: string;
  type: string;
  description: string;
  cost: number;
  currency: string;
  performedAt: string;
  performedBy: string;
  nextScheduledAt?: string;
  partsCost?: number;
  laborCost?: number;
  notes?: string;
  attachments?: string[];
}

/**
 * Request to update vehicle insurance
 */
export interface UpdateVehicleInsuranceRequest {
  vehicleId: string;
  provider: string;
  policyNumber: string;
  startDate: string;
  endDate: string;
  coverage: InsuranceCoverage[];
  premium: number;
  currency: string;
  isActive?: boolean;
}

/**
 * Request to add vehicle document
 */
export interface AddVehicleDocumentRequest {
  vehicleId: string;
  type: DocumentType;
  title: string;
  description?: string;
  file: File;
  expiresAt?: string;
}

/**
 * Request to create geofence for vehicle
 */
export interface CreateVehicleGeofenceRequest {
  vehicleId: string;
  name: string;
  type: GeofenceType;
  coordinates: {
    type: 'circle' | 'polygon';
    center?: {
      latitude: number;
      longitude: number;
    };
    radius?: number; // meters
    polygon?: Array<{
      latitude: number;
      longitude: number;
    }>;
  };
  notifications: Array<{
    type: 'entry' | 'exit' | 'dwell';
    isEnabled: boolean;
    recipients: string[];
    message: string;
  }>;
}

/**
 * Request to update vehicle status
 */
export interface UpdateVehicleStatusRequest {
  vehicleId: string;
  status: VehicleStatus;
  reason?: string;
  effectiveDate?: string;
  notes?: string;
}

/**
 * Request to get vehicle analytics
 */
export interface GetVehicleAnalyticsRequest {
  vehicleId?: string;
  startDate: Date;
  endDate: Date;
  includePerformance?: boolean;
  includeUtilization?: boolean;
  includeMaintenance?: boolean;
  includeCosts?: boolean;
  groupBy?: 'day' | 'week' | 'month';
}

/**
 * Request to export vehicle data
 */
export interface ExportVehiclesRequest {
  format: 'csv' | 'xlsx' | 'pdf';
  filters?: GetVehiclesRequest;
  includeDetails?: boolean;
  includePerformance?: boolean;
  includeMaintenance?: boolean;
  includeAlerts?: boolean;
}

/**
 * Request to bulk update vehicles
 */
export interface BulkUpdateVehiclesRequest {
  vehicleIds: string[];
  updates: {
    status?: VehicleStatus;
    assignedDriverId?: string;
    tags?: string[];
    notes?: string;
  };
}

/**
 * Request to get vehicle history
 */
export interface GetVehicleHistoryRequest {
  vehicleId: string;
  startDate: Date;
  endDate: Date;
  includeLocations?: boolean;
  includeAlerts?: boolean;
  includeMaintenance?: boolean;
  includeRoutes?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Request to schedule vehicle maintenance
 */
export interface ScheduleMaintenanceRequest {
  vehicleId: string;
  type: string;
  scheduledFor: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedCost?: number;
  assignedTo?: string;
  notes?: string;
  recurring?: {
    interval: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    intervalCount: number;
    endDate?: string;
  };
}

/**
 * Request to transfer vehicle ownership
 */
export interface TransferVehicleRequest {
  vehicleId: string;
  newOwnerId: string;
  transferDate: string;
  reason?: string;
  documents?: string[];
  notes?: string;
}

/**
 * Request to deactivate/reactivate vehicle
 */
export interface SetVehicleActiveRequest {
  vehicleId: string;
  isActive: boolean;
  reason?: string;
  effectiveDate?: string;
}
