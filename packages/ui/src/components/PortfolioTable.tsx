import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { DataTable, Text } from 'react-native-paper';

import type { Position } from '@portfel/logic';
import { calculatePnL, calculatePnLPercent, calculatePositionValue } from '@portfel/logic';

import { colors, spacing } from '../theme';

interface PortfolioTableProps {
  positions: Position[];
  onRowPress?: (symbol: string) => void;
}

type SortKey = 'symbol' | 'pnl' | 'value' | 'pnlPercent';
type SortDirection = 'ascending' | 'descending';

/**
 * PortfolioTable component displays portfolio positions in a sortable table
 *
 * Features:
 * - Sortable columns (symbol, P&L, value)
 * - Color-coded P&L (green for profit, red for loss)
 * - Responsive design
 * - Press handler for row navigation
 * - Optimized with React.memo and useMemo for performance
 *
 * @example
 * <PortfolioTable
 *   positions={portfolioPositions}
 *   onRowPress={(symbol) => navigation.navigate('StockDetail', { symbol })}
 * />
 */
export const PortfolioTable: React.FC<PortfolioTableProps> = React.memo(({ positions, onRowPress }) => {
  const [sortKey, setSortKey] = useState<SortKey>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');

  const sortedPositions = useMemo(() => {
    const sorted = [...positions];

    sorted.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortKey) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'pnl':
          aValue = calculatePnL(a);
          bValue = calculatePnL(b);
          break;
        case 'pnlPercent':
          aValue = calculatePnLPercent(a);
          bValue = calculatePnLPercent(b);
          break;
        case 'value':
          aValue = calculatePositionValue(a);
          bValue = calculatePositionValue(b);
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'ascending'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return sorted;
  }, [positions, sortKey, sortDirection]);

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      setSortKey(key);
      setSortDirection('ascending');
    }
  };

  if (positions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          No positions yet
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          Add your first stock to get started
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal style={styles.scrollContainer}>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title
            style={styles.symbolColumn}
            onPress={() => handleSort('symbol')}
            sortDirection={sortKey === 'symbol' ? sortDirection : undefined}
          >
            Symbol
          </DataTable.Title>
          <DataTable.Title style={styles.quantityColumn} numeric>
            Quantity
          </DataTable.Title>
          <DataTable.Title style={styles.priceColumn} numeric>
            Avg Price
          </DataTable.Title>
          <DataTable.Title style={styles.priceColumn} numeric>
            Current
          </DataTable.Title>
          <DataTable.Title
            style={styles.valueColumn}
            numeric
            onPress={() => handleSort('value')}
            sortDirection={sortKey === 'value' ? sortDirection : undefined}
          >
            Value
          </DataTable.Title>
          <DataTable.Title
            style={styles.pnlColumn}
            numeric
            onPress={() => handleSort('pnl')}
            sortDirection={sortKey === 'pnl' ? sortDirection : undefined}
          >
            P&L
          </DataTable.Title>
          <DataTable.Title
            style={styles.pnlPercentColumn}
            numeric
            onPress={() => handleSort('pnlPercent')}
            sortDirection={sortKey === 'pnlPercent' ? sortDirection : undefined}
          >
            P&L %
          </DataTable.Title>
        </DataTable.Header>

        {sortedPositions.map((position) => {
          const pnl = calculatePnL(position);
          const pnlPercent = calculatePnLPercent(position);
          const value = calculatePositionValue(position);
          const pnlColor = pnl >= 0 ? colors.positive : colors.negative;

          return (
            <Pressable
              key={position.symbol}
              onPress={() => onRowPress?.(position.symbol)}
              style={({ pressed }) => [
                styles.row,
                pressed && styles.rowPressed,
              ]}
            >
              <DataTable.Row style={styles.dataRow}>
                <DataTable.Cell style={styles.symbolColumn}>
                  <Text variant="bodyMedium" style={styles.symbolText}>
                    {position.symbol}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.quantityColumn} numeric>
                  {position.quantity}
                </DataTable.Cell>
                <DataTable.Cell style={styles.priceColumn} numeric>
                  {position.purchasePrice.toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell style={styles.priceColumn} numeric>
                  {position.currentPrice.toFixed(2)}
                </DataTable.Cell>
                <DataTable.Cell style={styles.valueColumn} numeric>
                  <Text variant="bodyMedium" style={styles.boldText}>
                    {value.toFixed(2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.pnlColumn} numeric>
                  <Text variant="bodyMedium" style={{ color: pnlColor }}>
                    {pnl >= 0 ? '+' : ''}
                    {pnl.toFixed(2)}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell style={styles.pnlPercentColumn} numeric>
                  <Text variant="bodyMedium" style={{ color: pnlColor, fontWeight: 'bold' }}>
                    {pnlPercent >= 0 ? '+' : ''}
                    {pnlPercent.toFixed(2)}%
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </Pressable>
          );
        })}
      </DataTable>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  table: {
    backgroundColor: colors.background,
    minWidth: 700,
  },
  symbolColumn: {
    flex: 1,
    minWidth: 80,
  },
  quantityColumn: {
    flex: 0.8,
    minWidth: 70,
  },
  priceColumn: {
    flex: 1,
    minWidth: 80,
  },
  valueColumn: {
    flex: 1.2,
    minWidth: 100,
  },
  pnlColumn: {
    flex: 1.2,
    minWidth: 100,
  },
  pnlPercentColumn: {
    flex: 1,
    minWidth: 90,
  },
  row: {
    width: '100%',
  },
  dataRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.backgroundTertiary,
  },
  symbolText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  boldText: {
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    color: colors.textTertiary,
  },
});
