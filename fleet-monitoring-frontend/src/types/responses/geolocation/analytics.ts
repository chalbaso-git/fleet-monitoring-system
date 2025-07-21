import { 
  VehicleTrackingHistoryResponse, 
  LocationAnalyticsResponse, 
  GeofenceAnalyticsResponse,
  FleetOverviewResponse,
  PopularLocation,
  HourlyActivity
} from './index';
import { GpsCoordinate } from '@/types/entities/geolocation';
import { calculateDistance, calculateSpeed } from '@/types/entities/geolocation/utils';

/**
 * Analytics data aggregation utilities
 */

/**
 * Processes raw GPS coordinates to extract movement patterns
 */
export function analyzeVehicleMovement(coordinates: GpsCoordinate[]): {
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
  movingTime: number;
  idleTime: number;
  stops: Array<{ location: GpsCoordinate; duration: number; startTime: string; endTime: string }>;
} {
  if (coordinates.length < 2) {
    return {
      totalDistance: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      movingTime: 0,
      idleTime: 0,
      stops: [],
    };
  }

  let totalDistance = 0;
  let maxSpeed = 0;
  let movingTime = 0;
  let idleTime = 0;
  const speeds: number[] = [];
  const stops: Array<{ location: GpsCoordinate; duration: number; startTime: string; endTime: string }> = [];

  let currentStopStart: GpsCoordinate | null = null;
  let currentStopStartTime: string | null = null;

  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    
    const distance = calculateDistance(prev, curr);
    const speed = calculateSpeed(prev, curr);
    
    totalDistance += distance;
    speeds.push(speed);
    maxSpeed = Math.max(maxSpeed, speed);
    
    const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 60000; // minutes
    
    // Consider stationary if speed < 5 km/h
    if (speed < 5) {
      idleTime += timeDiff;
      
      // Start of stop
      if (!currentStopStart) {
        currentStopStart = prev;
        currentStopStartTime = prev.timestamp;
      }
    } else {
      movingTime += timeDiff;
      
      // End of stop
      if (currentStopStart && currentStopStartTime) {
        const stopDuration = (new Date(prev.timestamp).getTime() - new Date(currentStopStartTime).getTime()) / 60000;
        
        // Only record stops longer than 5 minutes
        if (stopDuration > 5) {
          stops.push({
            location: currentStopStart,
            duration: stopDuration,
            startTime: currentStopStartTime,
            endTime: prev.timestamp,
          });
        }
        
        currentStopStart = null;
        currentStopStartTime = null;
      }
    }
  }

  // Handle ongoing stop
  if (currentStopStart && currentStopStartTime) {
    const lastCoord = coordinates[coordinates.length - 1];
    const stopDuration = (new Date(lastCoord.timestamp).getTime() - new Date(currentStopStartTime).getTime()) / 60000;
    
    if (stopDuration > 5) {
      stops.push({
        location: currentStopStart,
        duration: stopDuration,
        startTime: currentStopStartTime,
        endTime: lastCoord.timestamp,
      });
    }
  }

  const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

  return {
    totalDistance,
    averageSpeed,
    maxSpeed,
    movingTime,
    idleTime,
    stops,
  };
}

/**
 * Identifies frequently visited locations from GPS coordinates
 */
export function identifyPopularLocations(
  coordinates: GpsCoordinate[],
  radiusMeters: number = 100
): PopularLocation[] {
  const locationClusters: Array<{
    center: GpsCoordinate;
    visits: GpsCoordinate[];
    totalDuration: number;
  }> = [];

  coordinates.forEach(coord => {
    let assignedToCluster = false;

    // Try to assign to existing cluster
    for (const cluster of locationClusters) {
      if (calculateDistance(coord, cluster.center) * 1000 <= radiusMeters) {
        cluster.visits.push(coord);
        assignedToCluster = true;
        break;
      }
    }

    // Create new cluster if not assigned
    if (!assignedToCluster) {
      locationClusters.push({
        center: coord,
        visits: [coord],
        totalDuration: 0,
      });
    }
  });

  // Convert clusters to popular locations
  return locationClusters
    .map(cluster => ({
      location: cluster.center,
      visitCount: cluster.visits.length,
      totalDuration: cluster.totalDuration,
      averageStayDuration: cluster.totalDuration / cluster.visits.length,
    }))
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 10); // Top 10 locations
}

/**
 * Generates hourly activity patterns from GPS data
 */
export function generateHourlyActivity(coordinates: GpsCoordinate[]): HourlyActivity[] {
  const hourlyData: Record<number, {
    count: number;
    totalDistance: number;
    speeds: number[];
  }> = {};

  // Initialize all hours
  for (let i = 0; i < 24; i++) {
    hourlyData[i] = { count: 0, totalDistance: 0, speeds: [] };
  }

  // Process coordinates
  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    const hour = new Date(curr.timestamp).getHours();
    
    const distance = calculateDistance(prev, curr);
    const speed = calculateSpeed(prev, curr);
    
    hourlyData[hour].count++;
    hourlyData[hour].totalDistance += distance;
    hourlyData[hour].speeds.push(speed);
  }

  // Convert to array format
  return Object.entries(hourlyData).map(([hour, data]) => ({
    hour: parseInt(hour),
    vehicleCount: 1, // This would be aggregated across multiple vehicles
    totalDistance: data.totalDistance,
    averageSpeed: data.speeds.length > 0 
      ? data.speeds.reduce((a, b) => a + b, 0) / data.speeds.length 
      : 0,
  }));
}

