// Validation schemas para requests
export interface AlertValidationRules {
  vehicleId: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  message: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
}

export const ALERT_VALIDATION: AlertValidationRules = {
  vehicleId: {
    required: true,
    minLength: 1,
    maxLength: 50,
  },
  message: {
    required: true,
    minLength: 5,
    maxLength: 500,
  },
};

// Error messages para validación
export const ALERT_VALIDATION_ERRORS = {
  VEHICLE_ID_REQUIRED: 'El ID del vehículo es requerido',
  VEHICLE_ID_TOO_SHORT: 'El ID del vehículo es muy corto',
  VEHICLE_ID_TOO_LONG: 'El ID del vehículo es muy largo',
  MESSAGE_REQUIRED: 'El mensaje es requerido',
  MESSAGE_TOO_SHORT: 'El mensaje debe tener al menos 5 caracteres',
  MESSAGE_TOO_LONG: 'El mensaje no puede exceder 500 caracteres',
  INVALID_TYPE: 'Tipo de alerta inválido',
} as const;
