import { useMutation } from '@tanstack/react-query';
import VehicleApiService from '../../../services/api/vehicle';

/**
 * Hook to delete a vehicle
 * Uses DELETE /api/vehicle/{vehicleId}
 */
export const useDeleteVehicle = () => {
  return useMutation({
    mutationFn: (vehicleId: string) => VehicleApiService.deleteVehicle(vehicleId),
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
    },
  });
};
