'use client';

import React from 'react';

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

export default function HomePage(): JSX.Element {
  const summary = calculatePortfolioSummary(MOCK_POSITIONS);

  return (
    <main style={styles.container}>
      <h1 style={styles.mainTitle}>Portfel GPW Advisor</h1>

      <div style={styles.summaryCard}>
        <h2 style={styles.title}>Portfolio Summary</h2>

        <div style={styles.row}>
          <span style={styles.label}>Total Value:</span>
          <span style={styles.value}>{summary.totalValue.toFixed(2)} PLN</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Total Cost:</span>
          <span style={styles.value}>{summary.totalCost.toFixed(2)} PLN</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>P&L:</span>
          <span
            style={{
              ...styles.value,
              color: summary.totalPnL >= 0 ? colors.positive : colors.negative,
            }}
          >
            {summary.totalPnL >= 0 ? '+' : ''}
            {summary.totalPnL.toFixed(2)} PLN ({summary.totalPnLPercent.toFixed(2)}%)
          </span>
        </div>
      </div>

      <h2 style={styles.positionsTitle}>Positions ({summary.positions.length})</h2>

      <div style={styles.positionsGrid}>
        {summary.positions.map((position) => (
          <div key={position.symbol} style={styles.positionCard}>
            <div style={styles.positionHeader}>
              <span style={styles.symbol}>{position.symbol}</span>
              <span>{position.quantity} shares</span>
            </div>

            <div style={styles.positionDetails}>
              <span style={styles.detailText}>Purchase: {position.purchasePrice.toFixed(2)} PLN</span>
              <span style={styles.detailText}>Current: {position.currentPrice.toFixed(2)} PLN</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.lg,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  summaryCard: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  row: {
    display: 'flex',
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  positionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: spacing.md,
  },
  positionCard: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  positionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  symbol: {
    fontWeight: 'bold',
    fontSize: 18,
    color: colors.primary,
  },
  positionDetails: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
};
