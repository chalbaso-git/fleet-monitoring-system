import { 
  Vehicle, 
  VehicleWithMetadata, 
  VehiclePerformanceMetrics,
  VehicleStatus,
  MaintenanceStatus,
  EngineStatus,
  AlertSeverity
} from './index';
import { 
  VEHICLE_STATUS, 
  ENGINE_STATUS, 
  MAINTENANCE_STATUS, 
  ALERT_SEVERITY,
  PERFORMANCE_THRESHOLDS,
  STATUS_COLORS
} from './constants';

/**
 * Vehicle utility functions
 */

/**
 * Calculates the age of a vehicle in years
 */
export function calculateVehicleAge(year: number): number {
  const currentYear = new Date().getFullYear();
  return Math.max(0, currentYear - year);
}

/**
 * Determines if a vehicle requires immediate attention
 */
export function requiresImmediateAttention(vehicle: VehicleWithMetadata): boolean {
  // Check for critical alerts
  const hasCriticalAlerts = vehicle.alerts.some(
    alert => alert.severity === ALERT_SEVERITY.CRITICAL && !alert.isResolved
  );

  // Check maintenance status
  const criticalMaintenance = vehicle.maintenanceStatus === MAINTENANCE_STATUS.CRITICAL ||
                            vehicle.maintenanceStatus === MAINTENANCE_STATUS.OVERDUE;

  // Check engine status
  const engineProblems = vehicle.engineStatus === ENGINE_STATUS.ERROR ||
                        vehicle.engineStatus === ENGINE_STATUS.MAINTENANCE_REQUIRED;

  // Check fuel/battery levels
  const lowFuel = (vehicle.fuelLevel || 0) < 10;
  const lowBattery = (vehicle.batteryLevel || 0) < 20;

  return hasCriticalAlerts || criticalMaintenance || engineProblems || lowFuel || lowBattery;
}

/**
 * Gets the status color for a vehicle
 */
export function getVehicleStatusColor(status: VehicleStatus): string {
  return STATUS_COLORS.VEHICLE_STATUS[status] || '#9E9E9E';
}

/**
 * Gets the engine status color
 */
export function getEngineStatusColor(status: EngineStatus): string {
  return STATUS_COLORS.ENGINE_STATUS[status] || '#9E9E9E';
}

/**
 * Gets the maintenance status color
 */
export function getMaintenanceStatusColor(status: MaintenanceStatus): string {
  return STATUS_COLORS.MAINTENANCE_STATUS[status] || '#9E9E9E';
}

/**
 * Gets the alert severity color
 */
export function getAlertSeverityColor(severity: AlertSeverity): string {
  return STATUS_COLORS.ALERT_SEVERITY[severity] || '#9E9E9E';
}

/**
 * Calculates overall vehicle health score (0-100)
 */
