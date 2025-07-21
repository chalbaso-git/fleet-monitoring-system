import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GeolocationApiService } from '@/services/api/geolocation';
import { GeolocationValidationService } from '@/services/api/geolocation/validation';
import { 
  StoreCoordinateRequest,
  BulkCoordinateRequest,
  CreateGeofenceRequest 
} from '@/types/requests/geolocation';
import { GEOLOCATION_QUERY_KEYS } from './index';

/**
 * Enhanced mutation hook for storing coordinates with validation
 */
export const useStoreCoordinateWithValidation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: StoreCoordinateRequest) => {
      // Validate and sanitize the coordinate data
      const validation = GeolocationValidationService.validateAndSanitizeCoordinate(request);
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      return GeolocationApiService.storeCoordinate(validation.sanitizedData!);
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() 
      });
      
      console.log('GPS coordinate validated and stored successfully');
    },
    onError: (error: any) => {
      console.error(`Failed to store GPS coordinate: ${error.message}`);
    },
  });
};

/**
 * Enhanced mutation hook for bulk coordinate storage with validation
 */
export const useStoreBulkCoordinatesWithValidation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: BulkCoordinateRequest) => {
      // Validate bulk coordinates
      const validation = GeolocationValidationService.validateBulkCoordinates(request);
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Log warnings about data quality
      if (validation.duplicates && validation.duplicates > 0) {
        console.warn(`Found ${validation.duplicates} duplicate coordinates in batch`);
      }
      
      if (validation.outOfSequence && validation.outOfSequence > 0) {
        console.warn(`Found ${validation.outOfSequence} coordinates out of chronological sequence`);
      }

      return GeolocationApiService.storeBulkCoordinates(request);
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() 
      });
      
      console.log(`Stored ${variables.coordinates.length} coordinates successfully with validation`);
    },
    onError: (error: any) => {
      console.error(`Failed to store bulk coordinates: ${error.message}`);
    },
  });
};

/**
 * Enhanced mutation hook for creating geofences with geometry validation
 */
export const useCreateGeofenceWithValidation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: CreateGeofenceRequest) => {
      // Validate geofence geometry
      const validation = GeolocationValidationService.validateGeofenceGeometry(request);
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Log geometry warnings
      if (validation.geometryIssues && validation.geometryIssues.length > 0) {
        console.warn(`Geofence geometry issues: ${validation.geometryIssues.join(', ')}`);
      }

      return GeolocationApiService.createGeofence(request);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GEOLOCATION_QUERY_KEYS.geofences() });
      console.log('Geofence created successfully with validation');
    },
    onError: (error: any) => {
      console.error(`Failed to create geofence: ${error.message}`);
    },
  });
};

/**
 * Mutation hook for batch coordinate processing with pattern detection
 */
export const useProcessCoordinatesWithPatternDetection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: { vehicleId: string; coordinates: StoreCoordinateRequest[] }) => {
      // Detect suspicious patterns
      const patternAnalysis = GeolocationValidationService.detectSuspiciousPatterns(request.coordinates);
      
      if (patternAnalysis.patterns.length > 0) {
        console.warn('Suspicious patterns detected:', patternAnalysis.patterns);
        console.info('Recommendation:', patternAnalysis.recommendation);
        
        // Check for high severity issues
        const highSeverityIssues = patternAnalysis.patterns.filter(p => p.severity === 'high');
        if (highSeverityIssues.length > 0) {
          throw new Error(`High severity data quality issues detected: ${highSeverityIssues.map(p => p.description).join(', ')}`);
        }
      }

      // Process coordinates in bulk
      return GeolocationApiService.storeBulkCoordinates({
        vehicleId: request.vehicleId,
        coordinates: request.coordinates,
      });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() 
      });
      
      console.log(`Processed ${variables.coordinates.length} coordinates with pattern analysis`);
    },
    onError: (error: any) => {
      console.error(`Failed to process coordinates: ${error.message}`);
    },
  });
};

/**
 * Mutation hook for real-time coordinate streaming with quality checks
 */
export const useStreamRealTimeCoordinate = () => {
  const queryClient = useQueryClient();
  let lastCoordinate: StoreCoordinateRequest | undefined;

  return useMutation({
    mutationFn: async (request: StoreCoordinateRequest & { accuracy?: number; speed?: number; heading?: number }) => {
      // Validate real-time coordinate with quality checks
      const validation = GeolocationValidationService.validateRealTimeCoordinate(
        request,
        lastCoordinate
      );
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Log data quality warnings
      if (validation.warnings.length > 0) {
        console.warn('Data quality warnings:', validation.warnings);
      }
      
      console.info(`GPS data quality: ${validation.quality}`);

      // Store the coordinate
      const result = await GeolocationApiService.storeCoordinate(request);
      
      // Update last coordinate for next validation
      lastCoordinate = request;
      
      return result;
    },
    onSuccess: (data, variables) => {
      // For real-time streaming, we might want to update data more selectively
      // to avoid too many re-renders
      queryClient.setQueryData(
        GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId),
        (oldData: any) => ({
          ...oldData,
          currentPosition: {
            vehicleId: variables.vehicleId,
            latitude: variables.latitude,
            longitude: variables.longitude,
            timestamp: variables.timestamp,
          },
          lastUpdated: new Date().toISOString(),
        })
      );
    },
    onError: (error: any) => {
      console.error(`Failed to stream real-time coordinate: ${error.message}`);
    },
  });
};

/**
 * Mutation hook for emergency coordinate storage (bypasses some validations)
 */
export const useEmergencyStoreCoordinate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: StoreCoordinateRequest & { emergency: true }) => {
      console.warn('Emergency coordinate storage - bypassing some validations');
      
      // Basic validation only
      if (!request.vehicleId || !request.latitude || !request.longitude) {
        throw new Error('Missing required fields for emergency coordinate');
      }

      return GeolocationApiService.storeCoordinate(request);
    },
    onSuccess: (data, variables) => {
      // Immediately update all location queries for emergency scenarios
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocation(variables.vehicleId) 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.vehicleLocations() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.fleetOverview() 
      });
      queryClient.invalidateQueries({ 
        queryKey: GEOLOCATION_QUERY_KEYS.realTimeTracking([variables.vehicleId]) 
      });
      
      console.log('Emergency GPS coordinate stored successfully');
    },
    onError: (error: any) => {
      console.error(`Failed to store emergency GPS coordinate: ${error.message}`);
    },
  });
};
