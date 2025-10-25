import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Card } from 'react-native-paper';

import { calculatePortfolioSummary, type Position } from '@portfel/logic';
import { colors, spacing } from '@portfel/ui';

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

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Portfolio Summary
          </Text>

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>
              Total Value:
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {summary.totalValue.toFixed(2)} PLN
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>
              Total Cost:
            </Text>
            <Text variant="bodyLarge" style={styles.value}>
              {summary.totalCost.toFixed(2)} PLN
            </Text>
          </View>

          <View style={styles.row}>
            <Text variant="bodyLarge" style={styles.label}>
              P&L:
            </Text>
            <Text
              variant="bodyLarge"
              style={[
                styles.value,
                { color: summary.totalPnL >= 0 ? colors.positive : colors.negative },
              ]}
            >
              {summary.totalPnL >= 0 ? '+' : ''}
              {summary.totalPnL.toFixed(2)} PLN ({summary.totalPnLPercent.toFixed(2)}%)
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.positionsTitle}>
        Positions ({summary.positions.length})
      </Text>

      {summary.positions.map((position) => (
        <Card key={position.symbol} style={styles.positionCard}>
          <Card.Content>
            <View style={styles.positionHeader}>
              <Text variant="titleMedium" style={styles.symbol}>
                {position.symbol}
              </Text>
              <Text variant="bodyMedium">{position.quantity} shares</Text>
            </View>

            <View style={styles.positionDetails}>
              <Text variant="bodySmall" style={styles.detailText}>
                Purchase: {position.purchasePrice.toFixed(2)} PLN
              </Text>
              <Text variant="bodySmall" style={styles.detailText}>
                Current: {position.currentPrice.toFixed(2)} PLN
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
  },
  value: {
    fontWeight: 'bold',
  },
  positionsTitle: {
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  positionCard: {
    marginBottom: spacing.md,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  symbol: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  positionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    color: colors.textSecondary,
  },
});
