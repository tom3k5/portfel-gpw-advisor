import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

import { theme } from '@portfel/ui';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout(): JSX.Element {
  useEffect(() => {
    // Listen for notifications received while app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received in foreground:', notification);
      }
    );

    // Listen for user tapping notifications
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);

        // Handle navigation based on notification type
        if (data.type === 'daily_report' || data.type === 'weekly_report') {
          // TODO: Navigate to report detail screen when implemented
          // router.push(`/reports/${data.reportId}`);
        }
      }
    );

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.textInverted,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Portfolio',
          }}
        />
        <Stack.Screen
          name="import"
          options={{
            title: 'Import Portfolio',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Notification Settings',
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
