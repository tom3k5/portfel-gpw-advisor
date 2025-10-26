import React, { useState } from 'react';
import type { Position } from '@portfel/logic';
import { colors, spacing } from '../theme';

interface AddPositionFormProps {
  onSubmit: (position: Position) => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * AddPositionForm - Web version for manual position entry
 */
export const AddPositionForm: React.FC<AddPositionFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!symbol || symbol.trim().length < 3) {
      newErrors.symbol = 'Symbol must be at least 3 characters';
    }
    if (!quantity || parseInt(quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || loading) return;

    const position: Position = {
      symbol: symbol.trim().toUpperCase(),
      quantity: parseInt(quantity),
      purchasePrice: parseFloat(price),
      currentPrice: parseFloat(price),
      purchaseDate: new Date(date),
    };

    await onSubmit(position);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.field}>
        <label style={styles.label}>Symbol *</label>
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="e.g. PKN"
          style={{ ...styles.input, ...(errors.symbol ? styles.inputError : {}) }}
          disabled={loading}
        />
        {errors.symbol && <span style={styles.errorText}>{errors.symbol}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Quantity *</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Number of shares"
          style={{ ...styles.input, ...(errors.quantity ? styles.inputError : {}) }}
          disabled={loading}
        />
        {errors.quantity && <span style={styles.errorText}>{errors.quantity}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Purchase Price (PLN) *</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per share"
          style={{ ...styles.input, ...(errors.price ? styles.inputError : {}) }}
          disabled={loading}
        />
        {errors.price && <span style={styles.errorText}>{errors.price}</span>}
      </div>

      <div style={styles.field}>
        <label style={styles.label}>Purchase Date *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...styles.input, ...(errors.date ? styles.inputError : {}) }}
          disabled={loading}
        />
        {errors.date && <span style={styles.errorText}>{errors.date}</span>}
      </div>

      <div style={styles.buttonContainer}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelButton}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Position'}
        </button>
      </div>
    </form>
  );
};

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 8,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    padding: '10px 12px',
    fontSize: 14,
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  buttonContainer: {
    display: 'flex',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    backgroundColor: 'white',
    color: colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: 14,
    fontWeight: '600',
    border: 'none',
    borderRadius: 6,
    backgroundColor: colors.primary,
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
