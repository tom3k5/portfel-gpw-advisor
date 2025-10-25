import type { Position } from '../../types/portfolio';
import type { PortfolioReport, NotificationHistoryEntry } from '../../types/notifications';
import type { StorageAdapter } from '../../storage/portfolio';
import { ReportGenerator } from '../report-generator';

// Mock storage adapter
class MockStorageAdapter implements StorageAdapter {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}

describe('ReportGenerator', () => {
  let mockStorage: MockStorageAdapter;
  let generator: ReportGenerator;

  // Sample positions
  const samplePositions: Position[] = [
    {
      symbol: 'PKN',
      quantity: 100,
      purchasePrice: 50,
      currentPrice: 60,
      purchaseDate: new Date('2024-01-01'),
    },
    {
      symbol: 'PKO',
      quantity: 50,
      purchasePrice: 40,
      currentPrice: 35,
      purchaseDate: new Date('2024-01-01'),
    },
    {
      symbol: 'PZU',
      quantity: 200,
      purchasePrice: 30,
      currentPrice: 32,
      purchaseDate: new Date('2024-01-01'),
    },
  ];

  beforeEach(() => {
    mockStorage = new MockStorageAdapter();
    generator = new ReportGenerator(mockStorage);
  });

  describe('Report Generation', () => {
    describe('generateReport', () => {
      it('generates report with correct summary data', async () => {
        // Act
        const report = await generator.generateReport(samplePositions, 'daily', true);

        // Assert
        expect(report.id).toBeDefined();
        expect(report.generatedAt).toBeInstanceOf(Date);
        expect(report.period).toBe('daily');
        // PKN: 100 * 60 = 6000, cost: 100 * 50 = 5000
        // PKO: 50 * 35 = 1750, cost: 50 * 40 = 2000
        // PZU: 200 * 32 = 6400, cost: 200 * 30 = 6000
        expect(report.summary.totalValue).toBe(14150); // 6000 + 1750 + 6400
        expect(report.summary.totalCost).toBe(13000); // 5000 + 2000 + 6000
        expect(report.summary.totalPnL).toBe(1150); // 1000 - 250 + 400
        expect(report.summary.positionCount).toBe(3);
      });

      it('includes position details when requested', async () => {
        // Act
        const report = await generator.generateReport(samplePositions, 'daily', true);

        // Assert
        expect(report.positions).toBeDefined();
        expect(report.positions).toHaveLength(3);
        expect(report.positions?.[0]).toEqual({
          symbol: 'PKN',
          quantity: 100,
          currentPrice: 60,
          pnl: 1000,
          pnlPercent: 20,
        });
      });

      it('excludes position details when not requested', async () => {
        // Act
        const report = await generator.generateReport(samplePositions, 'daily', false);

        // Assert
        expect(report.positions).toBeUndefined();
      });

      it('generates weekly report', async () => {
        // Act
        const report = await generator.generateReport(samplePositions, 'weekly', false);

        // Assert
        expect(report.period).toBe('weekly');
      });

      it('handles empty portfolio', async () => {
        // Act
        const report = await generator.generateReport([], 'daily', true);

        // Assert
        expect(report.summary.totalValue).toBe(0);
        expect(report.summary.totalCost).toBe(0);
        expect(report.summary.totalPnL).toBe(0);
        expect(report.summary.positionCount).toBe(0);
        expect(report.positions).toEqual([]);
      });

      it('generates unique report IDs', async () => {
        // Act
        const report1 = await generator.generateReport(samplePositions, 'daily', false);
        const report2 = await generator.generateReport(samplePositions, 'daily', false);

        // Assert
        expect(report1.id).not.toBe(report2.id);
      });

      it('saves snapshot after generating report', async () => {
        // Act
        await generator.generateReport(samplePositions, 'daily', false);

        // Assert - verify snapshot was saved by checking storage
        const snapshot = await mockStorage.getItem('@portfel/last-report-snapshot');
        expect(snapshot).not.toBeNull();
        const parsed = JSON.parse(snapshot!);
        expect(parsed.totalValue).toBe(14150);
        expect(parsed.positions.PKN).toBeDefined();
      });
    });
  });

  describe('Change Calculation', () => {
    it('returns zero changes when no previous snapshot exists', async () => {
      // Act
      const report = await generator.generateReport(samplePositions, 'daily', false);

      // Assert
      expect(report.changes.valueChange).toBe(0);
      expect(report.changes.valueChangePercent).toBe(0);
      expect(report.changes.topGainer).toBeUndefined();
      expect(report.changes.topLoser).toBeUndefined();
    });

    it('calculates value change correctly', async () => {
      // Arrange - Generate first report
      await generator.generateReport(samplePositions, 'daily', false);

      // Update positions with new prices
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 65 }, // PKN: +5
        { ...samplePositions[1]!, currentPrice: 38 }, // PKO: +3
        { ...samplePositions[2]!, currentPrice: 33 }, // PZU: +1
      ];

      // Act
      const report = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert
      const expectedOldValue = 14150; // From first report
      const expectedNewValue = 15000; // 6500 + 1900 + 6600
      const expectedChange = expectedNewValue - expectedOldValue;
      const expectedChangePercent = (expectedChange / expectedOldValue) * 100;

      expect(report.changes.valueChange).toBeCloseTo(expectedChange, 2);
      expect(report.changes.valueChangePercent).toBeCloseTo(expectedChangePercent, 2);
    });

    it('identifies top gainer correctly', async () => {
      // Arrange - Generate first report
      await generator.generateReport(samplePositions, 'daily', false);

      // Update positions - PKN gains 20%
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 72 }, // PKN: +20%
        { ...samplePositions[1]!, currentPrice: 36 }, // PKO: +2.86%
        { ...samplePositions[2]!, currentPrice: 32 }, // PZU: 0%
      ];

      // Act
      const report = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert
      expect(report.changes.topGainer).toBeDefined();
      expect(report.changes.topGainer?.symbol).toBe('PKN');
      expect(report.changes.topGainer?.changePercent).toBeCloseTo(20, 2);
    });

    it('identifies top loser correctly', async () => {
      // Arrange - Generate first report
      await generator.generateReport(samplePositions, 'daily', false);

      // Update positions - PKO loses 20%
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 61 }, // PKN: +1.67%
        { ...samplePositions[1]!, currentPrice: 28 }, // PKO: -20%
        { ...samplePositions[2]!, currentPrice: 32 }, // PZU: 0%
      ];

      // Act
      const report = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert
      expect(report.changes.topLoser).toBeDefined();
      expect(report.changes.topLoser?.symbol).toBe('PKO');
      expect(report.changes.topLoser?.changePercent).toBeCloseTo(-20, 2);
    });

    it('does not include top gainer if no positive changes', async () => {
      // Arrange - Generate first report
      await generator.generateReport(samplePositions, 'daily', false);

      // Update positions - all decrease
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 58 }, // PKN: -3.33%
        { ...samplePositions[1]!, currentPrice: 33 }, // PKO: -5.71%
        { ...samplePositions[2]!, currentPrice: 31 }, // PZU: -3.13%
      ];

      // Act
      const report = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert
      expect(report.changes.topGainer).toBeUndefined();
      expect(report.changes.topLoser).toBeDefined();
    });

    it('does not include top loser if no negative changes', async () => {
      // Arrange - Generate first report
      await generator.generateReport(samplePositions, 'daily', false);

      // Update positions - all increase
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 62 }, // PKN: +3.33%
        { ...samplePositions[1]!, currentPrice: 37 }, // PKO: +5.71%
        { ...samplePositions[2]!, currentPrice: 33 }, // PZU: +3.13%
      ];

      // Act
      const report = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert
      expect(report.changes.topLoser).toBeUndefined();
      expect(report.changes.topGainer).toBeDefined();
    });

    it('ignores new positions in change calculation', async () => {
      // Arrange - Generate first report with 2 positions
      const initialPositions = samplePositions.slice(0, 2);
      await generator.generateReport(initialPositions, 'daily', false);

      // Add a new position
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 60 }, // PKN: 0%
        { ...samplePositions[1]!, currentPrice: 35 }, // PKO: 0%
        { ...samplePositions[2]!, currentPrice: 100 }, // PZU: new position
      ];

      // Act
      const report = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert - PZU should not appear in top gainer/loser
      expect(report.changes.topGainer?.symbol).not.toBe('PZU');
      expect(report.changes.topLoser?.symbol).not.toBe('PZU');
    });

    it('handles removed positions gracefully', async () => {
      // Arrange - Generate first report with all positions
      await generator.generateReport(samplePositions, 'daily', false);

      // Remove one position
      const updatedPositions = samplePositions.slice(0, 2);

      // Act & Assert - should not throw
      const report = await generator.generateReport(updatedPositions, 'daily', false);
      expect(report).toBeDefined();
    });
  });

  describe('Notification Body Formatting', () => {
    it('formats basic report information', () => {
      // Arrange
      const report: PortfolioReport = {
        id: 'test-123',
        generatedAt: new Date(),
        period: 'daily',
        summary: {
          totalValue: 10000,
          totalCost: 9000,
          totalPnL: 1000,
          totalPnLPercent: 11.11,
          positionCount: 3,
        },
        changes: {
          valueChange: 500,
          valueChangePercent: 5.26,
        },
      };

      // Act
      const body = generator.formatNotificationBody(report);

      // Assert
      expect(body).toContain('Portfolio: +10000.00 PLN (+11.11%)');
      expect(body).toContain('Change: +500.00 PLN (+5.26%)');
    });

    it('formats negative values correctly', () => {
      // Arrange
      const report: PortfolioReport = {
        id: 'test-123',
        generatedAt: new Date(),
        period: 'daily',
        summary: {
          totalValue: 9000,
          totalCost: 10000,
          totalPnL: -1000,
          totalPnLPercent: -10,
          positionCount: 3,
        },
        changes: {
          valueChange: -500,
          valueChangePercent: -5.26,
        },
      };

      // Act
      const body = generator.formatNotificationBody(report);

      // Assert
      expect(body).toContain('Portfolio: +9000.00 PLN (-10.00%)');
      expect(body).toContain('Change: -500.00 PLN (-5.26%)');
    });

    it('includes top gainer when present', () => {
      // Arrange
      const report: PortfolioReport = {
        id: 'test-123',
        generatedAt: new Date(),
        period: 'daily',
        summary: {
          totalValue: 10000,
          totalCost: 9000,
          totalPnL: 1000,
          totalPnLPercent: 11.11,
          positionCount: 3,
        },
        changes: {
          valueChange: 500,
          valueChangePercent: 5.26,
          topGainer: { symbol: 'PKN', changePercent: 15.5 },
        },
      };

      // Act
      const body = generator.formatNotificationBody(report);

      // Assert
      expect(body).toContain('Top gainer: PKN +15.50%');
    });

    it('includes top loser when present', () => {
      // Arrange
      const report: PortfolioReport = {
        id: 'test-123',
        generatedAt: new Date(),
        period: 'daily',
        summary: {
          totalValue: 10000,
          totalCost: 9000,
          totalPnL: 1000,
          totalPnLPercent: 11.11,
          positionCount: 3,
        },
        changes: {
          valueChange: 500,
          valueChangePercent: 5.26,
          topLoser: { symbol: 'PKO', changePercent: -8.3 },
        },
      };

      // Act
      const body = generator.formatNotificationBody(report);

      // Assert
      expect(body).toContain('Top loser: PKO -8.30%');
    });

    it('omits change line when no change', () => {
      // Arrange
      const report: PortfolioReport = {
        id: 'test-123',
        generatedAt: new Date(),
        period: 'daily',
        summary: {
          totalValue: 10000,
          totalCost: 10000,
          totalPnL: 0,
          totalPnLPercent: 0,
          positionCount: 3,
        },
        changes: {
          valueChange: 0,
          valueChangePercent: 0,
        },
      };

      // Act
      const body = generator.formatNotificationBody(report);

      // Assert
      expect(body).not.toContain('Change:');
      expect(body).toContain('Portfolio:');
    });

    it('formats complete report with all fields', () => {
      // Arrange
      const report: PortfolioReport = {
        id: 'test-123',
        generatedAt: new Date(),
        period: 'daily',
        summary: {
          totalValue: 10000,
          totalCost: 9000,
          totalPnL: 1000,
          totalPnLPercent: 11.11,
          positionCount: 3,
        },
        changes: {
          valueChange: 500,
          valueChangePercent: 5.26,
          topGainer: { symbol: 'PKN', changePercent: 15.5 },
          topLoser: { symbol: 'PKO', changePercent: -8.3 },
        },
      };

      // Act
      const body = generator.formatNotificationBody(report);

      // Assert
      const lines = body.split('\n');
      expect(lines).toHaveLength(4);
      expect(lines[0]).toContain('Portfolio:');
      expect(lines[1]).toContain('Change:');
      expect(lines[2]).toContain('Top gainer:');
      expect(lines[3]).toContain('Top loser:');
    });
  });

  describe('History Management', () => {
    describe('saveToHistory', () => {
      it('saves report to history', async () => {
        // Arrange
        const report = await generator.generateReport(samplePositions, 'daily', false);

        // Act
        const result = await generator.saveToHistory(report, 'daily_report');

        // Assert
        expect(result).toBe(true);
        const history = await generator.getHistory();
        expect(history).toHaveLength(1);
        expect(history[0]?.type).toBe('daily_report');
        expect(history[0]?.report.id).toBe(report.id);
      });

      it('generates unique history entry IDs', async () => {
        // Arrange
        const report1 = await generator.generateReport(samplePositions, 'daily', false);
        const report2 = await generator.generateReport(samplePositions, 'daily', false);

        // Act
        await generator.saveToHistory(report1, 'daily_report');
        await generator.saveToHistory(report2, 'daily_report');

        // Assert
        const history = await generator.getHistory();
        expect(history[0]?.id).not.toBe(history[1]?.id);
      });

      it('stores reports in reverse chronological order', async () => {
        // Arrange
        const report1 = await generator.generateReport(samplePositions, 'daily', false);
        await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay
        const report2 = await generator.generateReport(samplePositions, 'daily', false);

        // Act
        await generator.saveToHistory(report1, 'daily_report');
        await generator.saveToHistory(report2, 'weekly_report');

        // Assert
        const history = await generator.getHistory();
        expect(history[0]?.type).toBe('weekly_report'); // Most recent first
        expect(history[1]?.type).toBe('daily_report');
      });

      it('marks new entries as not opened', async () => {
        // Arrange
        const report = await generator.generateReport(samplePositions, 'daily', false);

        // Act
        await generator.saveToHistory(report, 'daily_report');

        // Assert
        const history = await generator.getHistory();
        expect(history[0]?.opened).toBe(false);
      });

      it('trims history to MAX_HISTORY_ENTRIES', async () => {
        // Arrange - Save 105 reports
        for (let i = 0; i < 105; i++) {
          const report = await generator.generateReport(samplePositions, 'daily', false);
          await generator.saveToHistory(report, 'daily_report');
        }

        // Act
        const history = await generator.getHistory();

        // Assert
        expect(history).toHaveLength(100); // MAX_HISTORY_ENTRIES
      });

      it('serializes dates correctly', async () => {
        // Arrange
        const report = await generator.generateReport(samplePositions, 'daily', false);

        // Act
        await generator.saveToHistory(report, 'daily_report');

        // Assert
        const history = await generator.getHistory();
        expect(history[0]?.sentAt).toBeInstanceOf(Date);
        expect(history[0]?.report.generatedAt).toBeInstanceOf(Date);
      });
    });

    describe('getHistory', () => {
      it('returns empty array when no history exists', async () => {
        // Act
        const history = await generator.getHistory();

        // Assert
        expect(history).toEqual([]);
      });

      it('limits results when limit specified', async () => {
        // Arrange - Save 10 reports
        for (let i = 0; i < 10; i++) {
          const report = await generator.generateReport(samplePositions, 'daily', false);
          await generator.saveToHistory(report, 'daily_report');
        }

        // Act
        const history = await generator.getHistory(5);

        // Assert
        expect(history).toHaveLength(5);
      });

      it('returns all entries when no limit specified', async () => {
        // Arrange
        for (let i = 0; i < 10; i++) {
          const report = await generator.generateReport(samplePositions, 'daily', false);
          await generator.saveToHistory(report, 'daily_report');
        }

        // Act
        const history = await generator.getHistory();

        // Assert
        expect(history).toHaveLength(10);
      });

      it('handles corrupted history data gracefully', async () => {
        // Arrange
        await mockStorage.setItem('@portfel/notification-history', 'invalid json');

        // Act
        const history = await generator.getHistory();

        // Assert
        expect(history).toEqual([]);
      });

      it('handles non-array history data gracefully', async () => {
        // Arrange
        await mockStorage.setItem(
          '@portfel/notification-history',
          JSON.stringify({ invalid: 'data' })
        );

        // Act
        const history = await generator.getHistory();

        // Assert
        expect(history).toEqual([]);
      });
    });

    describe('markAsOpened', () => {
      it('marks notification as opened', async () => {
        // Arrange
        const report = await generator.generateReport(samplePositions, 'daily', false);
        await generator.saveToHistory(report, 'daily_report');
        const history = await generator.getHistory();
        const notificationId = history[0]!.id;

        // Act
        const result = await generator.markAsOpened(notificationId);

        // Assert
        expect(result).toBe(true);
        const updatedHistory = await generator.getHistory();
        expect(updatedHistory[0]?.opened).toBe(true);
      });

      it('returns false for non-existent notification ID', async () => {
        // Act
        const result = await generator.markAsOpened('non-existent-id');

        // Assert
        expect(result).toBe(false);
      });

      it('preserves other notification states', async () => {
        // Arrange
        const report1 = await generator.generateReport(samplePositions, 'daily', false);
        const report2 = await generator.generateReport(samplePositions, 'daily', false);
        await generator.saveToHistory(report1, 'daily_report');
        await generator.saveToHistory(report2, 'daily_report');

        const history = await generator.getHistory();
        const firstId = history[0]!.id;

        // Act
        await generator.markAsOpened(firstId);

        // Assert
        const updatedHistory = await generator.getHistory();
        expect(updatedHistory[0]?.opened).toBe(true);
        expect(updatedHistory[1]?.opened).toBe(false);
      });
    });

    describe('clearHistory', () => {
      it('clears all history entries', async () => {
        // Arrange
        const report = await generator.generateReport(samplePositions, 'daily', false);
        await generator.saveToHistory(report, 'daily_report');

        // Act
        const result = await generator.clearHistory();

        // Assert
        expect(result).toBe(true);
        const history = await generator.getHistory();
        expect(history).toEqual([]);
      });

      it('returns true when history already empty', async () => {
        // Act
        const result = await generator.clearHistory();

        // Assert
        expect(result).toBe(true);
      });
    });
  });

  describe('Snapshot Management', () => {
    describe('clearSnapshot', () => {
      it('clears last snapshot', async () => {
        // Arrange
        await generator.generateReport(samplePositions, 'daily', false);

        // Act
        const result = await generator.clearSnapshot();

        // Assert
        expect(result).toBe(true);
        const snapshot = await mockStorage.getItem('@portfel/last-report-snapshot');
        expect(snapshot).toBeNull();
      });

      it('returns true when snapshot already empty', async () => {
        // Act
        const result = await generator.clearSnapshot();

        // Assert
        expect(result).toBe(true);
      });
    });

    it('uses last snapshot for change calculation', async () => {
      // Arrange - Generate first report
      const firstReport = await generator.generateReport(samplePositions, 'daily', false);
      expect(firstReport.changes.valueChange).toBe(0);

      // Update prices
      const updatedPositions: Position[] = [
        { ...samplePositions[0]!, currentPrice: 70 }, // Significant increase
        { ...samplePositions[1]!, currentPrice: 35 },
        { ...samplePositions[2]!, currentPrice: 32 },
      ];

      // Act
      const secondReport = await generator.generateReport(updatedPositions, 'daily', false);

      // Assert
      expect(secondReport.changes.valueChange).not.toBe(0);
      expect(secondReport.changes.valueChangePercent).toBeGreaterThan(0);
    });

    it('handles corrupted snapshot gracefully', async () => {
      // Arrange
      await mockStorage.setItem('@portfel/last-report-snapshot', 'invalid json');

      // Act & Assert - should not throw
      const report = await generator.generateReport(samplePositions, 'daily', false);
      expect(report.changes.valueChange).toBe(0); // No previous snapshot
    });
  });

  describe('Edge Cases', () => {
    it('handles zero total value in change calculation', async () => {
      // Arrange - Generate first report with empty portfolio
      await generator.generateReport([], 'daily', false);

      // Act
      const report = await generator.generateReport(samplePositions, 'daily', false);

      // Assert
      expect(report.changes.valueChangePercent).toBe(0);
    });

    it('handles positions with zero current price', async () => {
      // Arrange
      const edgePositions: Position[] = [
        {
          symbol: 'ZERO',
          quantity: 100,
          purchasePrice: 50,
          currentPrice: 0,
          purchaseDate: new Date(),
        },
      ];

      // Act
      const report = await generator.generateReport(edgePositions, 'daily', false);

      // Assert
      expect(report.summary.totalValue).toBe(0);
    });

    it('handles very large portfolio values', async () => {
      // Arrange
      const largePositions: Position[] = [
        {
          symbol: 'LARGE',
          quantity: 1000000,
          purchasePrice: 1000,
          currentPrice: 1100,
          purchaseDate: new Date(),
        },
      ];

      // Act
      const report = await generator.generateReport(largePositions, 'daily', false);

      // Assert
      expect(report.summary.totalValue).toBe(1100000000);
      expect(report.summary.totalPnL).toBe(100000000);
    });

    it('handles decimal prices correctly', async () => {
      // Arrange
      const decimalPositions: Position[] = [
        {
          symbol: 'DECIMAL',
          quantity: 100,
          purchasePrice: 10.55,
          currentPrice: 11.33,
          purchaseDate: new Date(),
        },
      ];

      // Act
      const report = await generator.generateReport(decimalPositions, 'daily', false);

      // Assert
      expect(report.summary.totalValue).toBeCloseTo(1133, 2);
      expect(report.summary.totalCost).toBeCloseTo(1055, 2);
    });
  });
});
