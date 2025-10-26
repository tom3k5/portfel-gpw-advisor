import React, { useState, useMemo } from 'react';

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
 * PortfolioTable component displays portfolio positions in a sortable table (Web version)
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
      <div style={styles.emptyContainer}>
        <div style={styles.emptyText}>
          No positions yet
        </div>
        <div style={styles.emptySubtext}>
          Add your first stock to get started
        </div>
      </div>
    );
  }

  return (
    <div style={styles.scrollContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th
              style={{ ...styles.th, ...styles.symbolColumn, cursor: 'pointer' }}
              onClick={() => handleSort('symbol')}
            >
              Symbol {sortKey === 'symbol' && (sortDirection === 'ascending' ? '▲' : '▼')}
            </th>
            <th style={{ ...styles.th, textAlign: 'right' }}>
              Quantity
            </th>
            <th style={{ ...styles.th, textAlign: 'right' }}>
              Avg Price
            </th>
            <th style={{ ...styles.th, textAlign: 'right' }}>
              Current
            </th>
            <th
              style={{ ...styles.th, textAlign: 'right', cursor: 'pointer' }}
              onClick={() => handleSort('value')}
            >
              Value {sortKey === 'value' && (sortDirection === 'ascending' ? '▲' : '▼')}
            </th>
            <th
              style={{ ...styles.th, textAlign: 'right', cursor: 'pointer' }}
              onClick={() => handleSort('pnl')}
            >
              P&L {sortKey === 'pnl' && (sortDirection === 'ascending' ? '▲' : '▼')}
            </th>
            <th
              style={{ ...styles.th, textAlign: 'right', cursor: 'pointer' }}
              onClick={() => handleSort('pnlPercent')}
            >
              P&L % {sortKey === 'pnlPercent' && (sortDirection === 'ascending' ? '▲' : '▼')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPositions.map((position) => {
            const pnl = calculatePnL(position);
            const pnlPercent = calculatePnLPercent(position);
            const value = calculatePositionValue(position);
            const pnlColor = pnl >= 0 ? colors.positive : colors.negative;

            return (
              <tr
                key={position.symbol}
                style={styles.row}
                onClick={() => onRowPress?.(position.symbol)}
              >
                <td style={{ ...styles.td, ...styles.symbolText }}>
                  {position.symbol}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {position.quantity}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {position.purchasePrice.toFixed(2)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {position.currentPrice.toFixed(2)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right', fontWeight: '600' }}>
                  {value.toFixed(2)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right', color: pnlColor }}>
                  {pnl >= 0 ? '+' : ''}
                  {pnl.toFixed(2)}
                </td>
                <td style={{ ...styles.td, textAlign: 'right', color: pnlColor, fontWeight: 'bold' }}>
                  {pnlPercent >= 0 ? '+' : ''}
                  {pnlPercent.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  scrollContainer: {
    overflowX: 'auto',
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 700,
  },
  th: {
    padding: spacing.md,
    borderBottom: `2px solid ${colors.border}`,
    fontWeight: '600',
    fontSize: 14,
    color: colors.textSecondary,
  },
  td: {
    padding: spacing.md,
    borderBottom: `1px solid ${colors.border}`,
    fontSize: 14,
  },
  symbolColumn: {
    textAlign: 'left',
  },
  row: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  symbolText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: 'white',
    borderRadius: 12,
    minHeight: 200,
  },
  emptyText: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontSize: 18,
  },
  emptySubtext: {
    color: colors.textTertiary,
    fontSize: 14,
  },
};
