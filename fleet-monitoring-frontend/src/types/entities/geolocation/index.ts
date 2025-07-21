/**
 * GPS Coordinate entity for storing vehicle location
 * Matches backend GeolocationDto
 */
export interface GpsCoordinate {
  vehicleId: string;
  latitude: number;
  longitude: number;
  timestamp: string; // ISO date string
}

export default GpsCoordinate;
