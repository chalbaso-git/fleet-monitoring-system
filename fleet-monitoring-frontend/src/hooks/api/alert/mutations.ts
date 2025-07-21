import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertApiService } from '../../../services/api/alert';

/**
 * Hook to add alert (simplified version)
 */
export const useAddAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertData: { vehicleId: string; type: string; message: string }) => {
      return AlertApiService.addAlert(alertData);
    },
    onSuccess: (data, variables) => {
      // Invalidate alert queries
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      
      // Show success notification
      console.log('✅ Alert created successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Failed to create alert:', error);
    },
  });
};
