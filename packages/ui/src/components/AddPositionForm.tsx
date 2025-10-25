import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  TextInput,
  Button,
  HelperText,
  Text,
  useTheme,
} from 'react-native-paper';
import type { Position } from '@portfel/logic';
import { COLORS, SPACING } from '../theme';

/**
 * Form data for adding a position
 */
export interface PositionFormData {
  symbol: string;
  quantity: string;
  purchasePrice: string;
  purchaseDate: string;
}

/**
 * Props for AddPositionForm component
 */
export interface AddPositionFormProps {
  /** Callback when form is submitted with valid data */
  onSubmit: (position: Position) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Whether the form is currently submitting */
  loading?: boolean;
  /** Initial form data (for editing) */
  initialData?: Partial<PositionFormData>;
}

/**
 * Form validation errors
 */
interface FormErrors {
  symbol?: string;
  quantity?: string;
  purchasePrice?: string;
  purchaseDate?: string;
}

/**
 * AddPositionForm - Manual portfolio position entry form
 *
 * Features:
 * - Input validation with error messages
 * - Support for web (input type="date") and mobile (text input with format hint)
 * - Real-time validation on blur
 * - Accessible form with proper labels
 * - Loading state during submission
 *
 * @example
 * ```typescript
 * <AddPositionForm
 *   onSubmit={(position) => {
 *     console.log('New position:', position);
 *   }}
 *   onCancel={() => setShowForm(false)}
 * />
 * ```
 */
