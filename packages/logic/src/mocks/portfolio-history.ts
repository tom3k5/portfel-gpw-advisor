/**
 * Mock portfolio history data for development and testing
 */

export interface PortfolioHistoryPoint {
  date: Date;
  value: number;
}

/**
 * Generate mock portfolio history for the last 12 months
 * Simulates realistic portfolio growth with volatility
 */
export function generateMockPortfolioHistory(
  startValue: number = 7000,
  months: number = 12
): PortfolioHistoryPoint[] {
  const history: PortfolioHistoryPoint[] = [];
  const now = new Date();
  let currentValue = startValue;

  // Generate daily data points for the specified months
  const daysToGenerate = months * 30;

  for (let i = daysToGenerate; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate daily volatility (±0.5% to ±2%)
    const dailyChange = (Math.random() - 0.5) * 0.04;
    currentValue *= 1 + dailyChange;

    // Add general upward trend (+0.02% daily average = ~7.3% annually)
    currentValue *= 1.0002;

    history.push({
      date,
      value: Math.round(currentValue * 100) / 100,
    });
  }

  return history;
}

/**
 * Mock portfolio history with realistic data
 * Shows ~10.7% growth over 12 months
 */
export const MOCK_PORTFOLIO_HISTORY = generateMockPortfolioHistory(7000, 12);
