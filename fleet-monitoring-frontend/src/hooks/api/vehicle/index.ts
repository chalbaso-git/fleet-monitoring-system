import { useMutation, useQueryClient } from '@tanstack/react-query';
import { VehicleApiService } from '../../../services/api/vehicle';

// Hook para eliminar un vehículo
export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (vehicleId: string) => VehicleApiService.deleteVehicle(vehicleId),
    onSuccess: () => {
      // Invalidar consultas relacionadas con vehículos
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
    onError: (error) => {
      console.error('Error al eliminar vehículo:', error);
    },
  });
};

const vehicleHooks = { useDeleteVehicle };
export default vehicleHooks;
