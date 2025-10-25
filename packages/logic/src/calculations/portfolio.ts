import type { Position, PortfolioSummary } from '../types/portfolio';

/**
 * Calculate profit/loss for a position
 *
 * @param position - The position to calculate P&L for
 * @returns The P&L in PLN (positive = profit, negative = loss)
 *
 * @example
 * const pnl = calculatePnL({
 *   symbol: 'PKN',
 *   quantity: 100,
 *   purchasePrice: 50,
 *   currentPrice: 60,
 *   purchaseDate: new Date()
 * });
 * console.log(pnl); // 1000
 */
export function calculatePnL(position: Position): number {
  if (position.quantity <= 0) {
    throw new Error('Invalid quantity: must be greater than 0');
  }

  const priceDiff = position.currentPrice - position.purchasePrice;
  return priceDiff * position.quantity;
}

/**
 * Calculate P&L percentage for a position
 */
export function calculatePnLPercent(position: Position): number {
  if (position.purchasePrice <= 0) {
    throw new Error('Invalid purchase price: must be greater than 0');
  }

  const pnl = calculatePnL(position);
  const totalCost = position.purchasePrice * position.quantity;
  return (pnl / totalCost) * 100;
}

/**
 * Calculate current value of a position
 */
export function calculatePositionValue(position: Position): number {
  return position.currentPrice * position.quantity;
}

/**
 * Calculate total portfolio value
 */
export function calculatePortfolioValue(positions: Position[]): number {
  return positions.reduce((sum, pos) => {
    return sum + calculatePositionValue(pos);
  }, 0);
}

/**
 * Calculate portfolio summary with all metrics
 */
export function calculatePortfolioSummary(positions: Position[]): PortfolioSummary {
  const totalCost = positions.reduce((sum, pos) => {
    return sum + pos.purchasePrice * pos.quantity;
  }, 0);

  const totalValue = calculatePortfolioValue(positions);
  const totalPnL = totalValue - totalCost;
  const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalPnL,
    totalPnLPercent,
    positions,
  };
}
