import { AlertType } from '../../enums';

// Enums específicos para Alert
export const ALERT_TYPE_LABELS: Record<AlertType, string> = {
  [AlertType.GPS_FAILURE]: 'Fallo de GPS',
  [AlertType.ROUTE_DEVIATION]: 'Desviación de Ruta',
  [AlertType.CIRCUIT_BREAKER]: 'Circuit Breaker',
  [AlertType.NETWORK_ERROR]: 'Error de Red',
  [AlertType.SYSTEM_ERROR]: 'Error del Sistema',
  [AlertType.MAINTENANCE_REQUIRED]: 'Mantenimiento Requerido',
  [AlertType.SPEED_VIOLATION]: 'Violación de Velocidad',
  [AlertType.GEOFENCE_VIOLATION]: 'Violación de Geocerca',
  [AlertType.ENGINE_WARNING]: 'Advertencia del Motor',
  [AlertType.FUEL_LOW]: 'Combustible Bajo',
};

export const CRITICAL_ALERT_TYPES: AlertType[] = [
  AlertType.CIRCUIT_BREAKER,
  AlertType.SYSTEM_ERROR,
  AlertType.ENGINE_WARNING,
];

export const HIGH_PRIORITY_ALERT_TYPES: AlertType[] = [
  AlertType.GPS_FAILURE,
  AlertType.NETWORK_ERROR,
  AlertType.SPEED_VIOLATION,
];
