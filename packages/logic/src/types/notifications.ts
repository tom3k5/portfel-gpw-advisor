/**
 * Notification types and interfaces for Portfel GPW Advisor
 */

/**
 * Notification frequency options
 */
export type NotificationFrequency = 'daily' | 'weekly' | 'off';

/**
 * Days of the week for weekly notifications
 */
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Time of day for notifications (24-hour format)
 */
export interface NotificationTime {
  /** Hour (0-23) */
  hour: number;
  /** Minute (0-59) */
  minute: number;
}

/**
 * User notification preferences
 */
export interface NotificationSettings {
  /** Master switch for all notifications */
  enabled: boolean;
  /** How often to send reports */
  frequency: NotificationFrequency;
  /** Time of day to send (user's local time) */
  time: NotificationTime;
  /** For weekly notifications, which day */
  weeklyDay?: DayOfWeek;
  /** Include position details in report */
  includePositions: boolean;
  /** Quiet hours configuration */
  quietHours: {
    enabled: boolean;
    start: NotificationTime;
    end: NotificationTime;
  };
  /** IANA timezone (e.g., 'Europe/Warsaw') */
  timezone: string;
}

/**
 * Portfolio report data structure
 */
export interface PortfolioReport {
  /** Unique ID for this report */
  id: string;
  /** When report was generated */
  generatedAt: Date;
  /** Report period type */
  period: 'daily' | 'weekly';
  /** Portfolio summary data */
  summary: {
    totalValue: number;
    totalCost: number;
    totalPnL: number;
    totalPnLPercent: number;
    positionCount: number;
  };
  /** Changes since last report */
  changes: {
    valueChange: number;
    valueChangePercent: number;
    topGainer?: { symbol: string; changePercent: number };
    topLoser?: { symbol: string; changePercent: number };
  };
  /** Individual position details (optional) */
  positions?: Array<{
    symbol: string;
    quantity: number;
    currentPrice: number;
    pnl: number;
    pnlPercent: number;
  }>;
}

/**
 * Scheduled notification metadata
 */
export interface ScheduledNotification {
  /** Expo notification ID */
  id: string;
  /** Type of notification */
  type: 'daily_report' | 'weekly_report';
  /** When notification was scheduled */
  scheduledFor: Date;
  /** Next trigger date/time */
  nextTrigger: Date;
}

/**
 * Notification history entry
 */
export interface NotificationHistoryEntry {
  /** Unique ID */
  id: string;
  /** When notification was sent */
  sentAt: Date;
  /** Type of notification */
  type: 'daily_report' | 'weekly_report';
  /** Generated report data */
  report: PortfolioReport;
  /** Whether user opened this notification */
  opened: boolean;
}
