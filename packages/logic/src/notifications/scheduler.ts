import type {
  NotificationSettings,
  ScheduledNotification,
  DayOfWeek,
} from '../types/notifications';
import type { StorageAdapter } from '../storage/portfolio';

// Dynamically import platform-specific modules
let Notifications: any = null;
let Platform: any = { OS: 'web' };

try {
  // Only import on native platforms
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    Notifications = require('expo-notifications');
    Platform = require('react-native').Platform;
  }
} catch (error) {
  // Web environment - notifications not available
  console.log('Running in web environment - notifications disabled');
}

/**
 * Storage key for scheduled notifications metadata
 */
const SCHEDULED_NOTIFICATIONS_KEY = '@portfel/scheduled-notifications';

/**
 * Android notification channel ID
 */
const ANDROID_CHANNEL_ID = 'portfolio-reports';

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
 * Maps day names to JavaScript day numbers (0 = Sunday)
 */
const DAY_TO_NUMBER: Record<DayOfWeek, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Notification scheduler service
 * Handles scheduling and canceling portfolio report notifications
 */
export class NotificationScheduler {
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
    this.setupAndroidChannel();
  }

  /**
   * Sets up Android notification channel
   * Required for notifications to work on Android 8.0+
   */
  private async setupAndroidChannel(): Promise<void> {
    if (!Notifications || Platform.OS !== 'android') {
      return;
    }

    try {
      await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'Portfolio Reports',
        description: 'Daily and weekly portfolio performance reports',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB', // Blue color
        sound: 'default',
      });
    } catch (error) {
      console.error('Failed to setup Android notification channel:', error);
    }
  }

  /**
   * Requests notification permissions from the user
   * @returns True if permission granted
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * const granted = await scheduler.requestPermissions();
   * if (!granted) {
   *   Alert.alert('Notifications disabled', 'Please enable notifications in settings');
   * }
   * ```
   */
  async requestPermissions(): Promise<boolean> {
    if (!Notifications) {
      return false; // Web - notifications not available
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  /**
   * Checks if notification permissions are granted
   * @returns True if permissions granted
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * const hasPermission = await scheduler.hasPermissions();
   * ```
   */
  async hasPermissions(): Promise<boolean> {
    if (!Notifications) {
      return false; // Web - notifications not available
    }

    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
      return false;
    }
  }

  /**
   * Calculates the next trigger date for a daily notification
   * @param hour Hour (0-23)
   * @param minute Minute (0-59)
   * @returns Next trigger date
   */
  private calculateDailyTrigger(hour: number, minute: number): Date {
    const now = new Date();
    const trigger = new Date();
    trigger.setHours(hour, minute, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (trigger <= now) {
      trigger.setDate(trigger.getDate() + 1);
    }

    return trigger;
  }

  /**
   * Calculates the next trigger date for a weekly notification
   * @param dayOfWeek Day of week
   * @param hour Hour (0-23)
   * @param minute Minute (0-59)
   * @returns Next trigger date
   */
  private calculateWeeklyTrigger(
    dayOfWeek: DayOfWeek,
    hour: number,
    minute: number
  ): Date {
    const now = new Date();
    const targetDay = DAY_TO_NUMBER[dayOfWeek];
    const currentDay = now.getDay();

    const trigger = new Date();
    trigger.setHours(hour, minute, 0, 0);

    // Calculate days until target day
    let daysUntilTarget = targetDay - currentDay;

    // If target day is today but time has passed, or target is in the past
    if (daysUntilTarget < 0 || (daysUntilTarget === 0 && trigger <= now)) {
      daysUntilTarget += 7;
    }

    trigger.setDate(trigger.getDate() + daysUntilTarget);
    return trigger;
  }

  /**
   * Schedules daily notification
   * @param settings Notification settings
   * @returns Scheduled notification metadata or null on failure
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * const scheduled = await scheduler.scheduleDailyNotification(settings);
   * console.log('Next notification:', scheduled.nextTrigger);
   * ```
   */
  async scheduleDailyNotification(
    settings: NotificationSettings
  ): Promise<ScheduledNotification | null> {
    if (!Notifications) {
      return null; // Web - notifications not available
    }

    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        console.error('Notification permissions not granted');
        return null;
      }

      const nextTrigger = this.calculateDailyTrigger(
        settings.time.hour,
        settings.time.minute
      );

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Portfolio Daily Report',
          body: 'Your daily portfolio performance report is ready',
          data: { type: 'daily_report' },
          sound: 'default',
        },
        trigger: {
          channelId: Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined,
          hour: settings.time.hour,
          minute: settings.time.minute,
          repeats: true,
        },
      });

      const scheduledNotification: ScheduledNotification = {
        id: notificationId,
        type: 'daily_report',
        scheduledFor: new Date(),
        nextTrigger,
      };

      await this.saveScheduledNotification(scheduledNotification);
      return scheduledNotification;
    } catch (error) {
      console.error('Failed to schedule daily notification:', error);
      return null;
    }
  }

  /**
   * Schedules weekly notification
   * @param settings Notification settings
   * @returns Scheduled notification metadata or null on failure
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * const scheduled = await scheduler.scheduleWeeklyNotification(settings);
   * console.log('Next notification:', scheduled.nextTrigger);
   * ```
   */
  async scheduleWeeklyNotification(
    settings: NotificationSettings
  ): Promise<ScheduledNotification | null> {
    if (!Notifications) {
      return null; // Web - notifications not available
    }

    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        console.error('Notification permissions not granted');
        return null;
      }

      if (!settings.weeklyDay) {
        console.error('Weekly day not specified');
        return null;
      }

      const nextTrigger = this.calculateWeeklyTrigger(
        settings.weeklyDay,
        settings.time.hour,
        settings.time.minute
      );

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Portfolio Weekly Report',
          body: 'Your weekly portfolio performance report is ready',
          data: { type: 'weekly_report' },
          sound: 'default',
        },
        trigger: {
          channelId: Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined,
          weekday: DAY_TO_NUMBER[settings.weeklyDay] + 1, // expo-notifications uses 1-7
          hour: settings.time.hour,
          minute: settings.time.minute,
          repeats: true,
        },
      });

      const scheduledNotification: ScheduledNotification = {
        id: notificationId,
        type: 'weekly_report',
        scheduledFor: new Date(),
        nextTrigger,
      };

      await this.saveScheduledNotification(scheduledNotification);
      return scheduledNotification;
    } catch (error) {
      console.error('Failed to schedule weekly notification:', error);
      return null;
    }
  }

  /**
   * Schedules notifications based on settings
   * Cancels existing notifications and schedules new ones
   * @param settings Notification settings
   * @returns Success status
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * await scheduler.scheduleNotifications(settings);
   * ```
   */
  async scheduleNotifications(settings: NotificationSettings): Promise<boolean> {
    try {
      // Cancel all existing notifications first
      await this.cancelAllNotifications();

      // Don't schedule if notifications are disabled
      if (!settings.enabled || settings.frequency === 'off') {
        return true;
      }

      // Schedule based on frequency
      if (settings.frequency === 'daily') {
        const result = await this.scheduleDailyNotification(settings);
        return result !== null;
      } else if (settings.frequency === 'weekly') {
        const result = await this.scheduleWeeklyNotification(settings);
        return result !== null;
      }

      return true;
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
      return false;
    }
  }

  /**
   * Cancels all scheduled notifications
   * @returns Success status
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * await scheduler.cancelAllNotifications();
   * ```
   */
  async cancelAllNotifications(): Promise<boolean> {
    if (!Notifications) {
      return true; // Web - nothing to cancel
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await this.clearScheduledNotifications();
      return true;
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
      return false;
    }
  }

  /**
   * Cancels a specific notification by ID
   * @param notificationId Notification ID to cancel
   * @returns Success status
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * await scheduler.cancelNotification('notification-id');
   * ```
   */
  async cancelNotification(notificationId: string): Promise<boolean> {
    if (!Notifications) {
      return true; // Web - nothing to cancel
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      return true;
    } catch (error) {
      console.error('Failed to cancel notification:', error);
      return false;
    }
  }

  /**
   * Gets all currently scheduled notifications
   * @returns Array of scheduled notifications
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * const notifications = await scheduler.getScheduledNotifications();
   * console.log(`${notifications.length} notifications scheduled`);
   * ```
   */
  async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    try {
      const data = await this.adapter.getItem(SCHEDULED_NOTIFICATIONS_KEY);
      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Deserialize dates
      return parsed.map((item) => ({
        ...item,
        scheduledFor: new Date(item.scheduledFor),
        nextTrigger: new Date(item.nextTrigger),
      }));
    } catch (error) {
      console.error('Failed to get scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Saves scheduled notification metadata to storage
   * @param notification Scheduled notification to save
   */
  private async saveScheduledNotification(
    notification: ScheduledNotification
  ): Promise<void> {
    try {
      const existing = await this.getScheduledNotifications();
      const updated = [...existing, notification];

      // Serialize dates
      const serialized = updated.map((item) => ({
        ...item,
        scheduledFor: item.scheduledFor.toISOString(),
        nextTrigger: item.nextTrigger.toISOString(),
      }));

      await this.adapter.setItem(
        SCHEDULED_NOTIFICATIONS_KEY,
        JSON.stringify(serialized)
      );
    } catch (error) {
      console.error('Failed to save scheduled notification:', error);
    }
  }

  /**
   * Clears all scheduled notification metadata from storage
   */
  private async clearScheduledNotifications(): Promise<void> {
    try {
      await this.adapter.removeItem(SCHEDULED_NOTIFICATIONS_KEY);
    } catch (error) {
      console.error('Failed to clear scheduled notifications:', error);
    }
  }

  /**
   * Sends an immediate test notification
   * @returns Success status
   *
   * @example
   * ```typescript
   * const scheduler = new NotificationScheduler();
   * await scheduler.sendTestNotification();
   * ```
   */
  async sendTestNotification(): Promise<boolean> {
    if (!Notifications) {
      return false; // Web - notifications not available
    }

    try {
      const hasPermission = await this.hasPermissions();
      if (!hasPermission) {
        console.error('Notification permissions not granted');
        return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from Portfel GPW Advisor',
          data: { type: 'test' },
          sound: 'default',
        },
        trigger: {
          channelId: Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined,
          seconds: 1,
        },
      });

      return true;
    } catch (error) {
      console.error('Failed to send test notification:', error);
      return false;
    }
  }
}

/**
 * Default notification scheduler instance
 */
export const notificationScheduler = new NotificationScheduler();
