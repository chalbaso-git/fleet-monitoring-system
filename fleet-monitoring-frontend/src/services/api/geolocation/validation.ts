import { 
  StoreCoordinateRequest,
  EnhancedCoordinateRequest,
  BulkCoordinateRequest,
  CreateGeofenceRequest,
  LocationQueryFilters
} from '@/types/requests/geolocation';
import {
  validateStoreCoordinateRequest,
  validateEnhancedCoordinateRequest,
  validateBulkCoordinateRequest,
  validateCreateGeofenceRequest,
  validateLocationQueryFilters,
  sanitizeCoordinateRequest,
  ValidationResult
} from '@/types/requests/geolocation/validation';
import { validateGpsCoordinates, areCoordinatesEqual } from '@/types/entities/geolocation/utils';
import { MOVEMENT_THRESHOLDS } from '@/types/entities/geolocation/constants';

/**
 * Validation service for geolocation requests and data
 */
export class GeolocationValidationService {
  /**
   * Validates and sanitizes coordinate data before storing
   */
  static validateAndSanitizeCoordinate(request: StoreCoordinateRequest): {
    isValid: boolean;
    sanitizedData?: StoreCoordinateRequest;
    errors: string[];
  } {
    const validation = validateStoreCoordinateRequest(request);
    
    if (!validation.isValid) {
      return {
        isValid: false,
        errors: validation.errors,
      };
    }

    const sanitizedData = sanitizeCoordinateRequest(request);
    
    return {
      isValid: true,
      sanitizedData,
      errors: [],
    };
  }

  /**
   * Validates bulk coordinate requests with additional batch-specific checks
   */
  static validateBulkCoordinates(request: BulkCoordinateRequest): ValidationResult & {
    duplicates?: number;
    outOfSequence?: number;
  } {
    const baseValidation = validateBulkCoordinateRequest(request);
    
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    let duplicates = 0;
    let outOfSequence = 0;

    // Check for duplicates and sequence issues
    const coordinates = request.coordinates;
    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];

      // Check for duplicate coordinates
      if (areCoordinatesEqual(prev, curr) && prev.timestamp === curr.timestamp) {
        duplicates++;
      }

