/**
 * Route entity representing a calculated route for a vehicle
 * Matches backend RouteDto
 */
export interface Route {
  id: number;
  vehicleId: string;
  path: string; // Serialized path data (coordinates, waypoints, etc.)
  distance: number; // Distance in kilometers
  calculatedAt: string; // ISO date string
}

export default Route;
