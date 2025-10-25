import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Divider, Chip, DataTable } from 'react-native-paper';
import type { Position } from '@portfel/logic';
import { calculatePortfolioSummary } from '@portfel/logic';
import { COLORS, SPACING } from '../theme';

/**
 * Props for ImportPreview component
 */
export interface ImportPreviewProps {
  /** Array of positions to preview */
  positions: Position[];
  /** Name of the imported file */
  fileName?: string;
  /** Array of validation errors */
  errors?: string[];
  /** Callback when user confirms import */
  onConfirm: () => void;
  /** Callback when user cancels import */
  onCancel: () => void;
  /** Whether import is in progress */
  loading?: boolean;
}

/**
 * ImportPreview - Preview component for imported positions before saving
 *
 * Features:
 * - Displays all positions in a table
 * - Shows summary statistics (count, total value)
 * - Lists validation errors if any
 * - Confirm/cancel actions
 * - Responsive scrolling for large datasets
 *
 * @example
 * ```typescript
 * <ImportPreview
 *   positions={parsedPositions}
 *   fileName="portfolio.csv"
 *   onConfirm={() => savePositions()}
 *   onCancel={() => setPreview(null)}
 * />
 * ```
 */
export const ImportPreview: React.FC<ImportPreviewProps> = React.memo(
  ({ positions, fileName, errors = [], onConfirm, onCancel, loading = false }) => {
    // Calculate summary
    const summary = useMemo(
      () => calculatePortfolioSummary(positions),
      [positions]
    );

    const hasErrors = errors.length > 0;
    const canConfirm = positions.length > 0 && !hasErrors;

    return (
      <Card style={styles.card}>
        <Card.Content>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>
              Import Preview
            </Text>
            {fileName && (
              <Chip
                icon="file-document"
                style={styles.fileChip}
                textStyle={styles.fileChipText}
              >
                {fileName}
              </Chip>
            )}
          </View>

          <Divider style={styles.divider} />

          {/* Summary Stats */}
          <View style={styles.summaryContainer}>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>
                Positions
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {positions.length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Cost
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {summary.totalCost.toLocaleString('pl-PL', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                PLN
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total Shares
              </Text>
              <Text variant="titleMedium" style={styles.statValue}>
                {summary.totalQuantity}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Errors Section */}
          {hasErrors && (
            <>
              <View style={styles.errorSection}>
                <Text variant="titleSmall" style={styles.errorTitle}>
                  Validation Errors ({errors.length})
                </Text>
                <ScrollView style={styles.errorList}>
                  {errors.map((error, index) => (
                    <Text
                      key={index}
                      variant="bodySmall"
                      style={styles.errorText}
                    >
                      • {error}
                    </Text>
                  ))}
                </ScrollView>
              </View>
              <Divider style={styles.divider} />
            </>
          )}

          {/* Positions Table */}
          {positions.length > 0 && (
            <>
              <Text variant="titleSmall" style={styles.sectionTitle}>
                Positions to Import
              </Text>
              <ScrollView style={styles.tableScroll} horizontal>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title style={styles.symbolColumn}>
                      Symbol
                    </DataTable.Title>
                    <DataTable.Title numeric style={styles.numberColumn}>
                      Quantity
                    </DataTable.Title>
                    <DataTable.Title numeric style={styles.numberColumn}>
                      Price
                    </DataTable.Title>
                    <DataTable.Title numeric style={styles.numberColumn}>
                      Total Cost
                    </DataTable.Title>
                    <DataTable.Title style={styles.dateColumn}>
                      Date
                    </DataTable.Title>
                  </DataTable.Header>

                  <ScrollView style={styles.tableBody}>
                    {positions.map((position, index) => {
                      const totalCost = position.quantity * position.purchasePrice;
                      return (
                        <DataTable.Row key={`${position.symbol}-${index}`}>
                          <DataTable.Cell style={styles.symbolColumn}>
                            <Text variant="bodyMedium" style={styles.symbolText}>
                              {position.symbol}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={styles.numberColumn}>
                            {position.quantity}
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={styles.numberColumn}>
                            {position.purchasePrice.toFixed(2)}
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={styles.numberColumn}>
                            {totalCost.toFixed(2)}
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.dateColumn}>
                            {formatDate(position.purchaseDate)}
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    })}
                  </ScrollView>
                </DataTable>
              </ScrollView>
            </>
          )}

          {/* No Data Message */}
          {positions.length === 0 && !hasErrors && (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No positions found in the file
              </Text>
            </View>
          )}
        </Card.Content>

        {/* Action Buttons */}
        <Card.Actions style={styles.actions}>
          <Button mode="outlined" onPress={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            disabled={!canConfirm || loading}
            loading={loading}
            style={[
              styles.confirmButton,
              !canConfirm && styles.confirmButtonDisabled,
            ]}
          >
            Import {positions.length} Position{positions.length !== 1 ? 's' : ''}
          </Button>
        </Card.Actions>
      </Card>
    );
  }
);

/**
 * Formats date for display
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

const styles = StyleSheet.create({
  card: {
    margin: SPACING.md,
    elevation: 4,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  fileChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
  },
  fileChipText: {
    fontSize: 12,
  },
  divider: {
    marginVertical: SPACING.md,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  errorSection: {
    backgroundColor: COLORS.errorLight,
    padding: SPACING.md,
    borderRadius: 8,
    maxHeight: 150,
  },
  errorTitle: {
    color: COLORS.error,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  errorList: {
    maxHeight: 100,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  tableScroll: {
    maxHeight: 300,
  },
  tableBody: {
    maxHeight: 250,
  },
  symbolColumn: {
    minWidth: 80,
  },
  numberColumn: {
    minWidth: 80,
  },
  dateColumn: {
    minWidth: 100,
  },
  symbolText: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  emptyState: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.disabled,
  },
});

ImportPreview.displayName = 'ImportPreview';