export const AddPositionForm: React.FC<AddPositionFormProps> = React.memo(
  ({ onSubmit, onCancel, loading = false, initialData }) => {
    const theme = useTheme();

    // Form state
    const [formData, setFormData] = useState<PositionFormData>({
      symbol: initialData?.symbol || '',
      quantity: initialData?.quantity || '',
      purchasePrice: initialData?.purchasePrice || '',
      purchaseDate: initialData?.purchaseDate || formatDate(new Date()),
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    /**
     * Validates symbol field
     */
    const validateSymbol = (value: string): string | undefined => {
      if (!value.trim()) {
        return 'Symbol is required';
      }
      if (!/^[A-Z]{3,5}$/.test(value.toUpperCase())) {
        return 'Symbol must be 3-5 uppercase letters';
      }
      return undefined;
    };

    /**
     * Validates quantity field
     */
    const validateQuantity = (value: string): string | undefined => {
      if (!value.trim()) {
        return 'Quantity is required';
      }
      const num = parseInt(value);
      if (isNaN(num) || num <= 0) {
        return 'Quantity must be a positive number';
      }
      if (num !== parseFloat(value)) {
        return 'Quantity must be a whole number';
      }
      return undefined;
    };

    /**
     * Validates purchase price field
     */
    const validatePurchasePrice = (value: string): string | undefined => {
      if (!value.trim()) {
        return 'Purchase price is required';
      }
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Purchase price must be a positive number';
      }
      return undefined;
    };

    /**
     * Validates purchase date field
     */
    const validatePurchaseDate = (value: string): string | undefined => {
      if (!value.trim()) {
        return 'Purchase date is required';
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(value)) {
        return 'Date must be in YYYY-MM-DD format';
      }
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      if (date > new Date()) {
        return 'Date cannot be in the future';
      }
      return undefined;
    };

    /**
     * Validates all form fields
     */
    const validateForm = (): boolean => {
      const newErrors: FormErrors = {
        symbol: validateSymbol(formData.symbol),
        quantity: validateQuantity(formData.quantity),
        purchasePrice: validatePurchasePrice(formData.purchasePrice),
        purchaseDate: validatePurchaseDate(formData.purchaseDate),
      };

      setErrors(newErrors);
      return Object.values(newErrors).every((error) => !error);
    };

    /**
     * Handles field blur event
     */
    const handleBlur = (field: keyof PositionFormData) => {
      setTouched({ ...touched, [field]: true });

      // Validate specific field
      const validators = {
        symbol: validateSymbol,
        quantity: validateQuantity,
        purchasePrice: validatePurchasePrice,
        purchaseDate: validatePurchaseDate,
      };

      const error = validators[field](formData[field]);
      setErrors({ ...errors, [field]: error });
    };

    /**
     * Handles form submission
     */
    const handleSubmit = () => {
      // Mark all fields as touched
      setTouched({
        symbol: true,
        quantity: true,
        purchasePrice: true,
        purchaseDate: true,
      });

      if (!validateForm()) {
        return;
      }

      // Convert form data to Position
      const position: Position = {
        symbol: formData.symbol.toUpperCase(),
        quantity: parseInt(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: parseFloat(formData.purchasePrice), // Will be updated by API
        purchaseDate: new Date(formData.purchaseDate),
      };

      onSubmit(position);
    };

    return (
      <View style={styles.container}>
        <Text variant="titleMedium" style={styles.title}>
          Add Position
        </Text>

        {/* Symbol Input */}
        <TextInput
          label="Symbol *"
          placeholder="PKN, JSW, CDR..."
          value={formData.symbol}
          onChangeText={(text) =>
            setFormData({ ...formData, symbol: text.toUpperCase() })
          }
          onBlur={() => handleBlur('symbol')}
          error={touched.symbol && !!errors.symbol}
          disabled={loading}
          autoCapitalize="characters"
          maxLength={5}
          style={styles.input}
        />
        {touched.symbol && errors.symbol && (
          <HelperText type="error" visible={true}>
            {errors.symbol}
          </HelperText>
        )}

        {/* Quantity Input */}
        <TextInput
          label="Quantity *"
          placeholder="100"
          value={formData.quantity}
          onChangeText={(text) => setFormData({ ...formData, quantity: text })}
          onBlur={() => handleBlur('quantity')}
          error={touched.quantity && !!errors.quantity}
          disabled={loading}
          keyboardType="numeric"
          style={styles.input}
        />
        {touched.quantity && errors.quantity && (
          <HelperText type="error" visible={true}>
            {errors.quantity}
          </HelperText>
        )}

        {/* Purchase Price Input */}
        <TextInput
          label="Purchase Price (PLN) *"
          placeholder="50.00"
          value={formData.purchasePrice}
          onChangeText={(text) =>
            setFormData({ ...formData, purchasePrice: text })
          }
          onBlur={() => handleBlur('purchasePrice')}
          error={touched.purchasePrice && !!errors.purchasePrice}
          disabled={loading}
          keyboardType="decimal-pad"
          style={styles.input}
        />
        {touched.purchasePrice && errors.purchasePrice && (
          <HelperText type="error" visible={true}>
            {errors.purchasePrice}
          </HelperText>
        )}

        {/* Purchase Date Input */}
        <TextInput
          label="Purchase Date *"
          placeholder="YYYY-MM-DD"
          value={formData.purchaseDate}
          onChangeText={(text) =>
            setFormData({ ...formData, purchaseDate: text })
          }
          onBlur={() => handleBlur('purchaseDate')}
          error={touched.purchaseDate && !!errors.purchaseDate}
          disabled={loading}
          style={styles.input}
        />
        {touched.purchaseDate && errors.purchaseDate && (
          <HelperText type="error" visible={true}>
            {errors.purchaseDate}
          </HelperText>
        )}
        {!errors.purchaseDate && (
          <HelperText type="info" visible={true}>
            Format: YYYY-MM-DD (e.g., 2024-01-15)
          </HelperText>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {onCancel && (
            <Button
              mode="outlined"
              onPress={onCancel}
              disabled={loading}
              style={styles.button}
            >
              Cancel
            </Button>
          )}
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={[styles.button, styles.submitButton]}
          >
            Add Position
          </Button>
        </View>
      </View>
    );
  }
);

/**
 * Formats a Date object as YYYY-MM-DD
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  title: {
    marginBottom: SPACING.md,
    fontWeight: '600',
  },
  input: {
    marginBottom: SPACING.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  button: {
    minWidth: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
  },
});

AddPositionForm.displayName = 'AddPositionForm';
