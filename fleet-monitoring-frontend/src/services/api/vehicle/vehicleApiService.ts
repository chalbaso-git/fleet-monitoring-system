import apiClient from '@/services/api/client';
import { 
  CreateVehicleRequest,
  UpdateVehicleRequest,
  GetVehiclesRequest,
  UpdateVehicleLocationRequest,
  AssignDriverRequest,
  AddMaintenanceRecordRequest,
  UpdateVehicleInsuranceRequest,
  AddVehicleDocumentRequest,
  CreateVehicleGeofenceRequest,
  UpdateVehicleStatusRequest,
  GetVehicleAnalyticsRequest,
  ExportVehiclesRequest,
  BulkUpdateVehiclesRequest,
  GetVehicleHistoryRequest,
  ScheduleMaintenanceRequest,
  TransferVehicleRequest,
  SetVehicleActiveRequest
} from '@/types/requests/vehicle';
import {
  DeleteVehicleResponse,
  CreateVehicleResponse,
  UpdateVehicleResponse,
  GetVehiclesResponse,
  GetVehicleDetailResponse,
  VehicleAnalyticsResponse,
  VehicleFleetSummaryResponse,
  VehicleLocationResponse,
  VehicleMaintenanceResponse,
  VehicleDocumentResponse,
  VehicleGeofenceResponse,
  VehicleStatusResponse,
  BulkVehicleOperationResponse,
  VehicleExportResponse,
  VehicleTransferResponse,
  VehicleRecommendationsResponse,
  VehicleHealthCheckResponse
} from '@/types/responses/vehicle';
import { Vehicle, VehicleWithMetadata } from '@/types/entities/vehicle';
import { AxiosResponse, AxiosInstance } from 'axios';

/**
 * Vehicle API Service for communication with backend VehicleController
 * Provides methods for vehicle management with distributed transactions
 */
export class VehicleApiService {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Deletes a vehicle with distributed transaction (Database + Redis)
   * Corresponds to backend VehicleController.DeleteVehicle
   */
  async deleteVehicle(vehicleId: string): Promise<DeleteVehicleResponse> {
    const response: AxiosResponse<DeleteVehicleResponse> = await this.apiClient.delete(
      `/api/vehicle/${vehicleId}`
    );
    return response.data;
  }

  /**
   * Creates a new vehicle
   */
  async createVehicle(request: CreateVehicleRequest): Promise<CreateVehicleResponse> {
    const response: AxiosResponse<CreateVehicleResponse> = await this.apiClient.post(
      '/api/vehicle',
      request
    );
    return response.data;
  }

  /**
   * Updates an existing vehicle
   */
  async updateVehicle(request: UpdateVehicleRequest): Promise<UpdateVehicleResponse> {
    const { vehicleId, ...updates } = request;
    const response: AxiosResponse<UpdateVehicleResponse> = await this.apiClient.put(
      `/api/vehicle/${vehicleId}`,
      updates
    );
    return response.data;
  }

  /**
   * Gets vehicles with optional filtering and pagination
   */
  async getVehicles(request?: GetVehiclesRequest): Promise<GetVehiclesResponse> {
    const params = this.buildVehicleSearchParams(request);
    const response: AxiosResponse<GetVehiclesResponse> = await this.apiClient.get(
      `/api/vehicle?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Helper method to build search parameters for vehicle queries
   */
  private buildVehicleSearchParams(request?: GetVehiclesRequest): URLSearchParams {
    const params = new URLSearchParams();
    
    if (!request) return params;

    // Handle array parameters
    request.status?.forEach(status => params.append('status', status));
    request.type?.forEach(type => params.append('type', type));
    
    // Handle simple parameters
    const simpleParams = [
      { key: 'make', value: request.make },
      { key: 'model', value: request.model },
      { key: 'yearFrom', value: request.yearFrom?.toString() },
      { key: 'yearTo', value: request.yearTo?.toString() },
      { key: 'isActive', value: request.isActive?.toString() },
      { key: 'hasAlerts', value: request.hasAlerts?.toString() },
      { key: 'maintenanceDue', value: request.maintenanceDue?.toString() },
      { key: 'page', value: request.page?.toString() },
      { key: 'pageSize', value: request.pageSize?.toString() },
      { key: 'sortBy', value: request.sortBy },
      { key: 'sortOrder', value: request.sortOrder },
      { key: 'searchTerm', value: request.searchTerm },
    ];

    simpleParams.forEach(({ key, value }) => {
      if (value) params.append(key, value);
    });

    return params;
  }

  /**
   * Gets detailed information for a specific vehicle
   */
  async getVehicleById(vehicleId: string): Promise<GetVehicleDetailResponse> {
    const response: AxiosResponse<GetVehicleDetailResponse> = await this.apiClient.get(
      `/api/vehicle/${vehicleId}/detail`
    );
    return response.data;
  }

  /**
   * Gets basic vehicle information
   */
  async getVehicle(vehicleId: string): Promise<Vehicle> {
    const response: AxiosResponse<{ vehicle: Vehicle }> = await this.apiClient.get(
      `/api/vehicle/${vehicleId}`
    );
    return response.data.vehicle;
  }

  /**
   * Updates vehicle location
   */
  async updateVehicleLocation(request: UpdateVehicleLocationRequest): Promise<VehicleLocationResponse> {
    const { vehicleId, ...locationData } = request;
    const response: AxiosResponse<VehicleLocationResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/location`,
      locationData
    );
    return response.data;
  }

