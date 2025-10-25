import type {
  PortfolioReport,
  NotificationHistoryEntry,
} from '../types/notifications';
import type { Position } from '../types/portfolio';
import type { StorageAdapter } from '../storage/portfolio';
import {
  calculatePortfolioSummary,
  calculatePnL,
  calculatePnLPercent,
} from '../calculations/portfolio';

/**
 * Storage keys for report data
 */
const NOTIFICATION_HISTORY_KEY = '@portfel/notification-history';
const LAST_REPORT_SNAPSHOT_KEY = '@portfel/last-report-snapshot';

/**
 * Maximum history entries to keep
 */
const MAX_HISTORY_ENTRIES = 100;

/**
 * Default storage adapter (uses localStorage for web)
 */
class LocalStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}

/**
 * Portfolio snapshot for tracking changes
 */
interface PortfolioSnapshot {
  timestamp: Date;
  totalValue: number;
  positions: Record<
    string,
    {
      quantity: number;
      currentPrice: number;
      pnl: number;
      pnlPercent: number;
    }
  >;
}

/**
 * Report generator service
 * Creates portfolio reports with change tracking
 */
export class ReportGenerator {
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
  }

  /**
   * Generates a portfolio report from current positions
   * @param positions Current portfolio positions
   * @param period Report period type
   * @param includePositions Whether to include individual position details
   * @returns Generated portfolio report
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * const report = await generator.generateReport(positions, 'daily', true);
   * console.log('Portfolio value:', report.summary.totalValue);
   * console.log('Change:', report.changes.valueChangePercent, '%');
   * ```
   */
  async generateReport(
    positions: Position[],
    period: 'daily' | 'weekly',
    includePositions: boolean = true
  ): Promise<PortfolioReport> {
    // Calculate current portfolio summary
    const summary = calculatePortfolioSummary(positions);

    // Get last snapshot for change calculation
    const lastSnapshot = await this.getLastSnapshot();

    // Calculate changes since last report
    const changes = this.calculateChanges(positions, summary, lastSnapshot);

    // Build report
    const report: PortfolioReport = {
      id: this.generateReportId(),
      generatedAt: new Date(),
      period,
      summary: {
        totalValue: summary.totalValue,
        totalCost: summary.totalCost,
        totalPnL: summary.totalPnL,
        totalPnLPercent: summary.totalPnLPercent,
        positionCount: positions.length,
      },
      changes,
      positions: includePositions
        ? positions.map((pos) => ({
            symbol: pos.symbol,
            quantity: pos.quantity,
            currentPrice: pos.currentPrice,
            pnl: calculatePnL(pos),
            pnlPercent: calculatePnLPercent(pos),
          }))
        : undefined,
    };

    // Save current state as snapshot
    await this.saveSnapshot(positions, summary);

    return report;
  }

  /**
   * Calculates changes since last report
   * @param positions Current positions
   * @param summary Current portfolio summary
   * @param lastSnapshot Last saved snapshot
   * @returns Changes object
   */
  private calculateChanges(
    positions: Position[],
    summary: { totalValue: number; totalCost: number; totalPnL: number; totalPnLPercent: number },
    lastSnapshot: PortfolioSnapshot | null
  ): PortfolioReport['changes'] {
    if (!lastSnapshot) {
      // No previous snapshot - return zero changes
      return {
        valueChange: 0,
        valueChangePercent: 0,
      };
    }

    // Calculate value change
    const valueChange = summary.totalValue - lastSnapshot.totalValue;
    const valueChangePercent =
      lastSnapshot.totalValue > 0
        ? (valueChange / lastSnapshot.totalValue) * 100
        : 0;

    // Find top gainer and loser
    const { topGainer, topLoser } = this.findTopMovers(
      positions,
      lastSnapshot
    );

    return {
      valueChange,
      valueChangePercent,
      topGainer,
      topLoser,
    };
  }

  /**
   * Finds top gaining and losing positions since last snapshot
   * @param positions Current positions
   * @param lastSnapshot Last saved snapshot
   * @returns Top gainer and loser
   */
  private findTopMovers(
    positions: Position[],
    lastSnapshot: PortfolioSnapshot
  ): {
    topGainer?: { symbol: string; changePercent: number };
    topLoser?: { symbol: string; changePercent: number };
  } {
    const changes: Array<{ symbol: string; changePercent: number }> = [];

    for (const position of positions) {
      const lastPosition = lastSnapshot.positions[position.symbol];
      if (!lastPosition) {
        // New position - skip for change calculation
        continue;
      }

      // Calculate price change percent
      const priceChange =
        ((position.currentPrice - lastPosition.currentPrice) /
          lastPosition.currentPrice) *
        100;

      changes.push({
        symbol: position.symbol,
        changePercent: priceChange,
      });
    }

    if (changes.length === 0) {
      return {};
    }

    // Sort by change percent
    changes.sort((a, b) => b.changePercent - a.changePercent);

    const topGainer = changes[0];
    const topLoser = changes[changes.length - 1];

    return {
      topGainer: topGainer && topGainer.changePercent > 0 ? topGainer : undefined,
      topLoser: topLoser && topLoser.changePercent < 0 ? topLoser : undefined,
    };
  }

  /**
   * Formats a report as a notification body text
   * @param report Portfolio report
   * @returns Formatted notification body
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * const report = await generator.generateReport(positions, 'daily', false);
   * const body = generator.formatNotificationBody(report);
   * console.log(body);
   * // Portfolio: 50,000 PLN (+2.5%)
   * // Change: +1,200 PLN (+2.5%)
   * // Top gainer: PKN +5.2%
   * ```
   */
  formatNotificationBody(report: PortfolioReport): string {
    const parts: string[] = [];

    // Portfolio value and P&L
    parts.push(
      `Portfolio: ${this.formatCurrency(report.summary.totalValue)} (${this.formatPercent(report.summary.totalPnLPercent)})`
    );

    // Change since last report
    if (report.changes.valueChange !== 0) {
      parts.push(
        `Change: ${this.formatCurrency(report.changes.valueChange)} (${this.formatPercent(report.changes.valueChangePercent)})`
      );
    }

    // Top gainer
    if (report.changes.topGainer) {
      parts.push(
        `Top gainer: ${report.changes.topGainer.symbol} ${this.formatPercent(report.changes.topGainer.changePercent)}`
      );
    }

    // Top loser
    if (report.changes.topLoser) {
      parts.push(
        `Top loser: ${report.changes.topLoser.symbol} ${this.formatPercent(report.changes.topLoser.changePercent)}`
      );
    }

    return parts.join('\n');
  }

  /**
   * Formats currency value
   * @param value Value to format
   * @returns Formatted string
   */
  private formatCurrency(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)} PLN`;
  }

  /**
   * Formats percentage value
   * @param value Percentage to format
   * @returns Formatted string
   */
  private formatPercent(value: number): string {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  }

  /**
   * Saves current portfolio state as snapshot
   * @param positions Current positions
   * @param summary Portfolio summary
   */
  private async saveSnapshot(
    positions: Position[],
    summary: { totalValue: number }
  ): Promise<void> {
    try {
      const snapshot: PortfolioSnapshot = {
        timestamp: new Date(),
        totalValue: summary.totalValue,
        positions: {},
      };

      for (const position of positions) {
        snapshot.positions[position.symbol] = {
          quantity: position.quantity,
          currentPrice: position.currentPrice,
          pnl: calculatePnL(position),
          pnlPercent: calculatePnLPercent(position),
        };
      }

      const serialized = JSON.stringify({
        ...snapshot,
        timestamp: snapshot.timestamp.toISOString(),
      });

      await this.adapter.setItem(LAST_REPORT_SNAPSHOT_KEY, serialized);
    } catch (error) {
      console.error('Failed to save portfolio snapshot:', error);
    }
  }

  /**
   * Gets last saved portfolio snapshot
   * @returns Last snapshot or null if none exists
   */
  private async getLastSnapshot(): Promise<PortfolioSnapshot | null> {
    try {
      const data = await this.adapter.getItem(LAST_REPORT_SNAPSHOT_KEY);
      if (!data) {
        return null;
      }

      const parsed = JSON.parse(data);
      return {
        ...parsed,
        timestamp: new Date(parsed.timestamp),
      };
    } catch (error) {
      console.error('Failed to get last snapshot:', error);
      return null;
    }
  }

  /**
   * Saves a report to notification history
   * @param report Portfolio report
   * @param type Notification type
   * @returns Success status
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * const report = await generator.generateReport(positions, 'daily', true);
   * await generator.saveToHistory(report, 'daily_report');
   * ```
   */
  async saveToHistory(
    report: PortfolioReport,
    type: 'daily_report' | 'weekly_report'
  ): Promise<boolean> {
    try {
      const history = await this.getHistory();

      const entry: NotificationHistoryEntry = {
        id: this.generateHistoryId(),
        sentAt: new Date(),
        type,
        report,
        opened: false,
      };

      // Add to history
      history.unshift(entry);

      // Trim to max size
      const trimmed = history.slice(0, MAX_HISTORY_ENTRIES);

      // Serialize and save
      const serialized = JSON.stringify(
        trimmed.map((item) => ({
          ...item,
          sentAt: item.sentAt.toISOString(),
          report: {
            ...item.report,
            generatedAt: item.report.generatedAt.toISOString(),
          },
        }))
      );

      await this.adapter.setItem(NOTIFICATION_HISTORY_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save to notification history:', error);
      return false;
    }
  }

  /**
   * Gets notification history
   * @param limit Maximum number of entries to return
   * @returns Array of history entries
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * const history = await generator.getHistory(10);
   * console.log(`${history.length} notifications sent`);
   * ```
   */
  async getHistory(limit?: number): Promise<NotificationHistoryEntry[]> {
    try {
      const data = await this.adapter.getItem(NOTIFICATION_HISTORY_KEY);
      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Deserialize dates
      const history = parsed.map((item) => ({
        ...item,
        sentAt: new Date(item.sentAt),
        report: {
          ...item.report,
          generatedAt: new Date(item.report.generatedAt),
        },
      }));

      return limit ? history.slice(0, limit) : history;
    } catch (error) {
      console.error('Failed to get notification history:', error);
      return [];
    }
  }

  /**
   * Marks a notification as opened
   * @param notificationId Notification ID
   * @returns Success status
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * await generator.markAsOpened('notification-123');
   * ```
   */
  async markAsOpened(notificationId: string): Promise<boolean> {
    try {
      const history = await this.getHistory();
      const index = history.findIndex((item) => item.id === notificationId);

      if (index < 0) {
        return false;
      }

      const entry = history[index];
      if (!entry) {
        return false;
      }

      entry.opened = true;
      history[index] = entry;

      // Serialize and save
      const serialized = JSON.stringify(
        history.map((item) => ({
          ...item,
          sentAt: item.sentAt.toISOString(),
          report: {
            ...item.report,
            generatedAt: item.report.generatedAt.toISOString(),
          },
        }))
      );

      await this.adapter.setItem(NOTIFICATION_HISTORY_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Failed to mark notification as opened:', error);
      return false;
    }
  }

  /**
   * Clears notification history
   * @returns Success status
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * await generator.clearHistory();
   * ```
   */
  async clearHistory(): Promise<boolean> {
    try {
      await this.adapter.removeItem(NOTIFICATION_HISTORY_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear notification history:', error);
      return false;
    }
  }

  /**
   * Clears the last snapshot
   * @returns Success status
   *
   * @example
   * ```typescript
   * const generator = new ReportGenerator();
   * await generator.clearSnapshot();
   * ```
   */
  async clearSnapshot(): Promise<boolean> {
    try {
      await this.adapter.removeItem(LAST_REPORT_SNAPSHOT_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear snapshot:', error);
      return false;
    }
  }

  /**
   * Generates a unique report ID
   * @returns Unique ID string
   */
  private generateReportId(): string {
    return `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generates a unique history entry ID
   * @returns Unique ID string
   */
  private generateHistoryId(): string {
    return `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Default report generator instance
 */
export const reportGenerator = new ReportGenerator();
