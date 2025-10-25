import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme } from 'victory-native';

import { colors, spacing } from '../theme';

interface DataPoint {
  date: Date;
  value: number;
}

interface StockChartProps {
  data: DataPoint[];
  title?: string;
  showArea?: boolean;
}

type TimeRange = '1M' | '3M' | '6M' | '1Y' | 'ALL';

/**
 * StockChart component displays price/value history using Victory charts
 *
 * Features:
 * - Line or area chart
 * - Multiple time ranges (1M, 3M, 6M, 1Y, ALL)
 * - Responsive sizing
 * - Color-coded for gains/losses
 * - Formatted axes
 *
 * @example
 * <StockChart
 *   data={priceHistory}
 *   title="Portfolio Value"
 *   showArea={true}
 * />
 */
export const StockChart: React.FC<StockChartProps> = ({
  data,
  title,
  showArea = false,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('3M');

  const filteredData = React.useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    const now = new Date();
    const cutoffDate = new Date();

    switch (timeRange) {
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
        return data;
    }

    return data.filter((point) => point.date >= cutoffDate);
  }, [data, timeRange]);

  const chartData = filteredData.map((point) => ({
    x: point.date.getTime(),
    y: point.value,
  }));

  const isPositive =
    chartData.length >= 2 &&
    chartData[chartData.length - 1]!.y >= chartData[0]!.y;

  const chartColor = isPositive ? colors.positive : colors.negative;

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = Math.min(screenWidth - spacing.lg * 2, 600);

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text variant="bodyLarge" style={styles.emptyText}>
          No chart data available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
      )}

      <SegmentedButtons
        value={timeRange}
        onValueChange={(value) => setTimeRange(value as TimeRange)}
        buttons={[
          { value: '1M', label: '1M' },
          { value: '3M', label: '3M' },
          { value: '6M', label: '6M' },
          { value: '1Y', label: '1Y' },
          { value: 'ALL', label: 'ALL' },
        ]}
        style={styles.segmentedButtons}
      />

      <View style={styles.chartContainer}>
        <VictoryChart
          width={chartWidth}
          height={250}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 60, right: 20 }}
        >
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fontSize: 10, fill: colors.textSecondary },
              grid: { stroke: colors.chart.grid, strokeDasharray: '4,4' },
            }}
            tickFormat={(value: number) => `${value.toFixed(0)}`}
          />
          <VictoryAxis
            style={{
              axis: { stroke: colors.border },
              tickLabels: { fontSize: 10, fill: colors.textSecondary },
              grid: { stroke: 'transparent' },
            }}
            tickFormat={(timestamp: number) => {
              const date = new Date(timestamp);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />

          {showArea && (
            <VictoryArea
              data={chartData}
              style={{
                data: {
                  fill: `${chartColor}20`,
                  stroke: chartColor,
                  strokeWidth: 2,
                },
              }}
              interpolation="monotoneX"
            />
          )}

          <VictoryLine
            data={chartData}
            style={{
              data: {
                stroke: chartColor,
                strokeWidth: 2,
              },
            }}
            interpolation="monotoneX"
          />
        </VictoryChart>

        {chartData.length >= 2 && (
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text variant="bodySmall" style={styles.statLabel}>
                Start
              </Text>
              <Text variant="bodyMedium" style={styles.statValue}>
                {chartData[0]!.y.toFixed(2)} PLN
              </Text>
            </View>
            <View style={styles.stat}>
              <Text variant="bodySmall" style={styles.statLabel}>
                Current
              </Text>
              <Text variant="bodyMedium" style={[styles.statValue, { color: chartColor }]}>
                {chartData[chartData.length - 1]!.y.toFixed(2)} PLN
              </Text>
            </View>
            <View style={styles.stat}>
              <Text variant="bodySmall" style={styles.statLabel}>
                Change
              </Text>
              <Text variant="bodyMedium" style={[styles.statValue, { color: chartColor }]}>
                {isPositive ? '+' : ''}
                {(
                  ((chartData[chartData.length - 1]!.y - chartData[0]!.y) /
                    chartData[0]!.y) *
                  100
                ).toFixed(2)}
                %
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  segmentedButtons: {
    marginBottom: spacing.md,
  },
  chartContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
