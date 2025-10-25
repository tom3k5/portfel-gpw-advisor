import Papa from 'papaparse';
import type { Position } from '../types';

/**
 * Result of CSV import operation
 */
export interface CSVImportResult {
  success: boolean;
  positions: Position[];
  errors: string[];
}

/**
 * Expected CSV row structure
 */
interface CSVRow {
  Symbol: string;
  Quantity: string;
  PurchasePrice: string;
  PurchaseDate: string;
}

/**
 * Validates a single position from CSV
 * @param row CSV row data
 * @param rowIndex Row number (for error messages)
 * @returns Validation error or null if valid
 */
function validateRow(row: CSVRow, rowIndex: number): string | null {
  // Check required fields
  if (!row.Symbol || !row.Quantity || !row.PurchasePrice || !row.PurchaseDate) {
    return `Row ${rowIndex + 1}: Missing required fields`;
  }

  // Validate symbol (uppercase letters only)
  if (!/^[A-Z]{3,5}$/.test(row.Symbol.trim().toUpperCase())) {
    return `Row ${rowIndex + 1}: Invalid symbol "${row.Symbol}" (must be 3-5 uppercase letters)`;
  }

  // Validate quantity (positive integer)
  const quantity = parseInt(row.Quantity.trim());
  if (isNaN(quantity) || quantity <= 0 || quantity !== parseFloat(row.Quantity.trim())) {
    return `Row ${rowIndex + 1}: Invalid quantity "${row.Quantity}" (must be positive number)`;
  }

  // Validate purchase price (positive number)
  const price = parseFloat(row.PurchasePrice.trim());
  if (isNaN(price) || price <= 0) {
    return `Row ${rowIndex + 1}: Invalid purchase price "${row.PurchasePrice}" (must be positive number)`;
  }

  // Validate date (YYYY-MM-DD format)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(row.PurchaseDate.trim())) {
    return `Row ${rowIndex + 1}: Invalid date "${row.PurchaseDate}" (must be YYYY-MM-DD)`;
  }

  const date = new Date(row.PurchaseDate.trim());
  if (isNaN(date.getTime())) {
    return `Row ${rowIndex + 1}: Invalid date "${row.PurchaseDate}"`;
  }

  // Check if date is not in the future
  if (date > new Date()) {
    return `Row ${rowIndex + 1}: Purchase date cannot be in the future`;
  }

  return null;
}

/**
 * Converts CSV row to Position object
 * @param row CSV row data
 * @returns Position object
 */
function rowToPosition(row: CSVRow): Position {
  return {
    symbol: row.Symbol.trim().toUpperCase(),
    quantity: parseInt(row.Quantity.trim()),
    purchasePrice: parseFloat(row.PurchasePrice.trim()),
    currentPrice: parseFloat(row.PurchasePrice.trim()), // Will be updated by API later
    purchaseDate: new Date(row.PurchaseDate.trim()),
  };
}

/**
 * Parses CSV string and converts to Position array
 * @param csvContent CSV file content as string
 * @returns Import result with positions or errors
 *
 * @example
 * ```typescript
 * const result = parseCSV(csvContent);
 * if (result.success) {
 *   console.log('Imported:', result.positions);
 * } else {
 *   console.error('Errors:', result.errors);
 * }
 * ```
 */
export function parseCSV(csvContent: string): CSVImportResult {
  const errors: string[] = [];
  const positions: Position[] = [];

  // Check if content is empty
  if (!csvContent || csvContent.trim().length === 0) {
    return {
      success: false,
      positions: [],
      errors: ['CSV file is empty'],
    };
  }

  // Parse CSV
  const parseResult = Papa.parse<CSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  // Check for parsing errors
  if (parseResult.errors.length > 0) {
    parseResult.errors.forEach((error) => {
      errors.push(`Parse error: ${error.message}`);
    });
  }

  // Check if we have any data
  if (parseResult.data.length === 0) {
    return {
      success: false,
      positions: [],
      errors: ['No valid data found in CSV file'],
    };
  }

  // Validate and convert each row
  parseResult.data.forEach((row, index) => {
    const validationError = validateRow(row, index);
    if (validationError) {
      errors.push(validationError);
    } else {
      positions.push(rowToPosition(row));
    }
  });

  return {
    success: errors.length === 0 && positions.length > 0,
    positions,
    errors,
  };
}

/**
 * Validates CSV file before parsing
 * @param file File object (browser) or string content
 * @returns Promise with validation result
 */
export async function validateCSVFile(file: File | string): Promise<{
  valid: boolean;
  error?: string;
}> {
  try {
    let content: string;

    if (typeof file === 'string') {
      content = file;
    } else {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return { valid: false, error: 'File size exceeds 5MB limit' };
      }

      // Check file extension
      if (!file.name.toLowerCase().endsWith('.csv')) {
        return { valid: false, error: 'File must be a CSV file' };
      }

      // Read file content
      content = await file.text();
    }

    // Check if content looks like CSV
    if (!content.includes(',') && !content.includes('\n')) {
      return { valid: false, error: 'File does not appear to be a valid CSV' };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Failed to read file',
    };
  }
}

/**
 * Generates sample CSV content for download
 * @returns Sample CSV string
 */
export function generateSampleCSV(): string {
  const header = 'Symbol,Quantity,PurchasePrice,PurchaseDate';
  const rows = [
    'PKN,100,45.50,2024-01-15',
    'JSW,50,32.00,2024-02-20',
    'CDR,200,150.75,2024-03-10',
  ];
  return [header, ...rows].join('\n');
}
