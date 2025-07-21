import { Route, RouteWithMetadata, RoutePerformance } from '@/types/entities/route';
import { parseRoutePath, calculateTotalDistance, estimateRouteDuration } from '@/types/entities/route/utils';

/**
 * Route analytics and reporting utilities
 */

/**
 * Calculates comprehensive route statistics from a collection of routes
 */
export function calculateRouteStatistics(routes: Route[]): {
  totalRoutes: number;
  totalDistance: number;
  averageDistance: number;
  minDistance: number;
  maxDistance: number;
  distanceVariance: number;
  routesByVehicle: Record<string, number>;
  dailyAverages: Record<string, number>;
  efficiencyMetrics: {
    averageEfficiency: number;
    topPerformers: string[];
    underPerformers: string[];
  };
} {
  if (routes.length === 0) {
    return {
      totalRoutes: 0,
      totalDistance: 0,
      averageDistance: 0,
      minDistance: 0,
      maxDistance: 0,
      distanceVariance: 0,
      routesByVehicle: {},
      dailyAverages: {},
      efficiencyMetrics: {
        averageEfficiency: 0,
        topPerformers: [],
        underPerformers: [],
      },
    };
  }

  const distances = routes.map(r => r.distance);
  const totalDistance = distances.reduce((sum, d) => sum + d, 0);
  const averageDistance = totalDistance / routes.length;
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);

  // Calculate variance
  const squaredDiffs = distances.map(d => Math.pow(d - averageDistance, 2));
  const distanceVariance = squaredDiffs.reduce((sum, d) => sum + d, 0) / routes.length;

  // Routes by vehicle
  const routesByVehicle: Record<string, number> = {};
  routes.forEach(route => {
    routesByVehicle[route.vehicleId] = (routesByVehicle[route.vehicleId] || 0) + 1;
  });

  // Daily averages
  const dailyGroups: Record<string, number[]> = {};
  routes.forEach(route => {
    const date = route.calculatedAt.split('T')[0];
    if (!dailyGroups[date]) {
      dailyGroups[date] = [];
    }
    dailyGroups[date].push(route.distance);
  });

  const dailyAverages: Record<string, number> = {};
  Object.entries(dailyGroups).forEach(([date, distances]) => {
    dailyAverages[date] = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  });

  // Efficiency metrics (simplified)
  const vehicleDistances: Record<string, number[]> = {};
  routes.forEach(route => {
    if (!vehicleDistances[route.vehicleId]) {
      vehicleDistances[route.vehicleId] = [];
    }
    vehicleDistances[route.vehicleId].push(route.distance);
  });

  const vehicleEfficiencies = Object.entries(vehicleDistances).map(([vehicleId, distances]) => ({
    vehicleId,
    efficiency: distances.reduce((sum, d) => sum + d, 0) / distances.length,
  }));

  vehicleEfficiencies.sort((a, b) => b.efficiency - a.efficiency);
  
  const topPerformers = vehicleEfficiencies.slice(0, 3).map(v => v.vehicleId);
  const underPerformers = vehicleEfficiencies.slice(-3).map(v => v.vehicleId);
  const averageEfficiency = vehicleEfficiencies.reduce((sum, v) => sum + v.efficiency, 0) / vehicleEfficiencies.length;

  return {
    totalRoutes: routes.length,
    totalDistance,
    averageDistance,
    minDistance,
    maxDistance,
    distanceVariance,
    routesByVehicle,
    dailyAverages,
    efficiencyMetrics: {
      averageEfficiency,
      topPerformers,
      underPerformers,
    },
  };
}

/**
 * Generates route efficiency trends over time
 */
export function generateEfficiencyTrends(routes: Route[]): {
  daily: Array<{
    date: string;
    averageDistance: number;
    routeCount: number;
    efficiency: number;
  }>;
  weekly: Array<{
    week: string;
    averageDistance: number;
    routeCount: number;
    efficiency: number;
  }>;
  monthly: Array<{
    month: string;
    averageDistance: number;
    routeCount: number;
    efficiency: number;
  }>;
} {
  // Group routes by time periods
  const dailyGroups: Record<string, Route[]> = {};
  const weeklyGroups: Record<string, Route[]> = {};
  const monthlyGroups: Record<string, Route[]> = {};

  routes.forEach(route => {
    const date = new Date(route.calculatedAt);
    
    // Daily grouping
    const dayKey = date.toISOString().split('T')[0];
    if (!dailyGroups[dayKey]) dailyGroups[dayKey] = [];
    dailyGroups[dayKey].push(route);

    // Weekly grouping (ISO week)
    const yearWeek = `${date.getFullYear()}-W${getISOWeek(date)}`;
    if (!weeklyGroups[yearWeek]) weeklyGroups[yearWeek] = [];
    weeklyGroups[yearWeek].push(route);

    // Monthly grouping
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyGroups[monthKey]) monthlyGroups[monthKey] = [];
    monthlyGroups[monthKey].push(route);
  });

  // Generate trends
  const daily = Object.entries(dailyGroups).map(([date, routes]) => {
    const stats = calculateRouteStatistics(routes);
    return {
      date,
      averageDistance: stats.averageDistance,
      routeCount: routes.length,
      efficiency: stats.efficiencyMetrics.averageEfficiency,
    };
  }).sort((a, b) => a.date.localeCompare(b.date));

  const weekly = Object.entries(weeklyGroups).map(([week, routes]) => {
    const stats = calculateRouteStatistics(routes);
    return {
      week,
      averageDistance: stats.averageDistance,
      routeCount: routes.length,
      efficiency: stats.efficiencyMetrics.averageEfficiency,
    };
  }).sort((a, b) => a.week.localeCompare(b.week));

  const monthly = Object.entries(monthlyGroups).map(([month, routes]) => {
    const stats = calculateRouteStatistics(routes);
    return {
      month,
      averageDistance: stats.averageDistance,
      routeCount: routes.length,
      efficiency: stats.efficiencyMetrics.averageEfficiency,
    };
  }).sort((a, b) => a.month.localeCompare(b.month));

  return { daily, weekly, monthly };
}

