import { Alert } from '../../../types/entities/alert';
import { AlertSeverity, AlertType } from '../../../types/enums';
import { formatRelativeDate, isWithinLastMinutes } from '../../../utils';

export class AlertAnalyticsService {
  /**
   * Calculate alert severity based on type and context
   */
  static getSeverity(alertType: AlertType): AlertSeverity {
    const severityMap: Record<AlertType, AlertSeverity> = {
      [AlertType.GPS_FAILURE]: AlertSeverity.HIGH,
      [AlertType.ROUTE_DEVIATION]: AlertSeverity.MEDIUM,
      [AlertType.CIRCUIT_BREAKER]: AlertSeverity.CRITICAL,
      [AlertType.NETWORK_ERROR]: AlertSeverity.HIGH,
      [AlertType.SYSTEM_ERROR]: AlertSeverity.CRITICAL,
      [AlertType.MAINTENANCE_REQUIRED]: AlertSeverity.MEDIUM,
      [AlertType.SPEED_VIOLATION]: AlertSeverity.HIGH,
      [AlertType.GEOFENCE_VIOLATION]: AlertSeverity.MEDIUM,
      [AlertType.ENGINE_WARNING]: AlertSeverity.CRITICAL,
      [AlertType.FUEL_LOW]: AlertSeverity.LOW,
    };
    
    return severityMap[alertType] || AlertSeverity.MEDIUM;
  }

  /**
   * Get recommended action for alert type
   */
  static getRecommendedAction(alertType: AlertType): string {
    const actionMap: Record<AlertType, string> = {
      [AlertType.GPS_FAILURE]: 'Verificar conexión GPS del vehículo',
      [AlertType.ROUTE_DEVIATION]: 'Contactar al conductor para confirmación de ruta',
      [AlertType.CIRCUIT_BREAKER]: 'Revisar estado del servicio de ruteo',
      [AlertType.NETWORK_ERROR]: 'Verificar conectividad de red',
      [AlertType.SYSTEM_ERROR]: 'Escalar a equipo técnico inmediatamente',
      [AlertType.MAINTENANCE_REQUIRED]: 'Programar mantenimiento del vehículo',
      [AlertType.SPEED_VIOLATION]: 'Notificar al conductor sobre límites de velocidad',
      [AlertType.GEOFENCE_VIOLATION]: 'Verificar ubicación autorizada del vehículo',
      [AlertType.ENGINE_WARNING]: 'Detener vehículo y revisar motor',
      [AlertType.FUEL_LOW]: 'Dirigir a estación de combustible más cercana',
    };
    
    return actionMap[alertType] || 'Revisar alerta y tomar acción apropiada';
  }

  /**
   * Estimate resolution time based on alert type
   */
  static getEstimatedResolutionTime(alertType: AlertType): number {
    const timeMap: Record<AlertType, number> = {
      [AlertType.GPS_FAILURE]: 15, // 15 minutes
      [AlertType.ROUTE_DEVIATION]: 10,
      [AlertType.CIRCUIT_BREAKER]: 30,
      [AlertType.NETWORK_ERROR]: 20,
      [AlertType.SYSTEM_ERROR]: 60,
      [AlertType.MAINTENANCE_REQUIRED]: 120, // 2 hours
      [AlertType.SPEED_VIOLATION]: 5,
      [AlertType.GEOFENCE_VIOLATION]: 10,
      [AlertType.ENGINE_WARNING]: 45,
      [AlertType.FUEL_LOW]: 30,
    };
    
    return timeMap[alertType] || 30;
  }

  /**
   * Enhance alert with analytics data
   */
  static enhanceAlert(alert: Alert) {
    return {
      ...alert,
      severity: this.getSeverity(alert.type),
      isRecent: isWithinLastMinutes(alert.createdAt, 60),
      relativeTime: formatRelativeDate(alert.createdAt),
      recommendedAction: this.getRecommendedAction(alert.type),
      estimatedResolutionTime: this.getEstimatedResolutionTime(alert.type),
      impactLevel: this.getImpactLevel(alert.type),
    };
  }

  /**
   * Get impact level for alert
   */
  private static getImpactLevel(alertType: AlertType): 'low' | 'medium' | 'high' | 'critical' {
    const severity = this.getSeverity(alertType);
    
    switch (severity) {
      case AlertSeverity.CRITICAL:
        return 'critical';
      case AlertSeverity.HIGH:
        return 'high';
      case AlertSeverity.MEDIUM:
        return 'medium';
      case AlertSeverity.LOW:
      default:
        return 'low';
    }
  }
}

export default AlertAnalyticsService;
