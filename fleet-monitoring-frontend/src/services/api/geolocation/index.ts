import apiClient from '@/services/api/client';
import { 
  StoreCoordinateRequest,
  BulkCoordinateRequest,
  CreateGeofenceRequest,
  UpdateGeofenceRequest,
  LocationQueryFilters,
  RouteAnalysisRequest
} from '@/types/requests/geolocation';
import {
  StoreCoordinateResponse,
  VehicleLocationsResponse,
  VehicleTrackingHistoryResponse,
  GeofenceViolationsResponse,
  RealTimeTrackingResponse,
  FleetOverviewResponse,
  RouteOptimizationResponse,
  LocationAnalyticsResponse,
  GeofenceAnalyticsResponse
} from '@/types/responses/geolocation';
import { Geofence, VehicleLocation } from '@/types/entities/geolocation';

/**
 * API service for geolocation operations
 */
export class GeolocationApiService {
  private static readonly BASE_PATH = '/api/geolocation';

  /**
   * Store a single GPS coordinate
   */
  static async storeCoordinate(request: StoreCoordinateRequest): Promise<StoreCoordinateResponse> {
    const response = await apiClient.post<StoreCoordinateResponse>(
      `${this.BASE_PATH}/store-coordinate`,
      request
    );
    return response.data;
  }

  /**
   * Store multiple GPS coordinates in bulk
   */
  static async storeBulkCoordinates(request: BulkCoordinateRequest): Promise<StoreCoordinateResponse> {
    const response = await apiClient.post<StoreCoordinateResponse>(
      `${this.BASE_PATH}/store-bulk-coordinates`,
      request
    );
    return response.data;
  }

  /**
   * Get current locations for all vehicles
   */
  static async getVehicleLocations(filters?: LocationQueryFilters): Promise<VehicleLocationsResponse> {
    const response = await apiClient.get<VehicleLocationsResponse>(
      `${this.BASE_PATH}/vehicles/locations`,
      { params: filters }
    );
    return response.data;
  }

  /**
   * Get location for a specific vehicle
   */
  static async getVehicleLocation(vehicleId: string): Promise<VehicleLocation> {
    const response = await apiClient.get<VehicleLocation>(
      `${this.BASE_PATH}/vehicles/${vehicleId}/location`
    );
    return response.data;
  }

