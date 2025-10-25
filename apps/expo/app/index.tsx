import React, { useCallback } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';

import {
  calculatePortfolioSummary,
  type Position,
  type PortfolioHistoryPoint,
  MOCK_PORTFOLIO_HISTORY,
} from '@portfel/logic';
import {
  colors,
  spacing,
  PortfolioSummary,
  PortfolioTable,
  StockChart,
} from '@portfel/ui';

// Mock data for initial development
const MOCK_POSITIONS: Position[] = [
  {
    symbol: 'PKN',
    quantity: 100,
    purchasePrice: 50.0,
    currentPrice: 60.0,
    purchaseDate: new Date('2024-01-15'),
  },
  {
    symbol: 'PKO',
    quantity: 50,
    purchasePrice: 40.0,
    currentPrice: 42.5,
    purchaseDate: new Date('2024-02-01'),
  },
  {
    symbol: 'PZU',
    quantity: 75,
    purchasePrice: 30.0,
    currentPrice: 28.0,
    purchaseDate: new Date('2024-01-20'),
  },
];

export default function PortfolioScreen(): JSX.Element {
  const router = useRouter();
  const summary = calculatePortfolioSummary(MOCK_POSITIONS);

  const handleRowPress = useCallback((symbol: string): void => {
    // TODO: Navigate to stock detail screen
    console.log('Pressed:', symbol);
  }, []);

  const handleImportPress = useCallback((): void => {
    router.push('/import');
  }, [router]);

  const handleSettingsPress = useCallback((): void => {
    router.push('/settings');
  }, [router]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Portfel GPW Advisor
          </Text>
          <View style={styles.headerButtons}>
            <Button
              mode="outlined"
              icon="cog"
              onPress={handleSettingsPress}
              style={styles.settingsButton}
            >
              Settings
            </Button>
            <Button
              mode="contained"
              icon="plus"
              onPress={handleImportPress}
              style={styles.importButton}
            >
              Import
            </Button>
          </View>
        </View>

        <PortfolioSummary summary={summary} />

        <StockChart
          data={MOCK_PORTFOLIO_HISTORY}
          title="Portfolio Value History"
          showArea={true}
        />

        <View style={styles.tableContainer}>
          <Text variant="titleMedium" style={styles.tableTitle}>
            Holdings
          </Text>
          <PortfolioTable positions={MOCK_POSITIONS} onRowPress={handleRowPress} />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleImportPress}
        label="Import"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  settingsButton: {
    borderColor: colors.primary,
  },
  importButton: {
    backgroundColor: colors.primary,
  },
  tableContainer: {
    marginTop: spacing.lg,
    marginBottom: 100, // Space for FAB
  },
  tableTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
