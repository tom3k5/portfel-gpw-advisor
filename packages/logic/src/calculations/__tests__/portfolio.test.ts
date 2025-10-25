import type { Position } from '../../types/portfolio';
import {
  calculatePnL,
  calculatePnLPercent,
  calculatePositionValue,
  calculatePortfolioValue,
  calculatePortfolioSummary,
} from '../portfolio';

describe('calculatePnL', () => {
  it('returns positive value when price increases', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKN',
      quantity: 100,
      purchasePrice: 50,
      currentPrice: 60,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act
    const result = calculatePnL(position);

    // Assert
    expect(result).toBe(1000);
  });

  it('returns negative value when price decreases', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKO',
      quantity: 50,
      purchasePrice: 40,
      currentPrice: 35,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act
    const result = calculatePnL(position);

    // Assert
    expect(result).toBe(-250);
  });

  it('returns zero when price unchanged', () => {
    // Arrange
    const position: Position = {
      symbol: 'PZU',
      quantity: 100,
      purchasePrice: 30,
      currentPrice: 30,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act
    const result = calculatePnL(position);

    // Assert
    expect(result).toBe(0);
  });

  it('throws error when quantity is invalid', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKN',
      quantity: 0,
      purchasePrice: 50,
      currentPrice: 60,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act & Assert
    expect(() => calculatePnL(position)).toThrow('Invalid quantity');
  });
});

describe('calculatePnLPercent', () => {
  it('calculates percentage gain correctly', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKN',
      quantity: 100,
      purchasePrice: 50,
      currentPrice: 60,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act
    const result = calculatePnLPercent(position);

    // Assert
    expect(result).toBe(20);
  });

  it('calculates percentage loss correctly', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKO',
      quantity: 50,
      purchasePrice: 40,
      currentPrice: 30,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act
    const result = calculatePnLPercent(position);

    // Assert
    expect(result).toBe(-25);
  });

  it('throws error when purchase price is invalid', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKN',
      quantity: 100,
      purchasePrice: 0,
      currentPrice: 60,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act & Assert
    expect(() => calculatePnLPercent(position)).toThrow('Invalid purchase price');
  });
});

describe('calculatePositionValue', () => {
  it('calculates current position value', () => {
    // Arrange
    const position: Position = {
      symbol: 'PKN',
      quantity: 100,
      purchasePrice: 50,
      currentPrice: 60,
      purchaseDate: new Date('2024-01-01'),
    };

    // Act
    const result = calculatePositionValue(position);

    // Assert
    expect(result).toBe(6000);
  });
});

describe('calculatePortfolioValue', () => {
  it('calculates total portfolio value', () => {
    // Arrange
    const positions: Position[] = [
      {
        symbol: 'PKN',
        quantity: 100,
        purchasePrice: 50,
        currentPrice: 60,
        purchaseDate: new Date('2024-01-01'),
      },
      {
        symbol: 'PKO',
        quantity: 50,
        purchasePrice: 40,
        currentPrice: 35,
        purchaseDate: new Date('2024-01-01'),
      },
    ];

    // Act
    const result = calculatePortfolioValue(positions);

    // Assert
    expect(result).toBe(7750); // 6000 + 1750
  });

  it('returns 0 for empty portfolio', () => {
    // Arrange
    const positions: Position[] = [];

    // Act
    const result = calculatePortfolioValue(positions);

    // Assert
    expect(result).toBe(0);
  });
});

describe('calculatePortfolioSummary', () => {
  it('calculates complete portfolio summary', () => {
    // Arrange
    const positions: Position[] = [
      {
        symbol: 'PKN',
        quantity: 100,
        purchasePrice: 50,
        currentPrice: 60,
        purchaseDate: new Date('2024-01-01'),
      },
      {
        symbol: 'PKO',
        quantity: 50,
        purchasePrice: 40,
        currentPrice: 35,
        purchaseDate: new Date('2024-01-01'),
      },
    ];

    // Act
    const result = calculatePortfolioSummary(positions);

    // Assert
    expect(result.totalCost).toBe(7000); // 5000 + 2000
    expect(result.totalValue).toBe(7750); // 6000 + 1750
    expect(result.totalPnL).toBe(750); // 1000 - 250
    expect(result.totalPnLPercent).toBeCloseTo(10.71, 2);
    expect(result.positions).toHaveLength(2);
  });
});