  /**
   * Get tracking history for a vehicle
   */
  static async getVehicleTrackingHistory(
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<VehicleTrackingHistoryResponse> {
    const response = await apiClient.get<VehicleTrackingHistoryResponse>(
      `${this.BASE_PATH}/vehicles/${vehicleId}/history`,
      {
        params: { startDate, endDate }
      }
    );
    return response.data;
  }

  /**
   * Get real-time tracking data for multiple vehicles
   */
  static async getRealTimeTracking(vehicleIds: string[]): Promise<RealTimeTrackingResponse[]> {
    const response = await apiClient.post<RealTimeTrackingResponse[]>(
      `${this.BASE_PATH}/real-time-tracking`,
      { vehicleIds }
    );
    return response.data;
  }

  /**
   * Get fleet overview and statistics
   */
  static async getFleetOverview(): Promise<FleetOverviewResponse> {
    const response = await apiClient.get<FleetOverviewResponse>(
      `${this.BASE_PATH}/fleet/overview`
    );
    return response.data;
  }

  /**
   * Create a new geofence
   */
  static async createGeofence(request: CreateGeofenceRequest): Promise<Geofence> {
    const response = await apiClient.post<Geofence>(
      `${this.BASE_PATH}/geofences`,
      request
    );
    return response.data;
  }

  /**
   * Update an existing geofence
   */
  static async updateGeofence(request: UpdateGeofenceRequest): Promise<Geofence> {
    const response = await apiClient.put<Geofence>(
      `${this.BASE_PATH}/geofences/${request.id}`,
      request
    );
    return response.data;
  }

  /**
   * Delete a geofence
   */
  static async deleteGeofence(geofenceId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/geofences/${geofenceId}`);
  }

  /**
   * Get all geofences
   */
  static async getGeofences(): Promise<Geofence[]> {
    const response = await apiClient.get<Geofence[]>(`${this.BASE_PATH}/geofences`);
    return response.data;
  }

  /**
   * Get geofence by ID
   */
  static async getGeofence(geofenceId: string): Promise<Geofence> {
    const response = await apiClient.get<Geofence>(`${this.BASE_PATH}/geofences/${geofenceId}`);
    return response.data;
  }

  /**
   * Get geofence violations
   */
  static async getGeofenceViolations(
    startDate?: string,
    endDate?: string,
    vehicleIds?: string[],
    geofenceIds?: string[]
  ): Promise<GeofenceViolationsResponse> {
    const response = await apiClient.get<GeofenceViolationsResponse>(
      `${this.BASE_PATH}/geofences/violations`,
      {
        params: {
          startDate,
          endDate,
          vehicleIds: vehicleIds?.join(','),
          geofenceIds: geofenceIds?.join(','),
        }
      }
    );
    return response.data;
  }

  /**
   * Get route analysis for a vehicle
   */
  static async getRouteAnalysis(request: RouteAnalysisRequest): Promise<VehicleTrackingHistoryResponse> {
    const response = await apiClient.post<VehicleTrackingHistoryResponse>(
      `${this.BASE_PATH}/routes/analyze`,
      request
    );
    return response.data;
  }

  /**
   * Get route optimization suggestions
   */
  static async getRouteOptimization(
    vehicleId: string,
    waypoints: Array<{ latitude: number; longitude: number }>
  ): Promise<RouteOptimizationResponse> {
    const response = await apiClient.post<RouteOptimizationResponse>(
      `${this.BASE_PATH}/routes/optimize`,
      { vehicleId, waypoints }
    );
    return response.data;
  }

  /**
   * Get location analytics for a date range
   */
  static async getLocationAnalytics(
    vehicleIds: string[],
    startDate: string,
    endDate: string
  ): Promise<LocationAnalyticsResponse> {
    const response = await apiClient.post<LocationAnalyticsResponse>(
      `${this.BASE_PATH}/analytics/location`,
      { vehicleIds, startDate, endDate }
    );
    return response.data;
  }

  /**
   * Get geofence analytics
   */
  static async getGeofenceAnalytics(
    geofenceId: string,
    startDate: string,
    endDate: string
  ): Promise<GeofenceAnalyticsResponse> {
    const response = await apiClient.get<GeofenceAnalyticsResponse>(
      `${this.BASE_PATH}/geofences/${geofenceId}/analytics`,
      { params: { startDate, endDate } }
    );
    return response.data;
  }

  /**
   * Search locations by address or coordinates
   */
  static async searchLocations(query: string): Promise<Array<{
    address: string;
    coordinates: { latitude: number; longitude: number };
    relevance: number;
  }>> {
    const response = await apiClient.get(`${this.BASE_PATH}/search/locations`, {
      params: { query }
    });
    return response.data;
  }

  /**
   * Get nearby points of interest
   */
  static async getNearbyPOIs(
    latitude: number,
    longitude: number,
    radiusKm: number = 5,
    category?: string
  ): Promise<Array<{
    name: string;
    category: string;
    coordinates: { latitude: number; longitude: number };
    distance: number; // kilometers
    address?: string;
  }>> {
    const response = await apiClient.get(`${this.BASE_PATH}/nearby/pois`, {
      params: { latitude, longitude, radiusKm, category }
    });
    return response.data;
  }

  /**
   * Process pending coordinates queue (for Redis failure recovery)
   */
  static async processPendingQueue(): Promise<{ processed: number; failed: number }> {
    const response = await apiClient.post(`${this.BASE_PATH}/process-pending-queue`);
    return response.data;
  }

  /**
   * Get system health status for geolocation services
   */
  static async getSystemHealth(): Promise<{
    redis: { status: 'healthy' | 'degraded' | 'down'; latency: number };
    gps: { activeVehicles: number; lastUpdate: string };
    queue: { pendingCoordinates: number };
  }> {
    const response = await apiClient.get(`${this.BASE_PATH}/health`);
    return response.data;
  }
}

// Export specialized services
export * from './analytics';
export * from './validation';