/**
 * Identifies route patterns and anomalies
 */
export function identifyRoutePatterns(routes: Route[]): {
  commonPatterns: Array<{
    pattern: string;
    frequency: number;
    routes: Route[];
    avgDistance: number;
  }>;
  anomalies: Array<{
    route: Route;
    anomalyType: 'distance_outlier' | 'timing_outlier' | 'path_deviation';
    severity: 'high' | 'medium' | 'low';
    description: string;
  }>;
  recommendations: string[];
} {
  const commonPatterns: Array<{
    pattern: string;
    frequency: number;
    routes: Route[];
    avgDistance: number;
  }> = [];

  const anomalies: Array<{
    route: Route;
    anomalyType: 'distance_outlier' | 'timing_outlier' | 'path_deviation';
    severity: 'high' | 'medium' | 'low';
    description: string;
  }> = [];

  const recommendations: string[] = [];

  // Group routes by vehicle for pattern analysis
  const vehicleRoutes: Record<string, Route[]> = {};
  routes.forEach(route => {
    if (!vehicleRoutes[route.vehicleId]) {
      vehicleRoutes[route.vehicleId] = [];
    }
    vehicleRoutes[route.vehicleId].push(route);
  });

  // Analyze patterns for each vehicle
  Object.entries(vehicleRoutes).forEach(([vehicleId, vehicleRoutes]) => {
    const distances = vehicleRoutes.map(r => r.distance);
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const stdDev = Math.sqrt(
      distances.reduce((sum, d) => sum + Math.pow(d - avgDistance, 2), 0) / distances.length
    );

    // Find distance outliers
    vehicleRoutes.forEach(route => {
      const deviation = Math.abs(route.distance - avgDistance);
      if (deviation > stdDev * 2) { // 2 standard deviations
        anomalies.push({
          route,
          anomalyType: 'distance_outlier',
          severity: deviation > stdDev * 3 ? 'high' : 'medium',
          description: `Route distance (${route.distance.toFixed(1)}km) significantly differs from vehicle average (${avgDistance.toFixed(1)}km)`,
        });
      }
    });

    // Identify common distance ranges
    const distanceRanges = ['0-10', '10-50', '50-100', '100+'];
    const rangeGroups: Record<string, Route[]> = {
      '0-10': [],
      '10-50': [],
      '50-100': [],
      '100+': [],
    };

    vehicleRoutes.forEach(route => {
      if (route.distance <= 10) rangeGroups['0-10'].push(route);
      else if (route.distance <= 50) rangeGroups['10-50'].push(route);
      else if (route.distance <= 100) rangeGroups['50-100'].push(route);
      else rangeGroups['100+'].push(route);
    });

    Object.entries(rangeGroups).forEach(([range, routes]) => {
      if (routes.length > 2) { // At least 3 routes to be a pattern
        const avgDist = routes.reduce((sum, r) => sum + r.distance, 0) / routes.length;
        commonPatterns.push({
          pattern: `${vehicleId} - ${range}km routes`,
          frequency: routes.length,
          routes,
          avgDistance: avgDist,
        });
      }
    });
  });

  // Generate recommendations
  if (anomalies.filter(a => a.severity === 'high').length > 0) {
    recommendations.push('High severity anomalies detected - review route planning processes');
  }

  if (commonPatterns.length > 0) {
    recommendations.push('Route patterns identified - consider creating templates for frequent routes');
  }

  const totalRoutes = routes.length;
  const uniqueVehicles = Object.keys(vehicleRoutes).length;
  const avgRoutesPerVehicle = totalRoutes / uniqueVehicles;

  if (avgRoutesPerVehicle > 20) {
    recommendations.push('High route volume per vehicle - consider workload balancing');
  }

  return {
    commonPatterns: commonPatterns.sort((a, b) => b.frequency - a.frequency),
    anomalies: anomalies.sort((a, b) => {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    }),
    recommendations,
  };
}

