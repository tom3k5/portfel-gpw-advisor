import type { NotificationSettings } from '../types/notifications';
import type { StorageAdapter } from './portfolio';

/**
 * Storage key for notification settings
 */
const NOTIFICATION_SETTINGS_KEY = '@portfel/notification-settings';

/**
 * Default notification settings
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  frequency: 'off',
  time: {
    hour: 18,
    minute: 0,
  },
  weeklyDay: 'monday',
  includePositions: true,
  quietHours: {
    enabled: false,
    start: {
      hour: 22,
      minute: 0,
    },
    end: {
      hour: 8,
      minute: 0,
    },
  },
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

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
 * Notification settings storage manager
 * Handles persistence of user notification preferences
 */
export class NotificationSettingsStorage {
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
  }

  /**
   * Serializes notification settings for storage
   * Ensures dates and complex objects are properly serialized
   */
  private serializeSettings(settings: NotificationSettings): string {
    return JSON.stringify(settings);
  }

  /**
   * Deserializes notification settings from storage
   */
  private deserializeSettings(data: string): NotificationSettings {
    return JSON.parse(data);
  }

  /**
   * Loads notification settings from storage
   * @returns Notification settings or default settings if none found
   *
   * @example
   * ```typescript
   * const storage = new NotificationSettingsStorage();
   * const settings = await storage.loadSettings();
   * console.log(settings.enabled); // false (default)
   * ```
   */
  async loadSettings(): Promise<NotificationSettings> {
    try {
      const data = await this.adapter.getItem(NOTIFICATION_SETTINGS_KEY);
      if (!data) {
        return DEFAULT_NOTIFICATION_SETTINGS;
      }

      const parsed = this.deserializeSettings(data);

      // Merge with defaults to handle new fields added in updates
      return {
        ...DEFAULT_NOTIFICATION_SETTINGS,
        ...parsed,
        quietHours: {
          ...DEFAULT_NOTIFICATION_SETTINGS.quietHours,
          ...(parsed.quietHours || {}),
        },
      };
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  }

  /**
   * Saves notification settings to storage
   * @param settings Notification settings to save
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new NotificationSettingsStorage();
   * await storage.saveSettings({
   *   ...settings,
   *   enabled: true,
   *   frequency: 'daily'
   * });
   * ```
   */
  async saveSettings(settings: NotificationSettings): Promise<boolean> {
    try {
      const serialized = this.serializeSettings(settings);
      await this.adapter.setItem(NOTIFICATION_SETTINGS_KEY, serialized);
      return true;
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      return false;
    }
  }

  /**
   * Updates specific notification settings fields
   * @param updates Partial settings to update
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new NotificationSettingsStorage();
   * await storage.updateSettings({
   *   enabled: true,
   *   frequency: 'weekly',
   *   weeklyDay: 'friday'
   * });
   * ```
   */
  async updateSettings(
    updates: Partial<NotificationSettings>
  ): Promise<boolean> {
    try {
      const current = await this.loadSettings();
      const updated: NotificationSettings = {
        ...current,
        ...updates,
        // Handle nested quietHours updates
        quietHours: updates.quietHours
          ? { ...current.quietHours, ...updates.quietHours }
          : current.quietHours,
      };
      return await this.saveSettings(updated);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      return false;
    }
  }

  /**
   * Resets notification settings to defaults
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new NotificationSettingsStorage();
   * await storage.resetSettings();
   * ```
   */
  async resetSettings(): Promise<boolean> {
    try {
      return await this.saveSettings(DEFAULT_NOTIFICATION_SETTINGS);
    } catch (error) {
      console.error('Failed to reset notification settings:', error);
      return false;
    }
  }

  /**
   * Clears notification settings from storage
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new NotificationSettingsStorage();
   * await storage.clearSettings();
   * ```
   */
  async clearSettings(): Promise<boolean> {
    try {
      await this.adapter.removeItem(NOTIFICATION_SETTINGS_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear notification settings:', error);
      return false;
    }
  }

  /**
   * Checks if current time is within quiet hours
   * @param settings Notification settings to check against
   * @param currentTime Optional time to check (defaults to now)
   * @returns True if within quiet hours
   *
   * @example
   * ```typescript
   * const storage = new NotificationSettingsStorage();
   * const settings = await storage.loadSettings();
   * if (storage.isQuietHours(settings)) {
   *   console.log('Skipping notification - quiet hours active');
   * }
   * ```
   */
  isQuietHours(settings: NotificationSettings, currentTime?: Date): boolean {
    if (!settings.quietHours.enabled) {
      return false;
    }

    const now = currentTime || new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const { start, end } = settings.quietHours;
    const startMinutes = start.hour * 60 + start.minute;
    const endMinutes = end.hour * 60 + end.minute;

    // Handle quiet hours that span midnight
    if (startMinutes > endMinutes) {
      // e.g., 22:00 to 08:00
      return currentTotalMinutes >= startMinutes || currentTotalMinutes < endMinutes;
    } else {
      // e.g., 01:00 to 05:00
      return currentTotalMinutes >= startMinutes && currentTotalMinutes < endMinutes;
    }
  }
}

/**
 * Default notification settings storage instance
 */
export const notificationSettingsStorage = new NotificationSettingsStorage();
