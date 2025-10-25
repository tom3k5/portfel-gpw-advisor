import type { Position } from '../types';

/**
 * Storage key for portfolio data
 */
const PORTFOLIO_STORAGE_KEY = '@portfel/portfolio';

/**
 * Storage adapter interface for cross-platform compatibility
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Default storage adapter (uses localStorage for web)
 */
class LocalStorageAdapter implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
}

/**
 * Portfolio storage manager
 */
export class PortfolioStorage {
  private adapter: StorageAdapter;

  constructor(adapter?: StorageAdapter) {
    this.adapter = adapter || new LocalStorageAdapter();
  }

  /**
   * Serializes a Date object for storage
   */
  private serializePosition(position: Position): any {
    return {
      ...position,
      purchaseDate: position.purchaseDate.toISOString(),
    };
  }

  /**
   * Deserializes a position from storage
   */
  private deserializePosition(data: any): Position {
    return {
      ...data,
      purchaseDate: new Date(data.purchaseDate),
    };
  }

  /**
   * Loads portfolio from storage
   * @returns Array of positions or empty array if none found
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * const positions = await storage.loadPortfolio();
   * ```
   */
  async loadPortfolio(): Promise<Position[]> {
    try {
      const data = await this.adapter.getItem(PORTFOLIO_STORAGE_KEY);
      if (!data) {
        return [];
      }

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) {
        console.error('Invalid portfolio data format');
        return [];
      }

      return parsed.map((item) => this.deserializePosition(item));
    } catch (error) {
      console.error('Failed to load portfolio:', error);
      return [];
    }
  }

  /**
   * Saves entire portfolio to storage
   * @param positions Array of positions to save
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * await storage.savePortfolio(positions);
   * ```
   */
  async savePortfolio(positions: Position[]): Promise<boolean> {
    try {
      const serialized = positions.map((pos) => this.serializePosition(pos));
      await this.adapter.setItem(
        PORTFOLIO_STORAGE_KEY,
        JSON.stringify(serialized)
      );
      return true;
    } catch (error) {
      console.error('Failed to save portfolio:', error);
      return false;
    }
  }

  /**
   * Adds a new position to the portfolio
   * If a position with the same symbol exists, it will be merged (quantities added, avg price calculated)
   * @param position Position to add
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * await storage.addPosition({
   *   symbol: 'PKN',
   *   quantity: 100,
   *   purchasePrice: 50,
   *   currentPrice: 55,
   *   purchaseDate: new Date()
   * });
   * ```
   */
  async addPosition(position: Position): Promise<boolean> {
    try {
      const positions = await this.loadPortfolio();
      const existingIndex = positions.findIndex(
        (p) => p.symbol === position.symbol
      );

      if (existingIndex >= 0) {
        // Merge with existing position (calculate new average price)
        const existing = positions[existingIndex];
        const totalCost =
          existing.purchasePrice * existing.quantity +
          position.purchasePrice * position.quantity;
        const totalQuantity = existing.quantity + position.quantity;

        positions[existingIndex] = {
          ...existing,
          quantity: totalQuantity,
          purchasePrice: totalCost / totalQuantity,
          currentPrice: position.currentPrice, // Update to latest price
          // Keep earlier purchase date
          purchaseDate:
            existing.purchaseDate < position.purchaseDate
              ? existing.purchaseDate
              : position.purchaseDate,
        };
      } else {
        // Add new position
        positions.push(position);
      }

      return await this.savePortfolio(positions);
    } catch (error) {
      console.error('Failed to add position:', error);
      return false;
    }
  }

  /**
   * Removes a position from the portfolio
   * @param symbol Stock symbol to remove
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * await storage.removePosition('PKN');
   * ```
   */
  async removePosition(symbol: string): Promise<boolean> {
    try {
      const positions = await this.loadPortfolio();
      const filtered = positions.filter((p) => p.symbol !== symbol);
      return await this.savePortfolio(filtered);
    } catch (error) {
      console.error('Failed to remove position:', error);
      return false;
    }
  }

  /**
   * Updates an existing position
   * @param symbol Stock symbol to update
   * @param updates Partial position data to update
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * await storage.updatePosition('PKN', {
   *   currentPrice: 60,
   *   quantity: 150
   * });
   * ```
   */
  async updatePosition(
    symbol: string,
    updates: Partial<Omit<Position, 'symbol'>>
  ): Promise<boolean> {
    try {
      const positions = await this.loadPortfolio();
      const index = positions.findIndex((p) => p.symbol === symbol);

      if (index < 0) {
        console.error(`Position ${symbol} not found`);
        return false;
      }

      positions[index] = {
        ...positions[index],
        ...updates,
      };

      return await this.savePortfolio(positions);
    } catch (error) {
      console.error('Failed to update position:', error);
      return false;
    }
  }

  /**
   * Clears all portfolio data from storage
   * @returns Success status
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * await storage.clearPortfolio();
   * ```
   */
  async clearPortfolio(): Promise<boolean> {
    try {
      await this.adapter.removeItem(PORTFOLIO_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear portfolio:', error);
      return false;
    }
  }

  /**
   * Gets a single position by symbol
   * @param symbol Stock symbol
   * @returns Position or null if not found
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * const position = await storage.getPosition('PKN');
   * ```
   */
  async getPosition(symbol: string): Promise<Position | null> {
    const positions = await this.loadPortfolio();
    return positions.find((p) => p.symbol === symbol) || null;
  }

  /**
   * Imports multiple positions (typically from CSV)
   * Merges with existing portfolio
   * @param positions Array of positions to import
   * @returns Object with success count and errors
   *
   * @example
   * ```typescript
   * const storage = new PortfolioStorage();
   * const result = await storage.importPositions(csvPositions);
   * console.log(`Imported ${result.imported} positions`);
   * ```
   */
  async importPositions(positions: Position[]): Promise<{
    imported: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let imported = 0;

    for (const position of positions) {
      const success = await this.addPosition(position);
      if (success) {
        imported++;
      } else {
        errors.push(`Failed to import ${position.symbol}`);
      }
    }

    return { imported, errors };
  }
}

/**
 * Default portfolio storage instance
 */
export const portfolioStorage = new PortfolioStorage();
