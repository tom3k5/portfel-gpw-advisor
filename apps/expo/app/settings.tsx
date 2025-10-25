import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Button,
  List,
  Switch,
  Dialog,
  Portal,
  RadioButton,
  Divider,
  Card,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { colors as COLORS, spacing as SPACING } from '@portfel/ui';
import type {
  NotificationSettings,
  NotificationFrequency,
  DayOfWeek,
  NotificationTime,
} from '@portfel/logic';
import {
  NotificationSettingsStorage,
  NotificationScheduler,
} from '@portfel/logic';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage adapter for mobile
 */
class AsyncStorageAdapter {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

// Create storage and scheduler instances
const storageAdapter = new AsyncStorageAdapter();
const settingsStorage = new NotificationSettingsStorage(storageAdapter);
const scheduler = new NotificationScheduler(storageAdapter);

// Day labels for UI
const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

// Frequency labels
const FREQUENCY_LABELS: Record<NotificationFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  off: 'Off',
};

/**
 * SettingsScreen - Notification settings for portfolio reports
 *
 * Features:
 * - Master enable/disable switch
 * - Frequency selector (daily/weekly/off)
 * - Time picker for notifications
 * - Day of week picker for weekly notifications
 * - Include positions toggle
 * - Quiet hours configuration
 * - Test notification
 * - Permission handling
 */
