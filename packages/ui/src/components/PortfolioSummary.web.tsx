import React from 'react';

import type { PortfolioSummary as PortfolioSummaryType } from '@portfel/logic';

import { colors, spacing } from '../theme';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  loading?: boolean;
}

/**
 * PortfolioSummary component displays key portfolio metrics in a card (Web version)
 */
export const PortfolioSummary: React.FC<PortfolioSummaryProps> = React.memo(({
  summary,
  loading = false,
}) => {
  const pnlColor = summary.totalPnL >= 0 ? colors.positive : colors.negative;
  const pnlSign = summary.totalPnL >= 0 ? '+' : '';

  return (
    <div style={styles.card}>
      <div style={styles.cardContent}>
        <h2 style={styles.title}>
          Portfolio Summary
        </h2>

        <div style={styles.mainMetric}>
          <span style={styles.label}>
            Total Value
          </span>
          <div style={styles.totalValue}>
            {loading ? '...' : `${summary.totalValue.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.metricsGrid}>
          <div style={styles.metric}>
            <span style={styles.label}>
              Total Cost
            </span>
            <div style={styles.value}>
              {loading ? '...' : `${summary.totalCost.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
            </div>
          </div>

          <div style={styles.metric}>
            <span style={styles.label}>
              Positions
            </span>
            <div style={styles.value}>
              {loading ? '...' : summary.positions.length}
            </div>
          </div>
        </div>

        <hr style={styles.divider} />

        <div style={styles.pnlContainer}>
          <div style={styles.pnlRow}>
            <span style={styles.label}>
              Total P&L
            </span>
            <div style={styles.pnlValues}>
              <div style={{ ...styles.pnlAmount, color: pnlColor }}>
                {loading ? '...' : `${pnlSign}${summary.totalPnL.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PLN`}
              </div>
              <div style={{ ...styles.pnlPercent, color: pnlColor }}>
                ({pnlSign}
                {loading ? '...' : summary.totalPnLPercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        {summary.totalPnL !== 0 && !loading && (
          <div style={{ ...styles.badge, backgroundColor: `${pnlColor}15` }}>
            <span style={{ ...styles.badgeText, color: pnlColor }}>
              {summary.totalPnL > 0
                ? `You're up ${summary.totalPnLPercent.toFixed(2)}% 📈`
                : `You're down ${Math.abs(summary.totalPnLPercent).toFixed(2)}% 📉`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  card: {
    marginBottom: spacing.lg,
    backgroundColor: 'white',
    borderRadius: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  cardContent: {
    padding: spacing.lg,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
    fontSize: 20,
    margin: 0,
  },
  mainMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 14,
  },
  totalValue: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 32,
  },
  divider: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    border: 'none',
    borderTop: `1px solid ${colors.border}`,
  },
  metricsGrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  value: {
    fontWeight: '600',
    fontSize: 18,
  },
  pnlContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  pnlRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pnlValues: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  pnlAmount: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  pnlPercent: {
    fontWeight: '600',
    fontSize: 18,
  },
  badge: {
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontWeight: '600',
    fontSize: 14,
  },
};