export function calculateVehicleHealthScore(vehicle: VehicleWithMetadata): number {
  let score = 100;
  
  // Deduct points for alerts
  const criticalAlerts = vehicle.alerts.filter(a => !a.isResolved && a.severity === ALERT_SEVERITY.CRITICAL).length;
  const highAlerts = vehicle.alerts.filter(a => !a.isResolved && a.severity === ALERT_SEVERITY.HIGH).length;
  const mediumAlerts = vehicle.alerts.filter(a => !a.isResolved && a.severity === ALERT_SEVERITY.MEDIUM).length;
  
  score -= (criticalAlerts * 20) + (highAlerts * 10) + (mediumAlerts * 5);
  
  // Factor in maintenance status
  switch (vehicle.maintenanceStatus) {
    case MAINTENANCE_STATUS.CRITICAL:
      score -= 30;
      break;
    case MAINTENANCE_STATUS.OVERDUE:
      score -= 20;
      break;
    case MAINTENANCE_STATUS.DUE_SOON:
      score -= 10;
      break;
    case MAINTENANCE_STATUS.IN_MAINTENANCE:
      score -= 5;
      break;
    default:
      break;
  }
  
  // Factor in engine status
  switch (vehicle.engineStatus) {
    case ENGINE_STATUS.ERROR:
      score -= 25;
      break;
    case ENGINE_STATUS.MAINTENANCE_REQUIRED:
      score -= 15;
      break;
    default:
      break;
  }
  
  // Factor in performance metrics
  score += (vehicle.performance.maintenanceScore - 100) * 0.2;
  score += (vehicle.performance.uptime - 100) * 0.1;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Determines performance rating based on metrics
 */
export function getPerformanceRating(metrics: VehiclePerformanceMetrics): {
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  breakdown: {
    fuelEfficiency: 'excellent' | 'good' | 'fair' | 'poor';
    maintenance: 'excellent' | 'good' | 'fair' | 'poor';
    utilization: 'high' | 'medium' | 'low';
    uptime: 'excellent' | 'good' | 'fair' | 'poor';
  };
} {
  const fuelRating = 
    metrics.fuelEfficiency >= PERFORMANCE_THRESHOLDS.FUEL_EFFICIENCY.EXCELLENT ? 'excellent' :
    metrics.fuelEfficiency >= PERFORMANCE_THRESHOLDS.FUEL_EFFICIENCY.GOOD ? 'good' :
    metrics.fuelEfficiency >= PERFORMANCE_THRESHOLDS.FUEL_EFFICIENCY.FAIR ? 'fair' : 'poor';
  
  const maintenanceRating = 
    metrics.maintenanceScore >= PERFORMANCE_THRESHOLDS.MAINTENANCE_SCORE.EXCELLENT ? 'excellent' :
    metrics.maintenanceScore >= PERFORMANCE_THRESHOLDS.MAINTENANCE_SCORE.GOOD ? 'good' :
    metrics.maintenanceScore >= PERFORMANCE_THRESHOLDS.MAINTENANCE_SCORE.FAIR ? 'fair' : 'poor';
  
  const utilizationRating = 
    metrics.utilizationRate >= PERFORMANCE_THRESHOLDS.UTILIZATION_RATE.HIGH ? 'high' :
    metrics.utilizationRate >= PERFORMANCE_THRESHOLDS.UTILIZATION_RATE.MEDIUM ? 'medium' : 'low';
  
  const uptimeRating = 
    metrics.uptime >= PERFORMANCE_THRESHOLDS.UPTIME.EXCELLENT ? 'excellent' :
    metrics.uptime >= PERFORMANCE_THRESHOLDS.UPTIME.GOOD ? 'good' :
    metrics.uptime >= PERFORMANCE_THRESHOLDS.UPTIME.FAIR ? 'fair' : 'poor';
  
  // Calculate overall rating
  const ratings = [fuelRating, maintenanceRating, uptimeRating];
  const excellentCount = ratings.filter(r => r === 'excellent').length;
  const goodCount = ratings.filter(r => r === 'good').length;
  const fairCount = ratings.filter(r => r === 'fair').length;
  
  let overall: 'excellent' | 'good' | 'fair' | 'poor';
  if (excellentCount >= 2) overall = 'excellent';
  else if (excellentCount + goodCount >= 2) overall = 'good';
  else if (fairCount + goodCount + excellentCount >= 2) overall = 'fair';
  else overall = 'poor';
  
  return {
    overall,
    breakdown: {
      fuelEfficiency: fuelRating,
      maintenance: maintenanceRating,
      utilization: utilizationRating,
      uptime: uptimeRating,
    },
  };
}

/**
 * Validates VIN number format
 */
export function validateVIN(vin: string): boolean {
  // Basic VIN validation - 17 characters, alphanumeric, no I, O, Q
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return vinRegex.test(vin.toUpperCase());
}

/**
 * Validates license plate format (basic validation)
 */
export function validateLicensePlate(plate: string): boolean {
  // Basic validation - 2-8 alphanumeric characters
  const plateRegex = /^[A-Z0-9]{2,8}$/;
  return plateRegex.test(plate.toUpperCase().replace(/[^A-Z0-9]/g, ''));
}

/**
 * Formats license plate for display
 */
export function formatLicensePlate(plate: string): string {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Calculates estimated maintenance cost based on vehicle data
 */
export function estimateMaintenanceCost(vehicle: VehicleWithMetadata): {
  monthly: number;
  annual: number;
  priority: 'low' | 'medium' | 'high';
} {
  const age = calculateVehicleAge(vehicle.year);
  const baseCost = 100; // Base monthly cost
  
  // Age factor
  const ageFactor = 1 + (age * 0.1);
  
  // Mileage factor (assuming higher mileage = more maintenance)
  const mileageFactor = 1 + (vehicle.totalMileage / 100000) * 0.2;
  
  // Performance factor
  const performanceFactor = 2 - (vehicle.performance.maintenanceScore / 100);
  
  // Alert factor
  const activeAlerts = vehicle.alerts.filter(a => !a.isResolved);
  const alertFactor = 1 + (activeAlerts.length * 0.1);
  
  const monthly = Math.round(baseCost * ageFactor * mileageFactor * performanceFactor * alertFactor);
  const annual = monthly * 12;
  
  // Determine priority
  let priority: 'low' | 'medium' | 'high';
  if (monthly < 150) priority = 'low';
  else if (monthly < 300) priority = 'medium';
  else priority = 'high';
  
  return { monthly, annual, priority };
}

/**
 * Gets next maintenance recommendations
 */
export function getMaintenanceRecommendations(vehicle: VehicleWithMetadata): Array<{
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  estimatedCost: number;
  dueDate?: string;
}> {
  const recommendations = [];
  const healthScore = calculateVehicleHealthScore(vehicle);
  
  // Based on vehicle health and alerts
  if (healthScore < 50) {
    recommendations.push({
      type: 'comprehensive_inspection',
      priority: 'critical' as const,
      description: 'Comprehensive vehicle inspection required due to low health score',
      estimatedCost: 200,
    });
  }
  
  // Based on maintenance status
  if (vehicle.maintenanceStatus === MAINTENANCE_STATUS.OVERDUE || 
      vehicle.maintenanceStatus === MAINTENANCE_STATUS.CRITICAL) {
    recommendations.push({
      type: 'immediate_service',
      priority: 'critical' as const,
      description: 'Immediate maintenance service required',
      estimatedCost: 300,
    });
  }
  
  // Based on fuel level
  if ((vehicle.fuelLevel || 0) < 20) {
    recommendations.push({
      type: 'fuel_refill',
      priority: 'high' as const,
      description: 'Fuel level is low - refill recommended',
      estimatedCost: 50,
    });
  }
  
  // Based on active alerts
  const criticalAlerts = vehicle.alerts.filter(
    a => !a.isResolved && a.severity === ALERT_SEVERITY.CRITICAL
  );
  
  criticalAlerts.forEach(alert => {
    recommendations.push({
      type: `alert_${alert.type}`,
      priority: 'critical' as const,
      description: `Address critical ${alert.type} alert: ${alert.title}`,
      estimatedCost: 150,
    });
  });
  
  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

/**
 * Formats vehicle display name
 */
export function formatVehicleDisplayName(vehicle: Vehicle): string {
  return `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
}

/**
 * Checks if vehicle is available for assignment
 */
export function isVehicleAvailable(vehicle: VehicleWithMetadata): boolean {
  const unavailableStatuses: VehicleStatus[] = [
    VEHICLE_STATUS.MAINTENANCE,
    VEHICLE_STATUS.OUT_OF_SERVICE,
    VEHICLE_STATUS.DECOMMISSIONED,
  ];
  
  const hasBlockingAlerts = vehicle.alerts.some(
    alert => !alert.isResolved && alert.severity === ALERT_SEVERITY.CRITICAL
  );
  
  return !unavailableStatuses.includes(vehicle.status) && 
         !hasBlockingAlerts &&
         vehicle.engineStatus !== ENGINE_STATUS.ERROR;
}

/**
 * Calculates estimated arrival time based on distance and average speed
 */
export function estimateArrivalTime(
  distanceKm: number, 
  averageSpeedKmh: number = 50
): { 
  hours: number; 
  minutes: number; 
  totalMinutes: number;
  estimatedArrival: Date;
} {
  const totalHours = distanceKm / averageSpeedKmh;
  const totalMinutes = Math.round(totalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const estimatedArrival = new Date();
  estimatedArrival.setMinutes(estimatedArrival.getMinutes() + totalMinutes);
  
  return {
    hours,
    minutes,
    totalMinutes,
    estimatedArrival,
  };
}