/**
 * Calculates route optimization potential
 */
export function calculateOptimizationPotential(routes: Route[]): {
  overallPotential: number; // percentage
  categories: Array<{
    name: string;
    potential: number;
    affectedRoutes: number;
    estimatedSavings: {
      distance: number;
      time: number;
      cost: number;
    };
  }>;
  quickWins: Array<{
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'high' | 'medium' | 'low';
    estimatedSavings: number;
  }>;
} {
  const categories = [
    {
      name: 'Route Ordering',
      potential: 0,
      affectedRoutes: 0,
      estimatedSavings: { distance: 0, time: 0, cost: 0 },
    },
    {
      name: 'Vehicle Assignment',
      potential: 0,
      affectedRoutes: 0,
      estimatedSavings: { distance: 0, time: 0, cost: 0 },
    },
    {
      name: 'Timing Optimization',
      potential: 0,
      affectedRoutes: 0,
      estimatedSavings: { distance: 0, time: 0, cost: 0 },
    },
    {
      name: 'Route Consolidation',
      potential: 0,
      affectedRoutes: 0,
      estimatedSavings: { distance: 0, time: 0, cost: 0 },
    },
  ];

  // Analyze route ordering optimization potential
  const vehicleGroups: Record<string, Route[]> = {};
  routes.forEach(route => {
    if (!vehicleGroups[route.vehicleId]) {
      vehicleGroups[route.vehicleId] = [];
    }
    vehicleGroups[route.vehicleId].push(route);
  });

  let routesWithOrderingPotential = 0;
  let totalDistanceSavingsPotential = 0;

  Object.values(vehicleGroups).forEach(vehicleRoutes => {
    vehicleRoutes.forEach(route => {
      const waypoints = parseRoutePath(route.path);
      if (waypoints.length > 3) {
        // Estimate potential savings from reordering waypoints
        const estimatedSavings = route.distance * 0.1; // 10% potential savings
        routesWithOrderingPotential++;
        totalDistanceSavingsPotential += estimatedSavings;
      }
    });
  });

  categories[0].potential = routesWithOrderingPotential > 0 ? 15 : 0;
  categories[0].affectedRoutes = routesWithOrderingPotential;
  categories[0].estimatedSavings.distance = totalDistanceSavingsPotential;

  // Calculate overall potential
  const overallPotential = categories.reduce((sum, cat) => sum + cat.potential, 0) / categories.length;

  const quickWins = [
    {
      description: 'Implement route templates for frequent patterns',
      impact: 'medium' as const,
      effort: 'low' as const,
      estimatedSavings: 5,
    },
    {
      description: 'Optimize waypoint ordering for multi-stop routes',
      impact: 'high' as const,
      effort: 'medium' as const,
      estimatedSavings: 15,
    },
    {
      description: 'Consolidate nearby routes for same vehicle',
      impact: 'medium' as const,
      effort: 'medium' as const,
      estimatedSavings: 8,
    },
  ];

  return {
    overallPotential,
    categories,
    quickWins,
  };
}

/**
 * Get ISO week number for a date
 */
function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Generate route performance score
 */
export function calculateRoutePerformanceScore(route: Route): {
  overallScore: number;
  breakdown: {
    efficiency: number;
    reliability: number;
    cost: number;
    sustainability: number;
  };
  rating: 'excellent' | 'good' | 'fair' | 'poor';
} {
  // Simplified scoring algorithm
  const waypoints = parseRoutePath(route.path);
  const estimatedDuration = estimateRouteDuration(waypoints);
  
  // Efficiency based on distance vs estimated optimal distance
  const efficiency = Math.min(100, 80 + Math.random() * 20); // Placeholder calculation
  
  // Reliability based on route complexity
  const reliability = waypoints.length < 10 ? 90 : Math.max(60, 100 - waypoints.length * 2);
  
  // Cost efficiency
  const costEfficiency = route.distance < 100 ? 85 : Math.max(50, 100 - route.distance * 0.1);
  
  // Sustainability (fuel efficiency estimation)
  const sustainability = route.distance < 50 ? 90 : Math.max(60, 100 - route.distance * 0.2);
  
  const overallScore = (efficiency + reliability + costEfficiency + sustainability) / 4;
  
  let rating: 'excellent' | 'good' | 'fair' | 'poor';
  if (overallScore >= 90) rating = 'excellent';
  else if (overallScore >= 75) rating = 'good';
  else if (overallScore >= 60) rating = 'fair';
  else rating = 'poor';

  return {
    overallScore,
    breakdown: {
      efficiency,
      reliability,
      cost: costEfficiency,
      sustainability,
    },
    rating,
  };
}
