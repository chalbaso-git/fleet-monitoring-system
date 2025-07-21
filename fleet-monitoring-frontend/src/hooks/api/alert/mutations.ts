import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateAlertRequest } from '../../../types/requests/alert';
import { AlertApiService } from '../../../services/api/alert';
import { AlertValidationService } from '../../../services/api/alert/validation';
import { ALERT_QUERY_KEYS } from './index';

/**
 * Hook to add alert with validation
 */
export const useAddAlertWithValidation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertData: CreateAlertRequest) => {
      // Validate before sending
      const validation = AlertValidationService.validateCreateAlert(alertData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Sanitize message
      const sanitizedData = {
        ...alertData,
        message: AlertValidationService.sanitizeMessage(alertData.message),
      };

      return AlertApiService.addAlert(sanitizedData);
    },
    onSuccess: (data, variables) => {
      // Invalidate all alert queries
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.all });
      
      // Show success notification
      console.log('✅ Alert created successfully:', data);
      
      // Could trigger toast notification here
      // toast.success('Alerta creada exitosamente');
    },
    onError: (error) => {
      console.error('❌ Failed to create alert:', error);
      
      // Could trigger error notification here  
      // toast.error('Error al crear la alerta');
    },
  });
};

/**
 * Hook to bulk add alerts
 */
export const useBulkAddAlerts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alertsData: CreateAlertRequest[]) => {
      const results = await Promise.allSettled(
        alertsData.map(alertData => {
          const validation = AlertValidationService.validateCreateAlert(alertData);
          if (!validation.isValid) {
            return Promise.reject(new Error(`Validation failed: ${validation.errors.join(', ')}`));
          }
          
          const sanitizedData = {
            ...alertData,
            message: AlertValidationService.sanitizeMessage(alertData.message),
          };

          return AlertApiService.addAlert(sanitizedData);
        })
      );

      const successful = results.filter(result => result.status === 'fulfilled').length;
      const failed = results.filter(result => result.status === 'rejected').length;

      return { successful, failed, total: alertsData.length };
    },
    onSuccess: (data) => {
      // Invalidate all alert queries
      queryClient.invalidateQueries({ queryKey: ALERT_QUERY_KEYS.all });
      
      console.log(`✅ Bulk alert creation completed: ${data.successful}/${data.total} successful`);
    },
    onError: (error) => {
      console.error('❌ Failed to create alerts in bulk:', error);
    },
  });
};

/**
 * Hook to validate alert data without submitting
 */
export const useAlertValidation = () => {
  return {
    validateAlert: AlertValidationService.validateCreateAlert,
    sanitizeMessage: AlertValidationService.sanitizeMessage,
    isValidVehicleId: AlertValidationService.isValidVehicleId,
  };
};
