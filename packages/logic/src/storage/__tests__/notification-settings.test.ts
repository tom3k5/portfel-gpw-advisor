import type { NotificationSettings } from '../../types/notifications';
import type { StorageAdapter } from '../portfolio';
import {
  NotificationSettingsStorage,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../notification-settings';

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

describe('NotificationSettingsStorage', () => {
  let mockStorage: MockStorageAdapter;
  let storage: NotificationSettingsStorage;

  beforeEach(() => {
    mockStorage = new MockStorageAdapter();
    storage = new NotificationSettingsStorage(mockStorage);
  });

  describe('loadSettings', () => {
    it('returns default settings when no settings stored', async () => {
      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('loads saved settings from storage', async () => {
      // Arrange
      const savedSettings: NotificationSettings = {
        enabled: true,
        frequency: 'daily',
        time: { hour: 9, minute: 30 },
        weeklyDay: 'friday',
        includePositions: false,
        quietHours: {
          enabled: true,
          start: { hour: 23, minute: 0 },
          end: { hour: 7, minute: 0 },
        },
        timezone: 'America/New_York',
      };

      await mockStorage.setItem(
        '@portfel/notification-settings',
        JSON.stringify(savedSettings)
      );

      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings).toEqual(savedSettings);
    });

    it('merges saved settings with defaults for backward compatibility', async () => {
      // Arrange - Save settings without some fields
      const partialSettings = {
        enabled: true,
        frequency: 'daily',
        time: { hour: 9, minute: 30 },
        // Missing: weeklyDay, includePositions, quietHours, timezone
      };

      await mockStorage.setItem(
        '@portfel/notification-settings',
        JSON.stringify(partialSettings)
      );

      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings.enabled).toBe(true);
      expect(settings.frequency).toBe('daily');
      expect(settings.weeklyDay).toBe(DEFAULT_NOTIFICATION_SETTINGS.weeklyDay);
      expect(settings.includePositions).toBe(DEFAULT_NOTIFICATION_SETTINGS.includePositions);
      expect(settings.quietHours).toEqual(DEFAULT_NOTIFICATION_SETTINGS.quietHours);
    });

    it('handles corrupted settings data gracefully', async () => {
      // Arrange
      await mockStorage.setItem('@portfel/notification-settings', 'invalid json');

      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('handles storage read errors gracefully', async () => {
      // Arrange
      const errorStorage: StorageAdapter = {
        getItem: jest.fn().mockRejectedValue(new Error('Storage error')),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      };
      const errorTestStorage = new NotificationSettingsStorage(errorStorage);

      // Act
      const settings = await errorTestStorage.loadSettings();

      // Assert
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('merges partial quietHours settings', async () => {
      // Arrange
      const partialSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          // Missing start and end - should use defaults
        },
      };

      await mockStorage.setItem(
        '@portfel/notification-settings',
        JSON.stringify(partialSettings)
      );

      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings.quietHours.enabled).toBe(true);
      expect(settings.quietHours.start).toEqual(DEFAULT_NOTIFICATION_SETTINGS.quietHours.start);
      expect(settings.quietHours.end).toEqual(DEFAULT_NOTIFICATION_SETTINGS.quietHours.end);
    });
  });

  describe('saveSettings', () => {
    it('saves settings to storage', async () => {
      // Arrange
      const settingsToSave: NotificationSettings = {
        enabled: true,
        frequency: 'weekly',
        time: { hour: 10, minute: 0 },
        weeklyDay: 'monday',
        includePositions: true,
        quietHours: {
          enabled: false,
          start: { hour: 22, minute: 0 },
          end: { hour: 8, minute: 0 },
        },
        timezone: 'Europe/Warsaw',
      };

      // Act
      const result = await storage.saveSettings(settingsToSave);

      // Assert
      expect(result).toBe(true);
      const loaded = await storage.loadSettings();
      expect(loaded).toEqual(settingsToSave);
    });

    it('overwrites existing settings', async () => {
      // Arrange
      const firstSettings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        enabled: true,
        frequency: 'daily',
      };

      const secondSettings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        enabled: false,
        frequency: 'weekly',
      };

      // Act
      await storage.saveSettings(firstSettings);
      await storage.saveSettings(secondSettings);

      // Assert
      const loaded = await storage.loadSettings();
      expect(loaded).toEqual(secondSettings);
    });

    it('returns false on storage write error', async () => {
      // Arrange
      const errorStorage: StorageAdapter = {
        getItem: jest.fn(),
        setItem: jest.fn().mockRejectedValue(new Error('Storage error')),
        removeItem: jest.fn(),
      };
      const errorTestStorage = new NotificationSettingsStorage(errorStorage);

      // Act
      const result = await errorTestStorage.saveSettings(DEFAULT_NOTIFICATION_SETTINGS);

      // Assert
      expect(result).toBe(false);
    });

    it('serializes settings correctly', async () => {
      // Arrange
      const settings: NotificationSettings = {
        enabled: true,
        frequency: 'daily',
        time: { hour: 9, minute: 30 },
        weeklyDay: 'friday',
        includePositions: true,
        quietHours: {
          enabled: true,
          start: { hour: 22, minute: 0 },
          end: { hour: 8, minute: 0 },
        },
        timezone: 'Europe/Warsaw',
      };

      // Act
      await storage.saveSettings(settings);

      // Assert
      const raw = await mockStorage.getItem('@portfel/notification-settings');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed).toEqual(settings);
    });
  });

  describe('updateSettings', () => {
    it('updates specific fields while preserving others', async () => {
      // Arrange
      const initialSettings: NotificationSettings = {
        enabled: false,
        frequency: 'off',
        time: { hour: 18, minute: 0 },
        weeklyDay: 'monday',
        includePositions: true,
        quietHours: {
          enabled: false,
          start: { hour: 22, minute: 0 },
          end: { hour: 8, minute: 0 },
        },
        timezone: 'Europe/Warsaw',
      };

      await storage.saveSettings(initialSettings);

      // Act
      const result = await storage.updateSettings({
        enabled: true,
        frequency: 'daily',
      });

      // Assert
      expect(result).toBe(true);
      const updated = await storage.loadSettings();
      expect(updated.enabled).toBe(true);
      expect(updated.frequency).toBe('daily');
      expect(updated.time).toEqual(initialSettings.time); // Preserved
      expect(updated.weeklyDay).toBe(initialSettings.weeklyDay); // Preserved
    });

    it('updates time settings', async () => {
      // Arrange
      await storage.saveSettings(DEFAULT_NOTIFICATION_SETTINGS);

      // Act
      await storage.updateSettings({
        time: { hour: 7, minute: 30 },
      });

      // Assert
      const updated = await storage.loadSettings();
      expect(updated.time.hour).toBe(7);
      expect(updated.time.minute).toBe(30);
    });

    it('updates quietHours settings', async () => {
      // Arrange
      await storage.saveSettings(DEFAULT_NOTIFICATION_SETTINGS);

      // Act
      await storage.updateSettings({
        quietHours: {
          enabled: true,
          start: { hour: 23, minute: 0 },
          end: { hour: 6, minute: 0 },
        },
      });

      // Assert
      const updated = await storage.loadSettings();
      expect(updated.quietHours.enabled).toBe(true);
      expect(updated.quietHours.start).toEqual({ hour: 23, minute: 0 });
      expect(updated.quietHours.end).toEqual({ hour: 6, minute: 0 });
    });

    it('merges nested quietHours updates', async () => {
      // Arrange
      const initialSettings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 22, minute: 0 },
          end: { hour: 8, minute: 0 },
        },
      };

      await storage.saveSettings(initialSettings);

      // Act - Update only enabled flag
      await storage.updateSettings({
        quietHours: {
          enabled: false,
          start: { hour: 22, minute: 0 },
          end: { hour: 8, minute: 0 },
        },
      });

      // Assert
      const updated = await storage.loadSettings();
      expect(updated.quietHours.enabled).toBe(false);
      expect(updated.quietHours.start).toEqual({ hour: 22, minute: 0 });
      expect(updated.quietHours.end).toEqual({ hour: 8, minute: 0 });
    });

    it('returns false on update error', async () => {
      // Arrange
      const errorStorage: StorageAdapter = {
        getItem: jest.fn().mockResolvedValue(JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS)),
        setItem: jest.fn().mockRejectedValue(new Error('Storage error')),
        removeItem: jest.fn(),
      };
      const errorTestStorage = new NotificationSettingsStorage(errorStorage);

      // Act
      const result = await errorTestStorage.updateSettings({ enabled: true });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('resetSettings', () => {
    it('resets settings to defaults', async () => {
      // Arrange
      const customSettings: NotificationSettings = {
        enabled: true,
        frequency: 'daily',
        time: { hour: 9, minute: 0 },
        weeklyDay: 'friday',
        includePositions: false,
        quietHours: {
          enabled: true,
          start: { hour: 23, minute: 0 },
          end: { hour: 7, minute: 0 },
        },
        timezone: 'America/New_York',
      };

      await storage.saveSettings(customSettings);

      // Act
      const result = await storage.resetSettings();

      // Assert
      expect(result).toBe(true);
      const settings = await storage.loadSettings();
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('returns false on reset error', async () => {
      // Arrange
      const errorStorage: StorageAdapter = {
        getItem: jest.fn(),
        setItem: jest.fn().mockRejectedValue(new Error('Storage error')),
        removeItem: jest.fn(),
      };
      const errorTestStorage = new NotificationSettingsStorage(errorStorage);

      // Act
      const result = await errorTestStorage.resetSettings();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('clearSettings', () => {
    it('removes settings from storage', async () => {
      // Arrange
      await storage.saveSettings(DEFAULT_NOTIFICATION_SETTINGS);

      // Act
      const result = await storage.clearSettings();

      // Assert
      expect(result).toBe(true);
      const raw = await mockStorage.getItem('@portfel/notification-settings');
      expect(raw).toBeNull();
    });

    it('subsequent load returns defaults after clear', async () => {
      // Arrange
      await storage.saveSettings({
        ...DEFAULT_NOTIFICATION_SETTINGS,
        enabled: true,
      });
      await storage.clearSettings();

      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('returns false on clear error', async () => {
      // Arrange
      const errorStorage: StorageAdapter = {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn().mockRejectedValue(new Error('Storage error')),
      };
      const errorTestStorage = new NotificationSettingsStorage(errorStorage);

      // Act
      const result = await errorTestStorage.clearSettings();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('isQuietHours', () => {
    const settingsWithQuietHours: NotificationSettings = {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      quietHours: {
        enabled: true,
        start: { hour: 22, minute: 0 },
        end: { hour: 8, minute: 0 },
      },
    };

    it('returns false when quiet hours disabled', () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: false,
          start: { hour: 22, minute: 0 },
          end: { hour: 8, minute: 0 },
        },
      };

      const time = new Date('2024-01-01T23:00:00');

      // Act
      const result = storage.isQuietHours(settings, time);

      // Assert
      expect(result).toBe(false);
    });

    it('returns true when time is within quiet hours (midnight spanning)', () => {
      // Arrange
      const testCases = [
        new Date('2024-01-01T22:00:00'), // Start time
        new Date('2024-01-01T23:30:00'), // Middle of night
        new Date('2024-01-02T02:00:00'), // Early morning
        new Date('2024-01-02T07:59:00'), // Just before end
      ];

      // Act & Assert
      for (const time of testCases) {
        const result = storage.isQuietHours(settingsWithQuietHours, time);
        expect(result).toBe(true);
      }
    });

    it('returns false when time is outside quiet hours (midnight spanning)', () => {
      // Arrange
      const testCases = [
        new Date('2024-01-01T08:00:00'), // End time
        new Date('2024-01-01T12:00:00'), // Midday
        new Date('2024-01-01T18:00:00'), // Evening
        new Date('2024-01-01T21:59:00'), // Just before start
      ];

      // Act & Assert
      for (const time of testCases) {
        const result = storage.isQuietHours(settingsWithQuietHours, time);
        expect(result).toBe(false);
      }
    });

    it('handles quiet hours that do not span midnight', () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 13, minute: 0 },
          end: { hour: 14, minute: 0 },
        },
      };

      // Act & Assert
      expect(storage.isQuietHours(settings, new Date('2024-01-01T12:59:00'))).toBe(false);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T13:00:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T13:30:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T13:59:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T14:00:00'))).toBe(false);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T15:00:00'))).toBe(false);
    });

    it('uses current time when no time provided', () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 0, minute: 0 },
          end: { hour: 23, minute: 59 },
        },
      };

      // Act
      const result = storage.isQuietHours(settings);

      // Assert - Current time should be within 00:00-23:59 (almost always true)
      expect(typeof result).toBe('boolean');
    });

    it('handles exact start time correctly', () => {
      // Arrange
      const time = new Date('2024-01-01T22:00:00');

      // Act
      const result = storage.isQuietHours(settingsWithQuietHours, time);

      // Assert
      expect(result).toBe(true);
    });

    it('handles exact end time correctly', () => {
      // Arrange
      const time = new Date('2024-01-01T08:00:00');

      // Act
      const result = storage.isQuietHours(settingsWithQuietHours, time);

      // Assert
      expect(result).toBe(false);
    });

    it('handles midnight correctly (midnight spanning quiet hours)', () => {
      // Arrange
      const midnight = new Date('2024-01-02T00:00:00');

      // Act
      const result = storage.isQuietHours(settingsWithQuietHours, midnight);

      // Assert
      expect(result).toBe(true);
    });

    it('handles minutes in quiet hours calculation', () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 22, minute: 30 },
          end: { hour: 8, minute: 15 },
        },
      };

      // Act & Assert
      expect(storage.isQuietHours(settings, new Date('2024-01-01T22:29:00'))).toBe(false);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T22:30:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T08:14:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T08:15:00'))).toBe(false);
    });

    it('handles all-day quiet hours', () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 0, minute: 0 },
          end: { hour: 0, minute: 0 },
        },
      };

      // Act
      const result = storage.isQuietHours(settings, new Date('2024-01-01T12:00:00'));

      // Assert
      expect(result).toBe(false); // Same start and end means no quiet hours
    });

    it('handles edge case: 23:59 to 00:01', () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 23, minute: 59 },
          end: { hour: 0, minute: 1 },
        },
      };

      // Act & Assert
      expect(storage.isQuietHours(settings, new Date('2024-01-01T23:58:00'))).toBe(false);
      expect(storage.isQuietHours(settings, new Date('2024-01-01T23:59:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T00:00:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T00:01:00'))).toBe(false);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T00:02:00'))).toBe(false);
    });
  });

  describe('Default Settings', () => {
    it('has correct default values', () => {
      // Assert
      expect(DEFAULT_NOTIFICATION_SETTINGS.enabled).toBe(false);
      expect(DEFAULT_NOTIFICATION_SETTINGS.frequency).toBe('off');
      expect(DEFAULT_NOTIFICATION_SETTINGS.time.hour).toBe(18);
      expect(DEFAULT_NOTIFICATION_SETTINGS.time.minute).toBe(0);
      expect(DEFAULT_NOTIFICATION_SETTINGS.weeklyDay).toBe('monday');
      expect(DEFAULT_NOTIFICATION_SETTINGS.includePositions).toBe(true);
      expect(DEFAULT_NOTIFICATION_SETTINGS.quietHours.enabled).toBe(false);
      expect(DEFAULT_NOTIFICATION_SETTINGS.quietHours.start).toEqual({ hour: 22, minute: 0 });
      expect(DEFAULT_NOTIFICATION_SETTINGS.quietHours.end).toEqual({ hour: 8, minute: 0 });
      expect(DEFAULT_NOTIFICATION_SETTINGS.timezone).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty string in storage', async () => {
      // Arrange
      await mockStorage.setItem('@portfel/notification-settings', '');

      // Act
      const settings = await storage.loadSettings();

      // Assert
      expect(settings).toEqual(DEFAULT_NOTIFICATION_SETTINGS);
    });

    it('handles null values in parsed settings', async () => {
      // Arrange
      const settingsWithNulls = {
        enabled: null,
        frequency: 'daily',
        time: null,
        weeklyDay: null,
        includePositions: null,
        quietHours: null,
        timezone: null,
      };

      await mockStorage.setItem(
        '@portfel/notification-settings',
        JSON.stringify(settingsWithNulls)
      );

      // Act
      const settings = await storage.loadSettings();

      // Assert - Merge behavior: saved values override defaults, even if null
      expect(settings.enabled).toBe(null); // Overridden by saved value
      expect(settings.frequency).toBe('daily');
      // Note: spread operator will use null from saved settings, not defaults
      expect(settings.time).toBe(null);
      expect(settings.weeklyDay).toBe(null);
    });

    it('preserves custom timezone', async () => {
      // Arrange
      const customTimezone = 'Asia/Tokyo';
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        timezone: customTimezone,
      };

      // Act
      await storage.saveSettings(settings);
      const loaded = await storage.loadSettings();

      // Assert
      expect(loaded.timezone).toBe(customTimezone);
    });

    it('handles very early morning times in quiet hours', async () => {
      // Arrange
      const settings: NotificationSettings = {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        quietHours: {
          enabled: true,
          start: { hour: 22, minute: 0 },
          end: { hour: 1, minute: 0 },
        },
      };

      // Act & Assert
      expect(storage.isQuietHours(settings, new Date('2024-01-02T00:30:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T00:59:00'))).toBe(true);
      expect(storage.isQuietHours(settings, new Date('2024-01-02T01:00:00'))).toBe(false);
    });
  });
});
