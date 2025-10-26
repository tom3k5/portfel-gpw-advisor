import React, { useState } from 'react';

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
 * StockChart component displays price/value history (Web version - simplified)
 */
export const StockChart: React.FC<StockChartProps> = React.memo(({
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
    chartData[chartData.length - 1].y >= chartData[0].y;

  const chartColor = isPositive ? colors.positive : colors.negative;

  // Calculate min and max for scaling
  const values = chartData.map(d => d.y);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;

  // Create SVG path
  const width = 800;
  const height = 300;
  const padding = 40;

  const points = chartData.map((point, index) => {
    const x = padding + (index / (chartData.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((point.y - minValue) / valueRange) * (height - 2 * padding);
    return { x, y };
  });

  const linePath = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  const areaPath = showArea && points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : linePath;

  const startValue = chartData.length > 0 ? chartData[0].y : 0;
  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].y : 0;
  const changePercent = startValue > 0 ? ((currentValue - startValue) / startValue * 100) : 0;

  return (
    <div style={styles.container}>
      {title && <h3 style={styles.title}>{title}</h3>}

      <div style={styles.statsContainer}>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Start:</span>
          <span style={styles.statValue}>{startValue.toFixed(2)} PLN</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Current:</span>
          <span style={styles.statValue}>{currentValue.toFixed(2)} PLN</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.statLabel}>Change:</span>
          <span style={{ ...styles.statValue, color: chartColor }}>
            {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <svg width={width} height={height} style={styles.svg}>
          {/* Area fill */}
          {showArea && (
            <path
              d={areaPath}
              fill={`${chartColor}20`}
              stroke="none"
            />
          )}
          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
          />
          {/* Axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke={colors.border}
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke={colors.border}
            strokeWidth="1"
          />
        </svg>
      </div>

      <div style={styles.timeRangeButtons}>
        {(['1M', '3M', '6M', '1Y', 'ALL'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              ...styles.rangeButton,
              ...(timeRange === range ? styles.rangeButtonActive : {}),
            }}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.lg,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
    margin: 0,
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflowX: 'auto',
  },
  svg: {
    maxWidth: '100%',
    height: 'auto',
  },
  timeRangeButtons: {
    display: 'flex',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  rangeButton: {
    padding: '8px 16px',
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  rangeButtonActive: {
    backgroundColor: colors.primary,
    color: 'white',
    borderColor: colors.primary,
  },
};