export default function SettingsScreen() {
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [showFrequencyDialog, setShowFrequencyDialog] = useState(false);
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showQuietStartPicker, setShowQuietStartPicker] = useState(false);
  const [showQuietEndPicker, setShowQuietEndPicker] = useState(false);
  const [nextNotification, setNextNotification] = useState<Date | null>(null);

  /**
   * Load settings on mount
   */
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Load notification settings from storage
   */
  const loadSettings = async () => {
    setLoading(true);
    try {
      const saved = await settingsStorage.loadSettings();
      setSettings(saved);

      // Get next scheduled notification
      if (saved.enabled && saved.frequency !== 'off') {
        const scheduled = await scheduler.getScheduledNotifications();
        if (scheduled.length > 0 && scheduled[0]) {
          setNextNotification(scheduled[0].nextTrigger);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      Alert.alert('Error', 'Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request notification permissions
   */
  const requestPermissions = async (): Promise<boolean> => {
    const granted = await scheduler.requestPermissions();

    if (!granted) {
      Alert.alert(
        'Permissions Required',
        'Please enable notifications in your device settings to receive portfolio reports.',
        [{ text: 'OK' }]
      );
      return false;
    }

    return true;
  };

  /**
   * Save settings and reschedule notifications
   */
  const saveSettings = async (newSettings: NotificationSettings) => {
    setSaving(true);
    try {
      // Save to storage
      await settingsStorage.saveSettings(newSettings);
      setSettings(newSettings);

      // Reschedule notifications
      if (newSettings.enabled && newSettings.frequency !== 'off') {
        await scheduler.scheduleNotifications(newSettings);
        const scheduled = await scheduler.getScheduledNotifications();
        if (scheduled.length > 0 && scheduled[0]) {
          setNextNotification(scheduled[0].nextTrigger);
        }
      } else {
        await scheduler.cancelAllNotifications();
        setNextNotification(null);
      }

      Alert.alert('Success', 'Notification settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert('Error', 'Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle master toggle
   */
  const handleToggleEnabled = async (enabled: boolean) => {
    if (!settings) return;

    if (enabled) {
      // Request permissions when enabling
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;
    }

    const newSettings = { ...settings, enabled };
    await saveSettings(newSettings);
  };

  /**
   * Handle frequency change
   */
  const handleFrequencyChange = async (frequency: NotificationFrequency) => {
    if (!settings) return;

    const newSettings = { ...settings, frequency };
    setShowFrequencyDialog(false);
    await saveSettings(newSettings);
  };

  /**
   * Handle time change
   */
  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (!settings || !selectedDate) return;

    const newSettings = {
      ...settings,
      time: {
        hour: selectedDate.getHours(),
        minute: selectedDate.getMinutes(),
      },
    };

    if (Platform.OS === 'android') {
      await saveSettings(newSettings);
    } else {
      setSettings(newSettings);
    }
  };

  /**
   * Handle day of week change
   */
  const handleDayChange = async (day: DayOfWeek) => {
    if (!settings) return;

    const newSettings = { ...settings, weeklyDay: day };
    setShowDayDialog(false);
    await saveSettings(newSettings);
  };

  /**
   * Handle include positions toggle
   */
  const handleToggleIncludePositions = async (includePositions: boolean) => {
    if (!settings) return;

    const newSettings = { ...settings, includePositions };
    await saveSettings(newSettings);
  };

  /**
   * Handle quiet hours toggle
   */
  const handleToggleQuietHours = async (enabled: boolean) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      quietHours: { ...settings.quietHours, enabled },
    };
    await saveSettings(newSettings);
  };

  /**
   * Handle quiet hours time change
   */
  const handleQuietHoursTimeChange = async (
    type: 'start' | 'end',
    event: any,
    selectedDate?: Date
  ) => {
    if (type === 'start') {
      setShowQuietStartPicker(Platform.OS === 'ios');
    } else {
      setShowQuietEndPicker(Platform.OS === 'ios');
    }

    if (!settings || !selectedDate) return;

    const newTime: NotificationTime = {
      hour: selectedDate.getHours(),
      minute: selectedDate.getMinutes(),
    };

    const newSettings = {
      ...settings,
      quietHours: {
        ...settings.quietHours,
        [type]: newTime,
      },
    };

    if (Platform.OS === 'android') {
      await saveSettings(newSettings);
    } else {
      setSettings(newSettings);
    }
  };

  /**
   * Send test notification
   */
  const handleTestNotification = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const success = await scheduler.sendTestNotification();

      if (success) {
        Alert.alert(
          'Test Scheduled',
          'A test notification will appear in a few seconds',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to send test notification');
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  /**
   * Format time for display
   */
  const formatTime = (time: NotificationTime): string => {
    const hour = time.hour.toString().padStart(2, '0');
    const minute = time.minute.toString().padStart(2, '0');
    return `${hour}:${minute}`;
  };

  /**
   * Get timezone display
   */
  const getTimezoneDisplay = (): string => {
    if (!settings) return '';
    const offset = new Date().getTimezoneOffset();
    const hours = Math.abs(Math.floor(offset / 60));
    const minutes = Math.abs(offset % 60);
    const sign = offset <= 0 ? '+' : '-';
    return `${settings.timezone} (UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')})`;
  };

  if (loading || !settings) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isDisabled = !settings.enabled;
  const isWeekly = settings.frequency === 'weekly';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Notification Settings
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Configure portfolio report notifications
          </Text>
        </View>

        {/* Info Box */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="bodySmall" style={styles.infoText}>
              Receive regular portfolio reports as local notifications. Reports include
              your portfolio summary, changes, and top performers.
            </Text>
          </Card.Content>
        </Card>

        {/* Master Switch */}
        <List.Section>
          <List.Item
            title="Enable Notifications"
            description="Master switch for all notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.enabled}
                onValueChange={handleToggleEnabled}
                disabled={saving}
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Notification Settings */}
        <List.Section>
          <List.Subheader>Report Settings</List.Subheader>

          {/* Frequency */}
          <List.Item
            title="Frequency"
            description={FREQUENCY_LABELS[settings.frequency]}
            left={(props) => <List.Icon {...props} icon="calendar-clock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowFrequencyDialog(true)}
            disabled={isDisabled || saving}
          />

          {/* Time */}
          <List.Item
            title="Notification Time"
            description={formatTime(settings.time)}
            left={(props) => <List.Icon {...props} icon="clock-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => setShowTimePicker(true)}
            disabled={isDisabled || saving || settings.frequency === 'off'}
          />

          {/* Day of Week (for weekly) */}
          {isWeekly && (
            <List.Item
              title="Day of Week"
              description={
                settings.weeklyDay ? DAY_LABELS[settings.weeklyDay] : 'Select day'
              }
              left={(props) => <List.Icon {...props} icon="calendar" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowDayDialog(true)}
              disabled={isDisabled || saving}
            />
          )}

          {/* Include Positions */}
          <List.Item
            title="Include Position Details"
            description="Show individual stock positions in reports"
            left={(props) => <List.Icon {...props} icon="chart-line" />}
            right={() => (
              <Switch
                value={settings.includePositions}
                onValueChange={handleToggleIncludePositions}
                disabled={isDisabled || saving}
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Quiet Hours */}
        <List.Section>
          <List.Subheader>Quiet Hours</List.Subheader>

          <List.Item
            title="Enable Quiet Hours"
            description="Don't send notifications during quiet hours"
            left={(props) => <List.Icon {...props} icon="sleep" />}
            right={() => (
              <Switch
                value={settings.quietHours.enabled}
                onValueChange={handleToggleQuietHours}
                disabled={isDisabled || saving}
              />
            )}
          />

          {settings.quietHours.enabled && (
            <>
              <List.Item
                title="Quiet Hours Start"
                description={formatTime(settings.quietHours.start)}
                left={(props) => <List.Icon {...props} icon="clock-start" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setShowQuietStartPicker(true)}
                disabled={isDisabled || saving}
              />

              <List.Item
                title="Quiet Hours End"
                description={formatTime(settings.quietHours.end)}
                left={(props) => <List.Icon {...props} icon="clock-end" />}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => setShowQuietEndPicker(true)}
                disabled={isDisabled || saving}
              />
            </>
          )}
        </List.Section>

        <Divider />

        {/* Status Info */}
        <List.Section>
          <List.Subheader>Status</List.Subheader>

          <List.Item
            title="Timezone"
            description={getTimezoneDisplay()}
            left={(props) => <List.Icon {...props} icon="earth" />}
          />

          {nextNotification && (
            <List.Item
              title="Next Notification"
              description={nextNotification.toLocaleString()}
              left={(props) => <List.Icon {...props} icon="calendar-check" />}
            />
          )}
        </List.Section>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={handleTestNotification}
            icon="test-tube"
            style={styles.actionButton}
            disabled={saving}
          >
            Send Test Notification
          </Button>

          <Button
            mode="text"
            onPress={() => router.back()}
            icon="arrow-left"
            style={styles.actionButton}
          >
            Back to Dashboard
          </Button>
        </View>
      </ScrollView>

      {/* Frequency Dialog */}
      <Portal>
        <Dialog
          visible={showFrequencyDialog}
          onDismiss={() => setShowFrequencyDialog(false)}
        >
          <Dialog.Title>Select Frequency</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) =>
                handleFrequencyChange(value as NotificationFrequency)
              }
              value={settings.frequency}
            >
              <RadioButton.Item label="Daily" value="daily" />
              <RadioButton.Item label="Weekly" value="weekly" />
              <RadioButton.Item label="Off" value="off" />
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFrequencyDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Day of Week Dialog */}
      <Portal>
        <Dialog visible={showDayDialog} onDismiss={() => setShowDayDialog(false)}>
          <Dialog.Title>Select Day</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Group
              onValueChange={(value) => handleDayChange(value as DayOfWeek)}
              value={settings.weeklyDay || 'monday'}
            >
              {(Object.keys(DAY_LABELS) as DayOfWeek[]).map((day) => (
                <RadioButton.Item
                  key={day}
                  label={DAY_LABELS[day]}
                  value={day}
                />
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDayDialog(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={
            new Date(0, 0, 0, settings.time.hour, settings.time.minute)
          }
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      {/* Quiet Hours Start Picker */}
      {showQuietStartPicker && (
        <DateTimePicker
          value={
            new Date(
              0,
              0,
              0,
              settings.quietHours.start.hour,
              settings.quietHours.start.minute
            )
          }
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, d) => handleQuietHoursTimeChange('start', e, d)}
        />
      )}

      {/* Quiet Hours End Picker */}
      {showQuietEndPicker && (
        <DateTimePicker
          value={
            new Date(
              0,
              0,
              0,
              settings.quietHours.end.hour,
              settings.quietHours.end.minute
            )
          }
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(e, d) => handleQuietHoursTimeChange('end', e, d)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  infoCard: {
    margin: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
  },
  infoText: {
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actions: {
    padding: SPACING.md,
    gap: SPACING.md,
  },
  actionButton: {
    marginVertical: SPACING.xs,
  },
});
