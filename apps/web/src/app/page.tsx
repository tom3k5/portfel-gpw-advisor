'use client';

import React from 'react';

import {
  calculatePortfolioSummary,
  type Position,
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

export default function HomePage(): JSX.Element {
  const summary = calculatePortfolioSummary(MOCK_POSITIONS);

  const handleRowPress = (symbol: string): void => {
    console.log('Clicked:', symbol);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.mainTitle}>Portfel GPW Advisor</h1>

      <div style={styles.content}>
        <PortfolioSummary summary={summary} />

        <div style={styles.chartSection}>
          <StockChart
            data={MOCK_PORTFOLIO_HISTORY}
            title="Portfolio Value History"
            showArea={true}
          />
        </div>

        <div style={styles.tableSection}>
          <h2 style={styles.sectionTitle}>Holdings</h2>
          <PortfolioTable positions={MOCK_POSITIONS} onRowPress={handleRowPress} />
        </div>
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
  content: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  chartSection: {
    marginBottom: spacing.xl,
  },
  tableSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
};
