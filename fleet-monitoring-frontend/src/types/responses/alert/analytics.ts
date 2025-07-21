import { AlertSeverity, AlertType } from '../../enums';

// Extended response types con metadatos
export interface AlertWithAnalytics {
  id: number;
  vehicleId: string;
  type: AlertType;
  message: string;
  createdAt: string;
  severity: AlertSeverity;
  
  // Analytics data
  isRecent: boolean;
  relativeTime: string;
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction?: string;
  estimatedResolutionTime?: number; // in minutes
}

// Dashboard stats response
export interface AlertDashboardStats {
  totalAlerts: number;
  alertsToday: number;
  criticalAlerts: number;
  resolvedToday: number;
  averageResolutionTime: number; // in minutes
  
  // Trends
  trendsLastWeek: {
    date: string;
    count: number;
  }[];
  
  // By type breakdown
  alertsByType: {
    type: AlertType;
    count: number;
    percentage: number;
  }[];
  
  // By severity breakdown  
  alertsBySeverity: {
    severity: AlertSeverity;
    count: number;
    percentage: number;
  }[];
}

// Alert summary for notifications
export interface AlertSummary {
  totalUnread: number;
  criticalUnread: number;
  lastAlert?: {
    id: number;
    type: AlertType;
    vehicleId: string;
    createdAt: string;
  };
}
