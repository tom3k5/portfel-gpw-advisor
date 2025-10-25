import { parseCSV, validateCSVFile, generateSampleCSV } from '../csvImport';

describe('csvImport', () => {
  describe('parseCSV', () => {
    it('should parse valid CSV data', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,45.50,2024-01-15
JSW,50,32.00,2024-02-20
CDR,200,150.75,2024-03-10`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.positions).toHaveLength(3);
      expect(result.errors).toHaveLength(0);

      expect(result.positions[0]).toEqual({
        symbol: 'PKN',
        quantity: 100,
        purchasePrice: 45.5,
        currentPrice: 45.5,
        purchaseDate: new Date('2024-01-15'),
      });
    });

    it('should handle empty CSV content', () => {
      const result = parseCSV('');

      expect(result.success).toBe(false);
      expect(result.positions).toHaveLength(0);
      expect(result.errors).toContain('CSV file is empty');
    });

    it('should handle CSV with only headers', () => {
      const csv = 'Symbol,Quantity,PurchasePrice,PurchaseDate';

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.positions).toHaveLength(0);
      expect(result.errors).toContain('No valid data found in CSV file');
    });

    it('should validate symbol format', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PK,100,45.50,2024-01-15
TOOLONG,50,32.00,2024-02-20
pk123,200,150.75,2024-03-10`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors[0]).toContain('Invalid symbol "PK"');
      expect(result.errors[1]).toContain('Invalid symbol "TOOLONG"');
      expect(result.errors[2]).toContain('Invalid symbol "pk123"');
    });

    it('should validate quantity is positive integer', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,0,45.50,2024-01-15
JSW,-10,32.00,2024-02-20
CDR,10.5,150.75,2024-03-10
PZU,abc,50.00,2024-04-01`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors[0]).toContain('Invalid quantity "0"');
      expect(result.errors[1]).toContain('Invalid quantity "-10"');
      expect(result.errors[2]).toContain('Invalid quantity "10.5"');
      expect(result.errors[3]).toContain('Invalid quantity "abc"');
    });

    it('should validate purchase price is positive number', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,0,2024-01-15
JSW,50,-10.5,2024-02-20
CDR,200,abc,2024-03-10`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors[0]).toContain('Invalid purchase price "0"');
      expect(result.errors[1]).toContain('Invalid purchase price "-10.5"');
      expect(result.errors[2]).toContain('Invalid purchase price "abc"');
    });

    it('should validate date format', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,45.50,2024/01/15
JSW,50,32.00,15-01-2024
CDR,200,150.75,invalid-date
PZU,75,50.00,2999-01-01`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(4);
      expect(result.errors[0]).toContain('Invalid date "2024/01/15"');
      expect(result.errors[1]).toContain('Invalid date "15-01-2024"');
      expect(result.errors[2]).toContain('Invalid date "invalid-date"');
      expect(result.errors[3]).toContain('Purchase date cannot be in the future');
    });

    it('should handle missing required fields', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,,2024-01-15
,50,32.00,2024-02-20
CDR,200,150.75,`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors[0]).toContain('Missing required fields');
      expect(result.errors[1]).toContain('Missing required fields');
      expect(result.errors[2]).toContain('Missing required fields');
    });

    it('should trim whitespace from fields', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
  PKN  ,  100  ,  45.50  ,  2024-01-15  `;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.positions[0].symbol).toBe('PKN');
      expect(result.positions[0].quantity).toBe(100);
      expect(result.positions[0].purchasePrice).toBe(45.5);
    });

    it('should handle partial success (some valid, some invalid rows)', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,45.50,2024-01-15
INVALID,abc,xyz,bad-date
JSW,50,32.00,2024-02-20`;

      const result = parseCSV(csv);

      expect(result.success).toBe(false);
      expect(result.positions).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.positions[0].symbol).toBe('PKN');
      expect(result.positions[1].symbol).toBe('JSW');
    });

    it('should convert symbol to uppercase', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
pkn,100,45.50,2024-01-15`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.positions[0].symbol).toBe('PKN');
    });

    it('should set currentPrice to purchasePrice initially', () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,45.50,2024-01-15`;

      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.positions[0].currentPrice).toBe(45.5);
      expect(result.positions[0].purchasePrice).toBe(45.5);
    });
  });

  describe('validateCSVFile', () => {
    it('should validate string content', async () => {
      const csv = `Symbol,Quantity,PurchasePrice,PurchaseDate
PKN,100,45.50,2024-01-15`;

      const result = await validateCSVFile(csv);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject empty string', async () => {
      const result = await validateCSVFile('');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('File does not appear to be a valid CSV');
    });

    it('should reject non-CSV content', async () => {
      const result = await validateCSVFile('Just some text without commas or newlines');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('File does not appear to be a valid CSV');
    });
  });

  describe('generateSampleCSV', () => {
    it('should generate valid sample CSV', () => {
      const csv = generateSampleCSV();

      expect(csv).toContain('Symbol,Quantity,PurchasePrice,PurchaseDate');
      expect(csv).toContain('PKN,100,45.50,2024-01-15');
      expect(csv).toContain('JSW,50,32.00,2024-02-20');
      expect(csv).toContain('CDR,200,150.75,2024-03-10');
    });

    it('should generate parseable CSV', () => {
      const csv = generateSampleCSV();
      const result = parseCSV(csv);

      expect(result.success).toBe(true);
      expect(result.positions).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
    });
  });
});
