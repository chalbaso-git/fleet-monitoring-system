import apiClient from '../client';

export class VehicleApiService {
  private static readonly BASE_PATH = '/api/vehicle';

  /**
   * Delete a vehicle
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
}

export default VehicleApiService;
