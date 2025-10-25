import React, { useState } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Button, Text, IconButton } from 'react-native-paper';
import type { Position } from '@portfel/logic';
import { parseCSV, generateSampleCSV } from '@portfel/logic';
import { COLORS, SPACING } from '../theme';

/**
 * Props for CSVImportButton component
 */
export interface CSVImportButtonProps {
  /** Callback when CSV is successfully parsed */
  onImport: (positions: Position[], fileName: string) => void;
  /** Callback when import fails */
  onError?: (errors: string[]) => void;
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Show download sample button */
  showSampleDownload?: boolean;
}

/**
 * CSVImportButton - File picker and CSV parser for portfolio import
 *
 * Features:
 * - Cross-platform file picking (web: input, mobile: DocumentPicker)
 * - CSV validation and parsing
 * - Error handling with user feedback
 * - Sample CSV download
 * - Loading states
 *
 * @example
 * ```typescript
 * <CSVImportButton
 *   onImport={(positions, fileName) => {
 *     console.log(`Imported ${positions.length} from ${fileName}`);
 *   }}
 *   onError={(errors) => console.error(errors)}
 *   showSampleDownload={true}
 * />
 * ```
 */
export const CSVImportButton: React.FC<CSVImportButtonProps> = React.memo(
  ({ onImport, onError, loading = false, showSampleDownload = true }) => {
    const [processing, setProcessing] = useState(false);

    /**
     * Handles file selection on web platform
     */
    const handleWebFilePick = async () => {
      if (Platform.OS !== 'web') return;

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv,text/csv';

      input.onchange = async (e: any) => {
        const file = e.target?.files?.[0];
        if (!file) return;

        setProcessing(true);
        try {
          // Read file content
          const text = await file.text();

          // Parse CSV
          const result = parseCSV(text);

          if (result.success && result.positions.length > 0) {
            onImport(result.positions, file.name);
          } else {
            const errors = result.errors.length
              ? result.errors
              : ['No valid positions found in CSV'];

            if (Platform.OS === 'web') {
              alert(`Import failed:\n\n${errors.join('\n')}`);
            }

            onError?.(errors);
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to read file';
          if (Platform.OS === 'web') {
            alert(`Error: ${message}`);
          }
          onError?.([message]);
        } finally {
          setProcessing(false);
        }
      };

      input.click();
    };

    /**
     * Handles file selection on mobile platform
     * Note: Requires expo-document-picker to be imported in the app
     */
    const handleMobileFilePick = async () => {
      try {
        // Dynamic import to avoid errors on web
        const DocumentPicker = await import('expo-document-picker');

        setProcessing(true);

        const result = await DocumentPicker.getDocumentAsync({
          type: 'text/csv',
          copyToCacheDirectory: true,
        });

        if (result.canceled) {
          setProcessing(false);
          return;
        }

        const file = result.assets[0];

        // Read file content
        const response = await fetch(file.uri);
        const text = await response.text();

        // Parse CSV
        const parseResult = parseCSV(text);

        if (parseResult.success && parseResult.positions.length > 0) {
          onImport(parseResult.positions, file.name);
        } else {
          const errors = parseResult.errors.length
            ? parseResult.errors
            : ['No valid positions found in CSV'];

          Alert.alert('Import Failed', errors.join('\n'), [{ text: 'OK' }]);

          onError?.(errors);
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to pick file';

        Alert.alert('Error', message, [{ text: 'OK' }]);
        onError?.([message]);
      } finally {
        setProcessing(false);
      }
    };

    /**
     * Handles file picking based on platform
     */
    const handleFilePick = async () => {
      if (Platform.OS === 'web') {
        await handleWebFilePick();
      } else {
        await handleMobileFilePick();
      }
    };

    /**
     * Downloads sample CSV file
     */
    const handleDownloadSample = () => {
      if (Platform.OS === 'web') {
        const csv = generateSampleCSV();
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-sample.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // On mobile, show the sample format
        const csv = generateSampleCSV();
        Alert.alert('Sample CSV Format', csv, [{ text: 'OK' }]);
      }
    };

    const isLoading = loading || processing;

    return (
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={handleFilePick}
          loading={isLoading}
          disabled={isLoading}
          icon="file-upload"
          style={styles.button}
        >
          Import from CSV
        </Button>

        {showSampleDownload && (
          <View style={styles.sampleContainer}>
            <Text variant="bodySmall" style={styles.sampleText}>
              Don't have a CSV file?
            </Text>
            <Button
              mode="text"
              onPress={handleDownloadSample}
              disabled={isLoading}
              compact
            >
              Download Sample
            </Button>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    minWidth: 200,
    backgroundColor: COLORS.primary,
  },
  sampleContainer: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  sampleText: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});

CSVImportButton.displayName = 'CSVImportButton';
