/**
 * Core portfolio types for Portfel GPW Advisor
 */

export interface Position {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'dividend';
  quantity: number;
  price: number;
  date: Date;
  commission?: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}
