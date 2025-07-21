/**
 * Routing entity types for route calculation
 * Simplified to match backend RoutingController endpoints
 */

export interface RouteCalculation {
  vehicleId: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedDuration: number; // minutes
  calculatedAt: string;
}

export interface RouteCalculationRequest {
  vehicleId: string;
  origin: string;
  destination: string;
}

export default RouteCalculation;
