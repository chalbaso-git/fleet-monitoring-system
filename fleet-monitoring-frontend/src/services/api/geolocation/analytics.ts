import { GeolocationApiService } from './index';
import { 
  LocationAnalyticsResponse,
  GeofenceAnalyticsResponse
} from '@/types/responses/geolocation';
import {
  analyzeVehicleMovement,
  identifyPopularLocations,
  generateHourlyActivity,
  calculateFuelEfficiency,
  generateGeofenceComplianceReport,
  calculateVehiclePerformanceScore
} from '@/types/responses/geolocation/analytics';
import { GpsCoordinate } from '@/types/entities/geolocation';

/**
 * Specialized analytics service for geolocation data
 */
export class GeolocationAnalyticsService {
  /**
   * Get comprehensive vehicle analytics for a date range
   */
  static async getVehicleAnalytics(
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<LocationAnalyticsResponse & {
    performanceScore: ReturnType<typeof calculateVehiclePerformanceScore>;
  }> {
    const analytics = await GeolocationApiService.getLocationAnalytics([vehicleId], startDate, endDate);
    const performanceScore = calculateVehiclePerformanceScore(analytics);
    
    return {
      ...analytics,
      performanceScore,
    };
  }

  /**
   * Get fleet-wide analytics summary
   */
  static async getFleetAnalytics(
    vehicleIds: string[],
    startDate: string,
    endDate: string
  ): Promise<{
    overall: LocationAnalyticsResponse;
    byVehicle: Record<string, LocationAnalyticsResponse>;
    rankings: {
      efficiency: Array<{ vehicleId: string; score: number }>;
      distance: Array<{ vehicleId: string; kilometers: number }>;
      fuelEfficiency: Array<{ vehicleId: string; kmPerLiter: number }>;
    };
  }> {
    // Get overall fleet analytics
    const overall = await GeolocationApiService.getLocationAnalytics(vehicleIds, startDate, endDate);
    
    // Get individual vehicle analytics
    const byVehicle: Record<string, LocationAnalyticsResponse> = {};
    const efficiencyScores: Array<{ vehicleId: string; score: number }> = [];
    const distances: Array<{ vehicleId: string; kilometers: number }> = [];
    const fuelEfficiencies: Array<{ vehicleId: string; kmPerLiter: number }> = [];

    await Promise.all(
      vehicleIds.map(async (vehicleId) => {
        const vehicleAnalytics = await GeolocationApiService.getLocationAnalytics([vehicleId], startDate, endDate);
        byVehicle[vehicleId] = vehicleAnalytics;
        
        // Calculate performance metrics
        const performanceScore = calculateVehiclePerformanceScore(vehicleAnalytics);
        efficiencyScores.push({ vehicleId, score: performanceScore.overallScore });
        distances.push({ vehicleId, kilometers: vehicleAnalytics.metrics.totalDistance });
        fuelEfficiencies.push({ vehicleId, kmPerLiter: vehicleAnalytics.metrics.fuelEfficiency });
      })
    );

    // Sort rankings
    efficiencyScores.sort((a, b) => b.score - a.score);
    distances.sort((a, b) => b.kilometers - a.kilometers);
    fuelEfficiencies.sort((a, b) => b.kmPerLiter - a.kmPerLiter);

    return {
      overall,
      byVehicle,
      rankings: {
        efficiency: efficiencyScores,
        distance: distances,
        fuelEfficiency: fuelEfficiencies,
      },
    };
  }

  /**
   * Analyze route efficiency and provide optimization suggestions
   */
  static async analyzeRouteEfficiency(
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    efficiency: number; // percentage
    issues: Array<{
      type: 'excessive_idle' | 'slow_movement' | 'detour' | 'traffic';
      description: string;
      impact: 'high' | 'medium' | 'low';
      suggestion: string;
      locations: GpsCoordinate[];
    }>;
    optimizationPotential: number; // percentage improvement possible
  }> {
    const history = await GeolocationApiService.getVehicleTrackingHistory(vehicleId, startDate, endDate);
    const movement = analyzeVehicleMovement(history.coordinates);
    
    const issues: Array<{
      type: 'excessive_idle' | 'slow_movement' | 'detour' | 'traffic';
      description: string;
      impact: 'high' | 'medium' | 'low';
      suggestion: string;
      locations: GpsCoordinate[];
    }> = [];

    // Analyze idle time
    if (movement.idleTime > movement.movingTime * 0.3) { // More than 30% idle
      issues.push({
        type: 'excessive_idle',
        description: `Vehicle idle for ${Math.round(movement.idleTime)} minutes (${Math.round((movement.idleTime / (movement.idleTime + movement.movingTime)) * 100)}% of total time)`,
        impact: 'high',
        suggestion: 'Review stops and optimize scheduling to reduce idle time',
        locations: movement.stops.map(stop => stop.location),
      });
    }

    // Analyze average speed
    if (movement.averageSpeed < 25) { // Very slow average speed
      issues.push({
        type: 'slow_movement',
        description: `Low average speed: ${Math.round(movement.averageSpeed)} km/h`,
        impact: 'medium',
        suggestion: 'Consider alternative routes or departure times to avoid congestion',
        locations: [],
      });
    }

    // Calculate overall efficiency
    const idealTime = movement.totalDistance / 50; // Ideal time at 50 km/h
    const actualTime = (movement.movingTime + movement.idleTime) / 60; // Convert to hours
    const efficiency = Math.min(100, (idealTime / actualTime) * 100);

    const optimizationPotential = Math.max(0, 100 - efficiency);

    return {
      efficiency,
      issues,
      optimizationPotential,
    };
  }

  /**
   * Generate geofence compliance report
   */
  static async getGeofenceComplianceReport(
    geofenceIds: string[],
    startDate: string,
    endDate: string
  ): Promise<ReturnType<typeof generateGeofenceComplianceReport> & {
    details: GeofenceAnalyticsResponse[];
  }> {
    // Get analytics for all geofences
    const geofenceAnalytics = await Promise.all(
      geofenceIds.map(id => GeolocationApiService.getGeofenceAnalytics(id, startDate, endDate))
    );

    const complianceReport = generateGeofenceComplianceReport(geofenceAnalytics);

    return {
      ...complianceReport,
      details: geofenceAnalytics,
    };
  }

  /**
   * Identify vehicle behavior patterns
   */
  static async identifyBehaviorPatterns(
    vehicleId: string,
    startDate: string,
    endDate: string
  ): Promise<{
    patterns: {
      regularRoutes: Array<{
        name: string;
        frequency: number;
        coordinates: GpsCoordinate[];
        averageDuration: number;
      }>;
      timePatterns: {
        mostActiveHours: number[];
        leastActiveHours: number[];
        weekdayActivity: number;
        weekendActivity: number;
      };
      locationPatterns: {
        homeBase: GpsCoordinate;
        favoriteStops: Array<{
          location: GpsCoordinate;
          visits: number;
          averageStayTime: number;
        }>;
      };
    };
    insights: string[];
  }> {
    const history = await GeolocationApiService.getVehicleTrackingHistory(vehicleId, startDate, endDate);
    const analytics = await GeolocationApiService.getLocationAnalytics([vehicleId], startDate, endDate);
    
    // Identify popular locations
    const popularLocations = identifyPopularLocations(history.coordinates);
    
    // Generate hourly activity
    const hourlyActivity = generateHourlyActivity(history.coordinates);
    
    // Find most and least active hours
    const sortedByActivity = hourlyActivity.sort((a, b) => b.totalDistance - a.totalDistance);
    const mostActiveHours = sortedByActivity.slice(0, 3).map(h => h.hour);
    const leastActiveHours = sortedByActivity.slice(-3).map(h => h.hour);

    // Determine home base (most visited location)
    const homeBase = popularLocations[0]?.location || history.coordinates[0];

    // Generate insights
    const insights: string[] = [];
    
    if (analytics.metrics.averageSpeed < 30) {
      insights.push('Vehicle operates primarily in urban or congested areas');
    }
    
    if (analytics.metrics.idleTime > analytics.metrics.totalDrivingTime * 0.5) {
      insights.push('High idle time suggests delivery or service vehicle usage pattern');
    }
    
    if (popularLocations.length > 10) {
      insights.push('Vehicle follows varied routes with many different destinations');
    } else if (popularLocations.length < 3) {
      insights.push('Vehicle follows consistent, routine routes');
    }

    return {
      patterns: {
        regularRoutes: [], // Would need more sophisticated route pattern analysis
        timePatterns: {
          mostActiveHours,
          leastActiveHours,
          weekdayActivity: 0.7, // Placeholder - would calculate from actual data
          weekendActivity: 0.3,
        },
        locationPatterns: {
          homeBase,
          favoriteStops: popularLocations.slice(0, 5).map(loc => ({
            location: loc.location,
            visits: loc.visitCount,
            averageStayTime: loc.averageStayDuration,
          })),
        },
      },
      insights,
    };
  }

  /**
   * Generate carbon footprint report
   */
  static async getCarbonFootprintReport(
    vehicleIds: string[],
    startDate: string,
    endDate: string
  ): Promise<{
    totalEmissions: number; // kg CO2
    byVehicle: Record<string, number>;
    recommendations: string[];
    comparison: {
      industry: number; // kg CO2 per km industry average
      improvement: number; // percentage better/worse than average
    };
  }> {
    const analytics = await GeolocationApiService.getLocationAnalytics(vehicleIds, startDate, endDate);
    
    // CO2 emissions calculation (simplified)
    const co2PerLiter = 2.31; // kg CO2 per liter of fuel
    const avgConsumptionPer100km = 10; // liters per 100km (fleet average)
    
    const fuelUsed = (analytics.metrics.totalDistance * avgConsumptionPer100km) / 100;
    const totalEmissions = fuelUsed * co2PerLiter;
    
    const industryAverage = 0.23; // kg CO2 per km (industry average)
    const fleetAverage = totalEmissions / analytics.metrics.totalDistance;
    const improvement = ((industryAverage - fleetAverage) / industryAverage) * 100;

    const recommendations: string[] = [];
    
    if (improvement < 0) {
      recommendations.push('Implement eco-driving training programs');
      recommendations.push('Consider route optimization to reduce total distance');
      recommendations.push('Regular vehicle maintenance to improve fuel efficiency');
    }
    
    if (analytics.metrics.idleTime > 100) { // hours
      recommendations.push('Reduce idle time through better scheduling and driver awareness');
    }

    return {
      totalEmissions,
      byVehicle: {}, // Would calculate individual vehicle emissions
      recommendations,
      comparison: {
        industry: industryAverage,
        improvement,
      },
    };
  }
}
