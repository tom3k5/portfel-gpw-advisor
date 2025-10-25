import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Divider } from 'react-native-paper';

import type { PortfolioSummary as PortfolioSummaryType } from '@portfel/logic';

import { colors, spacing } from '../theme';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  loading?: boolean;
}

/**
 * PortfolioSummary component displays key portfolio metrics in a card
 *
 * Features:
 * - Total portfolio value
 * - Total cost basis
 * - Total P&L (amount and percentage)
 * - Color-coded gains/losses
 * - Loading state support
 * - Optimized with React.memo to prevent unnecessary re-renders
 *
 * @example
 * <PortfolioSummary
 *   summary={portfolioSummary}
 *   loading={isLoading}
 * />
 */
export const PortfolioSummary: React.FC<PortfolioSummaryProps> = React.memo(({
  summary,
  loading = false,
}) => {
  const pnlColor = summary.totalPnL >= 0 ? colors.positive : colors.negative;
  const pnlSign = summary.totalPnL >= 0 ? '+' : '';

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          Portfolio Summary
        </Text>

        <View style={styles.mainMetric}>
          <Text variant="labelMedium" style={styles.label}>
            Total Value
          </Text>
          <Text variant="displaySmall" style={styles.totalValue}>
            {loading ? '...' : `${summary.totalValue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.metricsGrid}>
          <View style={styles.metric}>
            <Text variant="labelMedium" style={styles.label}>
              Total Cost
            </Text>
            <Text variant="titleMedium" style={styles.value}>
              {loading ? '...' : `${summary.totalCost.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
            </Text>
          </View>

          <View style={styles.metric}>
            <Text variant="labelMedium" style={styles.label}>
              Positions
            </Text>
            <Text variant="titleMedium" style={styles.value}>
              {loading ? '...' : summary.positions.length}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.pnlContainer}>
          <View style={styles.pnlRow}>
            <Text variant="labelLarge" style={styles.label}>
              Total P&L
            </Text>
            <View style={styles.pnlValues}>
              <Text variant="titleLarge" style={[styles.pnlAmount, { color: pnlColor }]}>
                {loading ? '...' : `${pnlSign}${summary.totalPnL.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
              </Text>
              <Text variant="titleMedium" style={[styles.pnlPercent, { color: pnlColor }]}>
                ({pnlSign}
                {loading ? '...' : summary.totalPnLPercent.toFixed(2)}%)
              </Text>
            </View>
          </View>
        </View>

        {summary.totalPnL !== 0 && !loading && (
          <View style={[styles.badge, { backgroundColor: `${pnlColor}15` }]}>
            <Text variant="bodySmall" style={[styles.badgeText, { color: pnlColor }]}>
              {summary.totalPnL > 0
                ? `You're up ${summary.totalPnLPercent.toFixed(2)}% 📈`
                : `You're down ${Math.abs(summary.totalPnLPercent).toFixed(2)}% 📉`}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  mainMetric: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  totalValue: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  divider: {
    marginVertical: spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  metric: {
    alignItems: 'center',
  },
  value: {
    fontWeight: '600',
  },
  pnlContainer: {
    paddingVertical: spacing.md,
  },
  pnlRow: {
    alignItems: 'center',
  },
  pnlValues: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  pnlAmount: {
    fontWeight: 'bold',
  },
  pnlPercent: {
    fontWeight: '600',
  },
  badge: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeText: {
    fontWeight: '600',
  },
});
