import apiClient from '../client';
import { Vehicle } from '../../../types/entities/vehicle';

export class VehicleApiService {
  private static readonly BASE_PATH = '/api/vehicle';

  /**
   * Delete a vehicle (distributed operation)
   * DELETE /api/vehicle/{vehicleId}
   */
  static async deleteVehicle(vehicleId: string): Promise<string> {
    try {
      const response = await apiClient.delete<string>(`${VehicleApiService.BASE_PATH}/${vehicleId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      throw new Error('Failed to delete vehicle');
    }
  }

  /**
   * Get all vehicles
   * GET /api/vehicle
   */
  static async getVehicles(): Promise<Vehicle[]> {
    try {
      const response = await apiClient.get<Vehicle[]>(VehicleApiService.BASE_PATH);
      // Transform lastSeen from string to Date
      return response.data.map(vehicle => ({
        ...vehicle,
        lastSeen: new Date(vehicle.lastSeen)
      }));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      throw new Error('Failed to fetch vehicles');
    }
  }

  /**
   * Get vehicle by ID
   * GET /api/vehicle/{id}
   */
  static async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const response = await apiClient.get<Vehicle>(`${VehicleApiService.BASE_PATH}/${id}`);
      // Transform lastSeen from string to Date
      return {
        ...response.data,
        lastSeen: new Date(response.data.lastSeen)
      };
    } catch (error) {
      console.error('Error fetching vehicle by ID:', error);
      throw new Error('Failed to fetch vehicle by ID');
    }
  }

  /**
   * Update vehicle information
   * PUT /api/vehicle/{id}
   */
  static async updateVehicle(id: string, vehicleData: Vehicle): Promise<boolean> {
    try {
      // Ensure the vehicleData has the correct id
      const payload = {
        ...vehicleData,
        id: id,
        // Convert Date to ISO string for API
        lastSeen: vehicleData.lastSeen instanceof Date 
          ? vehicleData.lastSeen.toISOString() 
          : vehicleData.lastSeen
      };

      const response = await apiClient.put<boolean>(`${VehicleApiService.BASE_PATH}/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      throw new Error('Failed to update vehicle');
    }
  }
}

export default VehicleApiService;