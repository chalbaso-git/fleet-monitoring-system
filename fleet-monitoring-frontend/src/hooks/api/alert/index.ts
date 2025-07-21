import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertApiService } from '../../../services/api/alert';

// Tipos basados en el backend
interface CreateAlertRequest {
  vehicleId: string;
  type: string;
  message: string;
}

// Hook para obtener todas las alertas
export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => AlertApiService.getAlerts(),
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Actualizar cada minuto
  });
};

// Hook para crear una nueva alerta
export const useAddAlert = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (alert: CreateAlertRequest) => AlertApiService.addAlert(alert),
    onSuccess: () => {
      // Invalidar y refetch las alertas después de crear una nueva
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
    onError: (error) => {
      console.error('Error al crear alerta:', error);
    },
  });
};

const alertHooks = { useAlerts, useAddAlert };
export default alertHooks;
