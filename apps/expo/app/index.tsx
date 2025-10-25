import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';

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
  const summary = calculatePortfolioSummary(MOCK_POSITIONS);

  const handleRowPress = (symbol: string): void => {
    // TODO: Navigate to stock detail screen
    console.log('Pressed:', symbol);
  };

  return (
    <ScrollView style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
  },
  tableContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  tableTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
});
