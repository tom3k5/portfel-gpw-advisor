import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';

import { theme } from '@portfel/ui';

export default function RootLayout(): JSX.Element {
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
      </Stack>
    </PaperProvider>
  );
}