  /**
   * Assigns a driver to a vehicle
   */
  async assignDriver(request: AssignDriverRequest): Promise<UpdateVehicleResponse> {
    const { vehicleId, ...assignmentData } = request;
    const response: AxiosResponse<UpdateVehicleResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/assign-driver`,
      assignmentData
    );
    return response.data;
  }

  /**
   * Unassigns the current driver from a vehicle
   */
  async unassignDriver(vehicleId: string): Promise<UpdateVehicleResponse> {
    const response: AxiosResponse<UpdateVehicleResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/unassign-driver`
    );
    return response.data;
  }

  /**
   * Adds a maintenance record
   */
  async addMaintenanceRecord(request: AddMaintenanceRecordRequest): Promise<VehicleMaintenanceResponse> {
    const { vehicleId, ...maintenanceData } = request;
    const response: AxiosResponse<VehicleMaintenanceResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/maintenance`,
      maintenanceData
    );
    return response.data;
  }

  /**
   * Schedules future maintenance
   */
  async scheduleMaintenance(request: ScheduleMaintenanceRequest): Promise<VehicleMaintenanceResponse> {
    const { vehicleId, ...scheduleData } = request;
    const response: AxiosResponse<VehicleMaintenanceResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/schedule-maintenance`,
      scheduleData
    );
    return response.data;
  }

  /**
   * Updates vehicle insurance information
   */
  async updateInsurance(request: UpdateVehicleInsuranceRequest): Promise<UpdateVehicleResponse> {
    const { vehicleId, ...insuranceData } = request;
    const response: AxiosResponse<UpdateVehicleResponse> = await this.apiClient.put(
      `/api/vehicle/${vehicleId}/insurance`,
      insuranceData
    );
    return response.data;
  }

  /**
   * Adds a document to a vehicle
   */
  async addDocument(request: AddVehicleDocumentRequest): Promise<VehicleDocumentResponse> {
    const { vehicleId, file, ...documentData } = request;
    
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(documentData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    const response: AxiosResponse<VehicleDocumentResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Deletes a vehicle document
   */
  async deleteDocument(vehicleId: string, documentId: string): Promise<VehicleDocumentResponse> {
    const response: AxiosResponse<VehicleDocumentResponse> = await this.apiClient.delete(
      `/api/vehicle/${vehicleId}/documents/${documentId}`
    );
    return response.data;
  }

  /**
   * Creates a geofence for a vehicle
   */
  async createGeofence(request: CreateVehicleGeofenceRequest): Promise<VehicleGeofenceResponse> {
    const { vehicleId, ...geofenceData } = request;
    const response: AxiosResponse<VehicleGeofenceResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/geofences`,
      geofenceData
    );
    return response.data;
  }

  /**
   * Updates vehicle status
   */
  async updateStatus(request: UpdateVehicleStatusRequest): Promise<VehicleStatusResponse> {
    const { vehicleId, ...statusData } = request;
    const response: AxiosResponse<VehicleStatusResponse> = await this.apiClient.put(
      `/api/vehicle/${vehicleId}/status`,
      statusData
    );
    return response.data;
  }

  /**
   * Sets vehicle active/inactive status
   */
  async setVehicleActive(request: SetVehicleActiveRequest): Promise<UpdateVehicleResponse> {
    const { vehicleId, ...activeData } = request;
    const response: AxiosResponse<UpdateVehicleResponse> = await this.apiClient.put(
      `/api/vehicle/${vehicleId}/active`,
      activeData
    );
    return response.data;
  }

  /**
   * Gets vehicle analytics
   */
  async getVehicleAnalytics(request: GetVehicleAnalyticsRequest): Promise<VehicleAnalyticsResponse> {
    const params = new URLSearchParams({
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
    });

    if (request.vehicleId) params.append('vehicleId', request.vehicleId);
    if (request.includePerformance !== undefined) params.append('includePerformance', request.includePerformance.toString());
    if (request.includeUtilization !== undefined) params.append('includeUtilization', request.includeUtilization.toString());
    if (request.includeMaintenance !== undefined) params.append('includeMaintenance', request.includeMaintenance.toString());
    if (request.includeCosts !== undefined) params.append('includeCosts', request.includeCosts.toString());
    if (request.groupBy) params.append('groupBy', request.groupBy);

    const url = request.vehicleId 
      ? `/api/vehicle/${request.vehicleId}/analytics?${params.toString()}`
      : `/api/vehicle/analytics?${params.toString()}`;

    const response: AxiosResponse<VehicleAnalyticsResponse> = await this.apiClient.get(url);
    return response.data;
  }

  /**
   * Gets fleet summary statistics
   */
  async getFleetSummary(): Promise<VehicleFleetSummaryResponse> {
    const response: AxiosResponse<VehicleFleetSummaryResponse> = await this.apiClient.get(
      '/api/vehicle/fleet-summary'
    );
    return response.data;
  }

  /**
   * Gets vehicle history
   */
  async getVehicleHistory(request: GetVehicleHistoryRequest): Promise<any> {
    const { vehicleId, ...params } = request;
    const searchParams = new URLSearchParams({
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString(),
    });

    if (params.includeLocations !== undefined) searchParams.append('includeLocations', params.includeLocations.toString());
    if (params.includeAlerts !== undefined) searchParams.append('includeAlerts', params.includeAlerts.toString());
    if (params.includeMaintenance !== undefined) searchParams.append('includeMaintenance', params.includeMaintenance.toString());
    if (params.includeRoutes !== undefined) searchParams.append('includeRoutes', params.includeRoutes.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.offset) searchParams.append('offset', params.offset.toString());

    const response = await this.apiClient.get(
      `/api/vehicle/${vehicleId}/history?${searchParams.toString()}`
    );
    return response.data;
  }

  /**
   * Exports vehicle data
   */
  async exportVehicles(request: ExportVehiclesRequest): Promise<VehicleExportResponse> {
    const response: AxiosResponse<VehicleExportResponse> = await this.apiClient.post(
      '/api/vehicle/export',
      request
    );
    return response.data;
  }

  /**
   * Bulk update vehicles
   */
  async bulkUpdateVehicles(request: BulkUpdateVehiclesRequest): Promise<BulkVehicleOperationResponse> {
    const response: AxiosResponse<BulkVehicleOperationResponse> = await this.apiClient.put(
      '/api/vehicle/bulk-update',
      request
    );
    return response.data;
  }

  /**
   * Bulk delete vehicles
   */
  async bulkDeleteVehicles(vehicleIds: string[]): Promise<BulkVehicleOperationResponse> {
    const response: AxiosResponse<BulkVehicleOperationResponse> = await this.apiClient.post(
      '/api/vehicle/bulk-delete',
      { vehicleIds }
    );
    return response.data;
  }

  /**
   * Transfers vehicle ownership
   */
  async transferVehicle(request: TransferVehicleRequest): Promise<VehicleTransferResponse> {
    const { vehicleId, ...transferData } = request;
    const response: AxiosResponse<VehicleTransferResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/transfer`,
      transferData
    );
    return response.data;
  }

  /**
   * Gets vehicle recommendations
   */
  async getVehicleRecommendations(vehicleId: string): Promise<VehicleRecommendationsResponse> {
    const response: AxiosResponse<VehicleRecommendationsResponse> = await this.apiClient.get(
      `/api/vehicle/${vehicleId}/recommendations`
    );
    return response.data;
  }

  /**
   * Performs vehicle health check
   */
  async performHealthCheck(vehicleId: string): Promise<VehicleHealthCheckResponse> {
    const response: AxiosResponse<VehicleHealthCheckResponse> = await this.apiClient.post(
      `/api/vehicle/${vehicleId}/health-check`
    );
    return response.data;
  }

  /**
   * Gets vehicles requiring attention
   */
  async getVehiclesRequiringAttention(): Promise<{
    vehicles: VehicleWithMetadata[];
    criticalCount: number;
    highPriorityCount: number;
    mediumPriorityCount: number;
  }> {
    const response = await this.apiClient.get('/api/vehicle/requiring-attention');
    return response.data;
  }

  /**
   * Gets vehicles by status
   */
  async getVehiclesByStatus(status: string): Promise<Vehicle[]> {
    const response: AxiosResponse<{ vehicles: Vehicle[] }> = await this.apiClient.get(
      `/api/vehicle/by-status/${status}`
    );
    return response.data.vehicles;
  }

  /**
   * Gets vehicles by type
   */
  async getVehiclesByType(type: string): Promise<Vehicle[]> {
    const response: AxiosResponse<{ vehicles: Vehicle[] }> = await this.apiClient.get(
      `/api/vehicle/by-type/${type}`
    );
    return response.data.vehicles;
  }

  /**
   * Gets active vehicles
   */
  async getActiveVehicles(): Promise<Vehicle[]> {
    const response: AxiosResponse<{ vehicles: Vehicle[] }> = await this.apiClient.get(
      '/api/vehicle/active'
    );
    return response.data.vehicles;
  }

  /**
   * Gets vehicles with alerts
   */
  async getVehiclesWithAlerts(): Promise<VehicleWithMetadata[]> {
    const response: AxiosResponse<{ vehicles: VehicleWithMetadata[] }> = await this.apiClient.get(
      '/api/vehicle/with-alerts'
    );
    return response.data.vehicles;
  }

  /**
   * Gets vehicles due for maintenance
   */
  async getVehiclesDueForMaintenance(): Promise<VehicleWithMetadata[]> {
    const response: AxiosResponse<{ vehicles: VehicleWithMetadata[] }> = await this.apiClient.get(
      '/api/vehicle/maintenance-due'
    );
    return response.data.vehicles;
  }
}

// Create default instance
export const vehicleApiService = new VehicleApiService(apiClient);
