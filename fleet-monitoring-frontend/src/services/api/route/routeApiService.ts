import apiClient from '@/services/api/client';
import { AddRouteRequest, CreateRouteRequest, GetRoutesByVehicleAndDateRequest } from '@/types/requests/route';
import { AddRouteResponse, GetRoutesResponse, RouteHistoryResponse } from '@/types/responses/route';
import { Route } from '@/types/entities/route';
import { AxiosResponse, AxiosInstance } from 'axios';

/**
 * Route API Service for communication with backend RouteController
 * Provides methods for route management and optimization
 */
export class RouteApiService {
  constructor(private apiClient: AxiosInstance) {}

  /**
   * Adds a new route to the system
   * Corresponds to backend RouteController.AddRoute
   */
  async addRoute(request: AddRouteRequest): Promise<AddRouteResponse> {
    const response: AxiosResponse<AddRouteResponse> = await this.apiClient.post(
      '/api/route/add',
      request
    );
    return response.data;
  }

  /**
   * Creates a new route with optimization
   * Extended functionality for route planning
   */
  async createRoute(request: CreateRouteRequest): Promise<AddRouteResponse> {
    const response: AxiosResponse<AddRouteResponse> = await this.apiClient.post(
      '/api/route/create',
      request
    );
    return response.data;
  }

  /**
   * Gets all routes in the system
   * Corresponds to backend RouteController.GetRoutes
   */
  async getRoutes(): Promise<GetRoutesResponse> {
    const response: AxiosResponse<GetRoutesResponse> = await this.apiClient.get(
      '/api/route'
    );
    return response.data;
  }

  /**
   * Gets routes by vehicle and date range
   * Corresponds to backend RouteController.GetRoutesByVehicleAndDate
   */
  async getRoutesByVehicleAndDate(
    request: GetRoutesByVehicleAndDateRequest
  ): Promise<RouteHistoryResponse> {
    const params = new URLSearchParams({
      vehicleId: request.vehicleId,
      startDate: request.startDate.toISOString(),
      endDate: request.endDate.toISOString(),
    });

    if (request.includeWaypoints !== undefined) {
      params.append('includeWaypoints', request.includeWaypoints.toString());
    }

    const response: AxiosResponse<RouteHistoryResponse> = await this.apiClient.get(
      `/api/route/by-vehicle-date?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Gets a specific route by ID
   */
  async getRouteById(routeId: string): Promise<Route> {
    const response: AxiosResponse<{ route: Route }> = await this.apiClient.get(
      `/api/route/${routeId}`
    );
    return response.data.route;
  }

  /**
   * Updates an existing route
   */
  async updateRoute(routeId: string, updates: Partial<AddRouteRequest>): Promise<AddRouteResponse> {
    const response: AxiosResponse<AddRouteResponse> = await this.apiClient.put(
      `/api/route/${routeId}`,
      updates
    );
    return response.data;
  }

  /**
   * Deletes a route
   */
  async deleteRoute(routeId: string): Promise<void> {
    await this.apiClient.delete(`/api/route/${routeId}`);
  }

  /**
   * Gets routes by vehicle ID
   */
  async getRoutesByVehicle(vehicleId: string, limit?: number): Promise<Route[]> {
    const params = new URLSearchParams({ vehicleId });
    if (limit) {
      params.append('limit', limit.toString());
    }

    const response: AxiosResponse<{ routes: Route[] }> = await this.apiClient.get(
      `/api/route/by-vehicle?${params.toString()}`
    );
    return response.data.routes;
  }

  /**
   * Gets recent routes (last 24 hours)
   */
  async getRecentRoutes(limit: number = 50): Promise<Route[]> {
    const response: AxiosResponse<{ routes: Route[] }> = await this.apiClient.get(
      `/api/route/recent?limit=${limit}`
    );
    return response.data.routes;
  }

  /**
   * Optimizes route waypoints order
   */
  async optimizeRoute(routeId: string): Promise<{
    originalRoute: Route;
    optimizedRoute: Route;
    estimatedSavings: {
      distance: number;
      time: number;
      fuel: number;
    };
  }> {
    const response = await this.apiClient.post(`/api/route/${routeId}/optimize`);
    return response.data;
  }

  /**
   * Gets route analytics for a date range
   */
  async getRouteAnalytics(
    startDate: Date,
    endDate: Date,
    vehicleId?: string
  ): Promise<{
    totalRoutes: number;
    totalDistance: number;
    averageDistance: number;
    mostActiveVehicles: Array<{
      vehicleId: string;
      routeCount: number;
      totalDistance: number;
    }>;
    dailyStats: Array<{
      date: string;
      routeCount: number;
      totalDistance: number;
    }>;
  }> {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    if (vehicleId) {
      params.append('vehicleId', vehicleId);
    }

    const response = await this.apiClient.get(`/api/route/analytics?${params.toString()}`);
    return response.data;
  }

  /**
   * Validates route path for feasibility
   */
  async validateRoute(path: string, vehicleId: string): Promise<{
    isValid: boolean;
    issues: string[];
    estimatedDistance: number;
    estimatedDuration: number;
  }> {
    const response = await this.apiClient.post('/api/route/validate', {
      path,
      vehicleId,
    });
    return response.data;
  }

  /**
   * Gets route performance metrics
   */
  async getRoutePerformance(routeId: string): Promise<{
    route: Route;
    performance: {
      efficiency: number;
      onTimeRate: number;
      fuelConsumption: number;
      averageSpeed: number;
    };
    comparison: {
      similarRoutes: number;
      betterThanAverage: boolean;
      ranking: number;
    };
  }> {
    const response = await this.apiClient.get(`/api/route/${routeId}/performance`);
    return response.data;
  }

  /**
   * Exports routes to various formats
   */
  async exportRoutes(
    format: 'csv' | 'xlsx' | 'gpx',
    filters?: {
      vehicleId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Blob> {
    const params = new URLSearchParams({ format });
    
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters?.startDate) params.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) params.append('endDate', filters.endDate.toISOString());

    const response = await this.apiClient.get(`/api/route/export?${params.toString()}`, {
      responseType: 'blob',
    });
    
    return response.data;
  }

  /**
   * Gets route templates for common patterns
   */
  async getRouteTemplates(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    path: string;
    estimatedDistance: number;
    estimatedDuration: number;
    usageCount: number;
  }>> {
    const response = await this.apiClient.get('/api/route/templates');
    return response.data.templates;
  }

  /**
   * Creates a route template from an existing route
   */
  async createRouteTemplate(
    routeId: string,
    template: {
      name: string;
      description: string;
      isPublic?: boolean;
    }
  ): Promise<{ templateId: string }> {
    const response = await this.apiClient.post(`/api/route/${routeId}/create-template`, template);
    return response.data;
  }
}

// Create default instance
export const routeApiService = new RouteApiService(apiClient);