      // Check for timestamp sequence
      if (new Date(curr.timestamp) < new Date(prev.timestamp)) {
        outOfSequence++;
      }
    }

    const warnings: string[] = [];
    if (duplicates > 0) {
      warnings.push(`Found ${duplicates} duplicate coordinates`);
    }
    if (outOfSequence > 0) {
      warnings.push(`Found ${outOfSequence} coordinates out of chronological sequence`);
    }

    return {
      isValid: true,
      errors: warnings,
      duplicates,
      outOfSequence,
    };
  }

  /**
   * Validates real-time coordinate data with additional checks for data quality
   */
  static validateRealTimeCoordinate(
    request: EnhancedCoordinateRequest,
    previousCoordinate?: StoreCoordinateRequest
  ): ValidationResult & {
    quality: 'high' | 'medium' | 'low';
    warnings: string[];
  } {
    const validation = validateEnhancedCoordinateRequest(request);
    const warnings: string[] = [];
    let quality: 'high' | 'medium' | 'low' = 'high';

    // GPS accuracy check
    if (request.accuracy && request.accuracy > 20) {
      quality = 'medium';
      warnings.push('GPS accuracy is moderate (>20m)');
    } else if (request.accuracy && request.accuracy > 50) {
      quality = 'low';
      warnings.push('GPS accuracy is low (>50m)');
    }

    // Speed validation against previous coordinate
    if (previousCoordinate) {
      const timeDiff = (new Date(request.timestamp).getTime() - new Date(previousCoordinate.timestamp).getTime()) / 1000; // seconds
      
      if (timeDiff > 0) {
        const distance = this.calculateQuickDistance(
          previousCoordinate.latitude, previousCoordinate.longitude,
          request.latitude, request.longitude
        );
        const calculatedSpeed = (distance * 3600) / timeDiff; // km/h

        // Check for impossible speeds (>200 km/h for ground vehicles)
        if (calculatedSpeed > 200) {
          validation.errors.push(`Calculated speed (${Math.round(calculatedSpeed)} km/h) seems unrealistic`);
          quality = 'low';
        }

        // Check if reported speed differs significantly from calculated speed
        if (request.speed && Math.abs(request.speed - calculatedSpeed) > 20) {
          warnings.push(`Reported speed differs from calculated speed by ${Math.round(Math.abs(request.speed - calculatedSpeed))} km/h`);
          quality = quality === 'high' ? 'medium' : quality;
        }
      }
    }

    // Battery level warnings
    if (request.batteryLevel && request.batteryLevel < 20) {
      warnings.push('Device battery level is low (<20%)');
    }

    // Signal strength warnings
    if (request.signalStrength && request.signalStrength < 30) {
      warnings.push('GPS signal strength is weak (<30%)');
      quality = quality === 'high' ? 'medium' : quality;
    }

    return {
      ...validation,
      quality,
      warnings,
    };
  }

  /**
   * Validates geofence definition with geometric checks
   */
  static validateGeofenceGeometry(request: CreateGeofenceRequest): ValidationResult & {
    geometryIssues?: string[];
  } {
    const validation = validateCreateGeofenceRequest(request);
    const geometryIssues: string[] = [];

    if (request.type === 'polygon' && request.coordinates) {
      // Check for self-intersecting polygon (simplified check)
      if (this.isPolygonSelfIntersecting(request.coordinates)) {
        geometryIssues.push('Polygon edges intersect each other');
      }

      // Check for minimum area
      const area = this.calculatePolygonArea(request.coordinates);
      if (area < 100) { // Less than 100 square meters
        geometryIssues.push('Polygon area is very small (<100 sq meters)');
      }
    }

    if (request.type === 'circle' && request.radius && request.radius > 10000) {
      geometryIssues.push('Very large radius may impact performance');
    }

    return {
      ...validation,
      geometryIssues: geometryIssues.length > 0 ? geometryIssues : undefined,
    };
  }

  /**
   * Validates location query parameters for performance optimization
   */
  static validateLocationQuery(filters: LocationQueryFilters): ValidationResult & {
    performanceWarnings?: string[];
  } {
    const validation = validateLocationQueryFilters(filters);
    const performanceWarnings: string[] = [];

    // Check for potentially expensive queries
    if (filters.startDate && filters.endDate) {
      const daysDiff = (new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 90) {
        performanceWarnings.push('Large date range (>90 days) may result in slow query performance');
      }
    }

    if (!filters.limit || filters.limit > 5000) {
      performanceWarnings.push('Large result set requested - consider using pagination');
    }

    if (filters.bounds) {
      const area = this.calculateBoundingBoxArea(filters.bounds);
      if (area > 10000) { // Large area in square kilometers
        performanceWarnings.push('Large geographic area may result in many results');
      }
    }

    return {
      ...validation,
      performanceWarnings: performanceWarnings.length > 0 ? performanceWarnings : undefined,
    };
  }

  /**
   * Detects potentially suspicious coordinate patterns
   */
  static detectSuspiciousPatterns(coordinates: StoreCoordinateRequest[]): {
    patterns: Array<{
      type: 'teleportation' | 'stuck' | 'drift' | 'replay';
      description: string;
      severity: 'high' | 'medium' | 'low';
      coordinates: StoreCoordinateRequest[];
    }>;
    recommendation: string;
  } {
    const patterns: Array<{
      type: 'teleportation' | 'stuck' | 'drift' | 'replay';
      description: string;
      severity: 'high' | 'medium' | 'low';
      coordinates: StoreCoordinateRequest[];
    }> = [];

    if (coordinates.length < 2) {
      return { patterns, recommendation: 'Not enough data for pattern analysis' };
    }

    // Detect teleportation (impossible speeds)
    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      const timeDiff = (new Date(curr.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 1000;
      
      if (timeDiff > 0) {
        const distance = this.calculateQuickDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
        const speed = (distance * 3600) / timeDiff; // km/h

        if (speed > 300) { // Impossible for ground vehicles
          patterns.push({
            type: 'teleportation',
            description: `Impossible speed detected: ${Math.round(speed)} km/h`,
            severity: 'high',
            coordinates: [prev, curr],
          });
        }
      }
    }

    // Detect stuck coordinates (same location for extended period)
    let stuckCount = 0;
    let stuckStart = 0;
    for (let i = 1; i < coordinates.length; i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      
      if (areCoordinatesEqual(prev, curr)) {
        if (stuckCount === 0) stuckStart = i - 1;
        stuckCount++;
      } else {
        if (stuckCount > 10) { // More than 10 identical coordinates
          patterns.push({
            type: 'stuck',
            description: `Vehicle appears stuck at same location for ${stuckCount} data points`,
            severity: 'medium',
            coordinates: coordinates.slice(stuckStart, i),
          });
        }
        stuckCount = 0;
      }
    }

    // Detect GPS drift (small random movements while stationary)
    let driftCount = 0;
    for (let i = 1; i < Math.min(coordinates.length, 20); i++) {
      const prev = coordinates[i - 1];
      const curr = coordinates[i];
      const distance = this.calculateQuickDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
      
      if (distance < 0.05 && distance > 0.005) { // 5-50 meters
        driftCount++;
      }
    }

    if (driftCount > 10) {
      patterns.push({
        type: 'drift',
        description: 'Possible GPS drift detected - small random movements while stationary',
        severity: 'low',
        coordinates: coordinates.slice(0, 20),
      });
    }

    let recommendation = 'Data appears normal';
    if (patterns.length > 0) {
      const highSeverity = patterns.filter(p => p.severity === 'high').length;
      if (highSeverity > 0) {
        recommendation = 'High severity issues detected - review GPS hardware and data collection';
      } else {
        recommendation = 'Minor data quality issues detected - monitor GPS device status';
      }
    }

    return { patterns, recommendation };
  }

  /**
   * Quick distance calculation using haversine formula
   */
  private static calculateQuickDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Simple polygon self-intersection check
   */
  private static isPolygonSelfIntersecting(coordinates: Array<{ latitude: number; longitude: number }>): boolean {
    // Simplified check - in a real implementation, you'd use a more sophisticated algorithm
    if (coordinates.length < 4) return false;
    
    // Check if first and last points are too close (likely self-intersecting)
    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    const distance = this.calculateQuickDistance(first.latitude, first.longitude, last.latitude, last.longitude);
    
    return distance < 0.001; // Very close points might indicate self-intersection
  }

  /**
   * Calculate approximate polygon area
   */
  private static calculatePolygonArea(coordinates: Array<{ latitude: number; longitude: number }>): number {
    // Simplified area calculation using shoelace formula (approximate for small areas)
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i].latitude * coordinates[j].longitude;
      area -= coordinates[j].latitude * coordinates[i].longitude;
    }
    return Math.abs(area) * 6378137 * 6378137 / 2; // Rough conversion to square meters
  }

  /**
   * Calculate bounding box area in square kilometers
   */
  private static calculateBoundingBoxArea(bounds: { north: number; south: number; east: number; west: number }): number {
    const latDiff = bounds.north - bounds.south;
    const lonDiff = bounds.east - bounds.west;
    const avgLat = (bounds.north + bounds.south) / 2;
    
    const kmPerDegreeLat = 111;
    const kmPerDegreeLon = 111 * Math.cos(avgLat * Math.PI / 180);
    
    const areaKm2 = (latDiff * kmPerDegreeLat) * (lonDiff * kmPerDegreeLon);
    return Math.abs(areaKm2);
  }
}
