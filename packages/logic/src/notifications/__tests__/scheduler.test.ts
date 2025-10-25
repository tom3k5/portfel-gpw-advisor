import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { NotificationSettings, ScheduledNotification } from '../../types/notifications';
import type { StorageAdapter } from '../../storage/portfolio';
import { NotificationScheduler } from '../scheduler';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {
    DEFAULT: 3,
  },
}));

// Mock react-native Platform
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

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

describe('NotificationScheduler', () => {
  let mockStorage: MockStorageAdapter;
  let scheduler: NotificationScheduler;

  // Default notification settings
  const defaultSettings: NotificationSettings = {
    enabled: true,
    frequency: 'daily',
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

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create fresh storage and scheduler
    mockStorage = new MockStorageAdapter();
    scheduler = new NotificationScheduler(mockStorage);

    // Reset Platform.OS to iOS
    (Platform.OS as any) = 'ios';
  });

  describe('Permission Handling', () => {
    describe('requestPermissions', () => {
      it('returns true when permission already granted', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'granted',
        });

        // Act
        const result = await scheduler.requestPermissions();

        // Assert
        expect(result).toBe(true);
        expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
        expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
      });

      it('requests permission when not granted and returns true if granted', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'undetermined',
        });
        (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'granted',
        });

        // Act
        const result = await scheduler.requestPermissions();

        // Assert
        expect(result).toBe(true);
        expect(Notifications.getPermissionsAsync).toHaveBeenCalledTimes(1);
        expect(Notifications.requestPermissionsAsync).toHaveBeenCalledTimes(1);
      });

      it('returns false when permission denied', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'undetermined',
        });
        (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'denied',
        });

        // Act
        const result = await scheduler.requestPermissions();

        // Assert
        expect(result).toBe(false);
      });

      it('returns false when permission request fails', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
          new Error('Permission error')
        );

        // Act
        const result = await scheduler.requestPermissions();

        // Assert
        expect(result).toBe(false);
      });
    });

    describe('hasPermissions', () => {
      it('returns true when permission granted', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'granted',
        });

        // Act
        const result = await scheduler.hasPermissions();

        // Assert
        expect(result).toBe(true);
      });

      it('returns false when permission denied', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
          status: 'denied',
        });

        // Act
        const result = await scheduler.hasPermissions();

        // Assert
        expect(result).toBe(false);
      });

      it('returns false when check fails', async () => {
        // Arrange
        (Notifications.getPermissionsAsync as jest.Mock).mockRejectedValue(
          new Error('Check failed')
        );

        // Act
        const result = await scheduler.hasPermissions();

        // Assert
        expect(result).toBe(false);
      });
    });
  });

  describe('Android Channel Setup', () => {
    it('creates notification channel on Android', async () => {
      // Arrange
      (Platform.OS as any) = 'android';

      // Create new scheduler to trigger setupAndroidChannel
      const androidScheduler = new NotificationScheduler(mockStorage);

      // Wait for async channel setup
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        'portfolio-reports',
        expect.objectContaining({
          name: 'Portfolio Reports',
          description: 'Daily and weekly portfolio performance reports',
          importance: Notifications.AndroidImportance.DEFAULT,
        })
      );
    });

    it('does not create notification channel on iOS', async () => {
      // Arrange
      (Platform.OS as any) = 'ios';
      jest.clearAllMocks(); // Clear any previous calls

      // Create new scheduler
      const iosScheduler = new NotificationScheduler(mockStorage);

      // Wait for async channel setup
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert
      expect(Notifications.setNotificationChannelAsync).not.toHaveBeenCalled();
    });

    it('handles channel creation error gracefully', async () => {
      // Arrange
      (Platform.OS as any) = 'android';
      (Notifications.setNotificationChannelAsync as jest.Mock).mockRejectedValue(
        new Error('Channel error')
      );

      // Act & Assert - should not throw
      expect(() => new NotificationScheduler(mockStorage)).not.toThrow();
    });
  });

  describe('Daily Notification Scheduling', () => {
    beforeEach(() => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
    });

    it('schedules daily notification successfully', async () => {
      // Arrange
      const mockNotificationId = 'notification-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      // Act
      const result = await scheduler.scheduleDailyNotification(defaultSettings);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(mockNotificationId);
      expect(result?.type).toBe('daily_report');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Portfolio Daily Report',
            data: { type: 'daily_report' },
          }),
          trigger: expect.objectContaining({
            hour: 18,
            minute: 0,
            repeats: true,
          }),
        })
      );
    });

    it('includes next trigger date in result', async () => {
      // Arrange
      const mockNotificationId = 'notification-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      const settings: NotificationSettings = {
        ...defaultSettings,
        time: { hour: 18, minute: 0 },
      };

      // Act
      const result = await scheduler.scheduleDailyNotification(settings);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.nextTrigger).toBeInstanceOf(Date);
      expect(result?.nextTrigger.getHours()).toBe(18);
      expect(result?.nextTrigger.getMinutes()).toBe(0);
    });

    it('includes Android channel ID on Android platform', async () => {
      // Arrange
      (Platform.OS as any) = 'android';
      const mockNotificationId = 'notification-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      // Act
      await scheduler.scheduleDailyNotification(defaultSettings);

      // Assert
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            channelId: 'portfolio-reports',
          }),
        })
      );
    });

    it('excludes channel ID on iOS platform', async () => {
      // Arrange
      (Platform.OS as any) = 'ios';
      const mockNotificationId = 'notification-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      // Act
      await scheduler.scheduleDailyNotification(defaultSettings);

      // Assert
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          trigger: expect.objectContaining({
            channelId: undefined,
          }),
        })
      );
    });

    it('returns null when permissions not granted', async () => {
      // Arrange
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      // Act
      const result = await scheduler.scheduleDailyNotification(defaultSettings);

      // Assert
      expect(result).toBeNull();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('returns null when scheduling fails', async () => {
      // Arrange
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Scheduling failed')
      );

      // Act
      const result = await scheduler.scheduleDailyNotification(defaultSettings);

      // Assert
      expect(result).toBeNull();
    });

    it('saves scheduled notification to storage', async () => {
      // Arrange
      const mockNotificationId = 'notification-123';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      // Act
      await scheduler.scheduleDailyNotification(defaultSettings);

      // Assert
      const scheduled = await scheduler.getScheduledNotifications();
      expect(scheduled).toHaveLength(1);
      expect(scheduled[0]?.id).toBe(mockNotificationId);
      expect(scheduled[0]?.type).toBe('daily_report');
    });
  });

  describe('Weekly Notification Scheduling', () => {
    beforeEach(() => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
    });

    it('schedules weekly notification successfully', async () => {
      // Arrange
      const mockNotificationId = 'notification-456';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      // Act
      const result = await scheduler.scheduleWeeklyNotification(defaultSettings);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(mockNotificationId);
      expect(result?.type).toBe('weekly_report');
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Portfolio Weekly Report',
            data: { type: 'weekly_report' },
          }),
          trigger: expect.objectContaining({
            weekday: 2, // Monday = 1 in JS (0-6), expo uses 1-7
            hour: 18,
            minute: 0,
            repeats: true,
          }),
        })
      );
    });

    it('returns null when weeklyDay not specified', async () => {
      // Arrange
      const settings: NotificationSettings = {
        ...defaultSettings,
        weeklyDay: undefined,
      };

      // Act
      const result = await scheduler.scheduleWeeklyNotification(settings);

      // Assert
      expect(result).toBeNull();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('calculates correct weekday number for all days', async () => {
      // Arrange
      const mockNotificationId = 'notification-456';
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        mockNotificationId
      );

      const daysMap = {
        sunday: 1,
        monday: 2,
        tuesday: 3,
        wednesday: 4,
        thursday: 5,
        friday: 6,
        saturday: 7,
      };

      // Act & Assert
      for (const [day, expectedWeekday] of Object.entries(daysMap)) {
        jest.clearAllMocks();
        const settings: NotificationSettings = {
          ...defaultSettings,
          weeklyDay: day as any,
        };

        await scheduler.scheduleWeeklyNotification(settings);

        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            trigger: expect.objectContaining({
              weekday: expectedWeekday,
            }),
          })
        );
      }
    });

    it('returns null when permissions not granted', async () => {
      // Arrange
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      // Act
      const result = await scheduler.scheduleWeeklyNotification(defaultSettings);

      // Assert
      expect(result).toBeNull();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('returns null when scheduling fails', async () => {
      // Arrange
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Scheduling failed')
      );

      // Act
      const result = await scheduler.scheduleWeeklyNotification(defaultSettings);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('scheduleNotifications', () => {
    beforeEach(() => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        'notification-123'
      );
      (Notifications.cancelAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
        undefined
      );
    });

    it('schedules daily notifications when frequency is daily', async () => {
      // Arrange
      const settings: NotificationSettings = {
        ...defaultSettings,
        frequency: 'daily',
      };

      // Act
      const result = await scheduler.scheduleNotifications(settings);

      // Assert
      expect(result).toBe(true);
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Portfolio Daily Report',
          }),
        })
      );
    });

    it('schedules weekly notifications when frequency is weekly', async () => {
      // Arrange
      const settings: NotificationSettings = {
        ...defaultSettings,
        frequency: 'weekly',
      };

      // Act
      const result = await scheduler.scheduleNotifications(settings);

      // Assert
      expect(result).toBe(true);
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Portfolio Weekly Report',
          }),
        })
      );
    });

    it('cancels notifications when frequency is off', async () => {
      // Arrange
      const settings: NotificationSettings = {
        ...defaultSettings,
        frequency: 'off',
      };

      // Act
      const result = await scheduler.scheduleNotifications(settings);

      // Assert
      expect(result).toBe(true);
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('cancels notifications when disabled', async () => {
      // Arrange
      const settings: NotificationSettings = {
        ...defaultSettings,
        enabled: false,
      };

      // Act
      const result = await scheduler.scheduleNotifications(settings);

      // Assert
      expect(result).toBe(true);
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('returns false when scheduling fails', async () => {
      // Arrange
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Scheduling failed')
      );

      // Act
      const result = await scheduler.scheduleNotifications(defaultSettings);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Cancellation', () => {
    it('cancels all scheduled notifications', async () => {
      // Arrange
      (Notifications.cancelAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      // Act
      const result = await scheduler.cancelAllNotifications();

      // Assert
      expect(result).toBe(true);
      expect(Notifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });

    it('clears storage when canceling all notifications', async () => {
      // Arrange
      (Notifications.cancelAllScheduledNotificationsAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      // Add some metadata to storage first
      await mockStorage.setItem(
        '@portfel/scheduled-notifications',
        JSON.stringify([{ id: 'test', type: 'daily_report' }])
      );

      // Act
      await scheduler.cancelAllNotifications();

      // Assert
      const stored = await mockStorage.getItem('@portfel/scheduled-notifications');
      expect(stored).toBeNull();
    });

    it('returns false when cancellation fails', async () => {
      // Arrange
      (Notifications.cancelAllScheduledNotificationsAsync as jest.Mock).mockRejectedValue(
        new Error('Cancel failed')
      );

      // Act
      const result = await scheduler.cancelAllNotifications();

      // Assert
      expect(result).toBe(false);
    });

    it('cancels specific notification by ID', async () => {
      // Arrange
      const notificationId = 'notification-123';
      (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockResolvedValue(
        undefined
      );

      // Act
      const result = await scheduler.cancelNotification(notificationId);

      // Assert
      expect(result).toBe(true);
      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        notificationId
      );
    });

    it('returns false when specific cancellation fails', async () => {
      // Arrange
      (Notifications.cancelScheduledNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Cancel failed')
      );

      // Act
      const result = await scheduler.cancelNotification('notification-123');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Metadata Storage', () => {
    it('saves and retrieves scheduled notification metadata', async () => {
      // Arrange
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        'notification-123'
      );

      // Act
      await scheduler.scheduleDailyNotification(defaultSettings);
      const notifications = await scheduler.getScheduledNotifications();

      // Assert
      expect(notifications).toHaveLength(1);
      expect(notifications[0]?.id).toBe('notification-123');
      expect(notifications[0]?.type).toBe('daily_report');
      expect(notifications[0]?.scheduledFor).toBeInstanceOf(Date);
      expect(notifications[0]?.nextTrigger).toBeInstanceOf(Date);
    });

    it('returns empty array when no metadata stored', async () => {
      // Act
      const notifications = await scheduler.getScheduledNotifications();

      // Assert
      expect(notifications).toEqual([]);
    });

    it('handles corrupted metadata gracefully', async () => {
      // Arrange
      await mockStorage.setItem(
        '@portfel/scheduled-notifications',
        'invalid json'
      );

      // Act
      const notifications = await scheduler.getScheduledNotifications();

      // Assert
      expect(notifications).toEqual([]);
    });

    it('handles non-array metadata gracefully', async () => {
      // Arrange
      await mockStorage.setItem(
        '@portfel/scheduled-notifications',
        JSON.stringify({ invalid: 'data' })
      );

      // Act
      const notifications = await scheduler.getScheduledNotifications();

      // Assert
      expect(notifications).toEqual([]);
    });

    it('deserializes dates correctly', async () => {
      // Arrange
      const now = new Date();
      const metadata: ScheduledNotification[] = [
        {
          id: 'test-123',
          type: 'daily_report',
          scheduledFor: now,
          nextTrigger: now,
        },
      ];

      await mockStorage.setItem(
        '@portfel/scheduled-notifications',
        JSON.stringify(
          metadata.map((item) => ({
            ...item,
            scheduledFor: item.scheduledFor.toISOString(),
            nextTrigger: item.nextTrigger.toISOString(),
          }))
        )
      );

      // Act
      const notifications = await scheduler.getScheduledNotifications();

      // Assert
      expect(notifications[0]?.scheduledFor).toBeInstanceOf(Date);
      expect(notifications[0]?.nextTrigger).toBeInstanceOf(Date);
    });
  });

  describe('Test Notification', () => {
    it('sends test notification when permissions granted', async () => {
      // Arrange
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        'test-notification-123'
      );

      // Act
      const result = await scheduler.sendTestNotification();

      // Assert
      expect(result).toBe(true);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Test Notification',
            data: { type: 'test' },
          }),
          trigger: expect.objectContaining({
            seconds: 1,
          }),
        })
      );
    });

    it('returns false when permissions not granted', async () => {
      // Arrange
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      // Act
      const result = await scheduler.sendTestNotification();

      // Assert
      expect(result).toBe(false);
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('returns false when sending fails', async () => {
      // Arrange
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        new Error('Send failed')
      );

      // Act
      const result = await scheduler.sendTestNotification();

      // Assert
      expect(result).toBe(false);
    });
  });
});
