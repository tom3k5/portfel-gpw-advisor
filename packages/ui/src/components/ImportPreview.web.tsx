import React from 'react';
import type { Position } from '@portfel/logic';
import { colors, spacing } from '../theme';

interface ImportPreviewProps {
  positions: Position[];
  fileName: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * ImportPreview - Web version for reviewing import before saving
 */
export const ImportPreview: React.FC<ImportPreviewProps> = ({
  positions,
  fileName,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const totalCost = positions.reduce(
    (sum, p) => sum + p.quantity * p.purchasePrice,
    0
  );
  const totalShares = positions.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Preview Import</h2>
        <p style={styles.fileName}>File: {fileName}</p>
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Positions:</span>
          <span style={styles.summaryValue}>{positions.length}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Shares:</span>
          <span style={styles.summaryValue}>{totalShares}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Cost:</span>
          <span style={styles.summaryValue}>
            {totalCost.toLocaleString('pl-PL', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            PLN
          </span>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Symbol</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Quantity</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Price</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Total</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.td}>{position.symbol}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {position.quantity}
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {position.purchasePrice.toFixed(2)} PLN
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  {(position.quantity * position.purchasePrice).toFixed(2)} PLN
                </td>
                <td style={styles.td}>
                  {position.purchaseDate.toLocaleDateString('pl-PL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.buttonContainer}>
        <button
          onClick={onCancel}
          style={styles.cancelButton}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={styles.confirmButton}
          disabled={loading}
        >
          {loading ? 'Importing...' : `Import ${positions.length} Position${positions.length !== 1 ? 's' : ''}`}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.lg,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: spacing.xs,
    margin: 0,
  },
  fileName: {
    fontSize: 14,
    color: colors.textSecondary,
    margin: 0,
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: spacing.md,
    maxHeight: 400,
    overflowY: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: spacing.sm,
    borderBottom: `2px solid ${colors.border}`,
    fontWeight: '600',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'left',
  },
  td: {
    padding: spacing.sm,
    borderBottom: `1px solid ${colors.border}`,
    fontSize: 14,
  },
  row: {
    transition: 'background-color 0.2s',
  },
  buttonContainer: {
    display: 'flex',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    backgroundColor: 'white',
    color: colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  confirmButton: {
    flex: 2,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    border: 'none',
    borderRadius: 6,
    backgroundColor: colors.primary,
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
