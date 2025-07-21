import { Alert } from '../../entities/alert';
import { AlertType, AlertSeverity } from '../../enums';
import { PaginatedResponse } from '../../common';

// Response for getting all alerts
export interface GetAlertsResponse extends PaginatedResponse<Alert> {}

// Response for creating an alert
export interface CreateAlertResponse {
  message: string;
  alertId?: number;
}

// Alert statistics response
export interface AlertStatsResponse {
  total: number;
  byType: Record<AlertType, number>;
  bySeverity: Record<AlertSeverity, number>;
  recentCount: number;
  criticalCount: number;
}

// Alert filters for querying
export interface AlertFilters {
  vehicleId?: string;
  type?: AlertType;
  severity?: AlertSeverity;
  startDate?: string;
  endDate?: string;
  isRecent?: boolean;
}

// Export all alert response-related types
export * from './analytics';
