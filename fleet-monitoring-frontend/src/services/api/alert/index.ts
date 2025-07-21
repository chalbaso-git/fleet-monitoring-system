import apiClient from '../client';
import { Alert } from '@/types/entities/alert';
import { CreateAlertRequest } from '@/types/requests/alert';
import { AlertFilters } from '@/types/responses/alert';

export class AlertApiService {
  private static readonly BASE_PATH = '/api/alert';

  /**
   * Register a new alert in the system
   * POST /api/alert
   */
  static async addAlert(alertData: CreateAlertRequest): Promise<string> {
    try {
      const response = await apiClient.post<string>(
        AlertApiService.BASE_PATH,
        {
          vehicleId: alertData.vehicleId,
          type: alertData.type,
          message: alertData.message,
          createdAt: alertData.createdAt || new Date().toISOString(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding alert:', error);
      throw new Error('Failed to add alert');
    }
  }

  /**
   * Get all registered alerts
   * GET /api/alert
   */
  static async getAlerts(): Promise<Alert[]> {
    try {
      const response = await apiClient.get<Alert[]>(AlertApiService.BASE_PATH);
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw new Error('Failed to fetch alerts');
    }
  }

  /**
   * Get alerts with filters (client-side filtering for now)
   */
  static async getFilteredAlerts(filters: AlertFilters): Promise<Alert[]> {
    try {
      const allAlerts = await AlertApiService.getAlerts();
      
      let filteredAlerts = allAlerts;

      // Apply client-side filters
      if (filters.vehicleId) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.vehicleId === filters.vehicleId
        );
      }

      if (filters.type) {
        filteredAlerts = filteredAlerts.filter(alert => 
          alert.type === filters.type
        );
      }

      if (filters.startDate) {
        filteredAlerts = filteredAlerts.filter(alert => 
          new Date(alert.createdAt) >= new Date(filters.startDate!)
        );
      }

      if (filters.endDate) {
        filteredAlerts = filteredAlerts.filter(alert => 
          new Date(alert.createdAt) <= new Date(filters.endDate!)
        );
      }

      return filteredAlerts;
    } catch (error) {
      console.error('Error fetching filtered alerts:', error);
      throw new Error('Failed to fetch filtered alerts');
    }
  }

  /**
   * Get alerts for a specific vehicle
   */
  static async getVehicleAlerts(vehicleId: string): Promise<Alert[]> {
    return AlertApiService.getFilteredAlerts({ vehicleId });
  }

  /**
   * Get recent alerts (last 24 hours)
   */
  static async getRecentAlerts(): Promise<Alert[]> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return AlertApiService.getFilteredAlerts({
      startDate: yesterday.toISOString(),
    });
  }

  /**
   * Get critical alerts
   */
  static async getCriticalAlerts(): Promise<Alert[]> {
    const allAlerts = await AlertApiService.getAlerts();
    
    // Define critical alert types
    const criticalTypes = [
      'circuit_breaker',
      'system_error',
      'engine_warning',
    ];
    
    return allAlerts.filter(alert => 
      criticalTypes.includes(alert.type)
    );
  }
}

// Export all alert services and utilities
export * from './analytics';
export * from './validation';
export default AlertApiService;