/**
 * Calculates fuel efficiency based on distance and estimated fuel consumption
 */
export function calculateFuelEfficiency(
  totalDistance: number,
  vehicleType: 'car' | 'truck' | 'van' = 'car'
): number {
  // Base fuel consumption rates (liters per 100km)
  const consumptionRates = {
    car: 8,
    van: 12,
    truck: 25,
  };

  const baseConsumption = consumptionRates[vehicleType];
  const fuelUsed = (totalDistance * baseConsumption) / 100;
  
  return fuelUsed > 0 ? totalDistance / fuelUsed : 0; // km per liter
}

/**
 * Generates geofence compliance report
 */
export function generateGeofenceComplianceReport(
  analytics: GeofenceAnalyticsResponse[]
): {
  overallCompliance: number;
  violationsByGeofence: Record<string, number>;
  topViolators: Array<{ vehicleId: string; violations: number }>;
} {
  let totalEvents = 0;
  let totalViolations = 0;
  const violationsByGeofence: Record<string, number> = {};
  const vehicleViolations: Record<string, number> = {};

  analytics.forEach(geofence => {
    const events = geofence.statistics.totalEntries + geofence.statistics.totalExits;
    const violations = geofence.statistics.violationsCount;
    
    totalEvents += events;
    totalViolations += violations;
    violationsByGeofence[geofence.geofence.name] = violations;

    // Aggregate vehicle violations
    geofence.vehicleActivity.forEach(activity => {
      vehicleViolations[activity.vehicleId] = 
        (vehicleViolations[activity.vehicleId] || 0) + activity.violations;
    });
  });

  const overallCompliance = totalEvents > 0 ? ((totalEvents - totalViolations) / totalEvents) * 100 : 100;
  
  const topViolators = Object.entries(vehicleViolations)
    .map(([vehicleId, violations]) => ({ vehicleId, violations }))
    .sort((a, b) => b.violations - a.violations)
    .slice(0, 5);

  return {
    overallCompliance,
    violationsByGeofence,
    topViolators,
  };
}

/**
 * Calculates route optimization suggestions
 */
export function suggestRouteOptimizations(
  coordinates: GpsCoordinate[]
): {
  inefficientSegments: Array<{
    start: GpsCoordinate;
    end: GpsCoordinate;
    inefficiencyReason: string;
    suggestedImprovement: string;
  }>;
  totalOptimizationPotential: number; // percentage
} {
  const inefficientSegments: Array<{
    start: GpsCoordinate;
    end: GpsCoordinate;
    inefficiencyReason: string;
    suggestedImprovement: string;
  }> = [];

  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];
    const speed = calculateSpeed(prev, curr);
    const distance = calculateDistance(prev, curr);

    // Identify inefficient segments
    if (speed < 10 && distance > 0.5) { // Slow movement over long distance
      inefficientSegments.push({
        start: prev,
        end: curr,
        inefficiencyReason: 'Traffic congestion or inefficient route',
        suggestedImprovement: 'Consider alternative route or departure time',
      });
    }

    if (speed > 80) { // Excessive speed
      inefficientSegments.push({
        start: prev,
        end: curr,
        inefficiencyReason: 'Excessive speed increases fuel consumption',
        suggestedImprovement: 'Maintain optimal speed (60-80 km/h)',
      });
    }
  }

  const totalOptimizationPotential = Math.min(
    (inefficientSegments.length / coordinates.length) * 100,
    25 // Cap at 25% potential improvement
  );

  return {
    inefficientSegments,
    totalOptimizationPotential,
  };
}

/**
 * Generates vehicle performance score based on multiple metrics
 */
export function calculateVehiclePerformanceScore(
  analytics: LocationAnalyticsResponse
): {
  overallScore: number;
  breakdown: {
    efficiency: number;
    safety: number;
    punctuality: number;
    fuelUsage: number;
  };
  recommendations: string[];
} {
  const recommendations: string[] = [];
  
  // Efficiency score (0-100) based on average speed and idle time
  const idealSpeed = 50; // km/h
  const speedEfficiency = Math.max(0, 100 - Math.abs(analytics.metrics.averageSpeed - idealSpeed) * 2);
  const idleRatio = analytics.metrics.idleTime / (analytics.metrics.totalDrivingTime + analytics.metrics.idleTime);
  const idleEfficiency = Math.max(0, 100 - idleRatio * 200);
  const efficiency = (speedEfficiency + idleEfficiency) / 2;

  if (efficiency < 70) {
    recommendations.push('Optimize routes to reduce idle time and maintain consistent speed');
  }

  // Safety score based on speed patterns (simplified)
  const safety = analytics.metrics.averageSpeed <= 80 ? 90 : Math.max(50, 90 - (analytics.metrics.averageSpeed - 80));
  
  if (safety < 80) {
    recommendations.push('Implement speed monitoring and driver training programs');
  }

  // Punctuality score (simplified - would need more data in real implementation)
  const punctuality = 85; // Placeholder

  // Fuel usage score
  const fuelScore = Math.min(100, analytics.metrics.fuelEfficiency * 10);
  
  if (fuelScore < 70) {
    recommendations.push('Implement eco-driving techniques to improve fuel efficiency');
  }

  const overallScore = (efficiency + safety + punctuality + fuelScore) / 4;

  return {
    overallScore,
    breakdown: {
      efficiency,
      safety,
      punctuality,
      fuelUsage: fuelScore,
    },
    recommendations,
  };
}
