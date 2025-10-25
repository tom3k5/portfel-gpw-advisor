import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, Divider, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import {
  AddPositionForm,
  CSVImportButton,
  ImportPreview,
  COLORS,
  SPACING,
} from '@portfel/ui';
import type { Position } from '@portfel/logic';
import { portfolioStorage, PortfolioStorage } from '@portfel/logic';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage adapter for mobile
 */
class AsyncStorageAdapter {
  async getItem(key: string): Promise<string | null> {
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

// Create storage instance with AsyncStorage
const storage = new PortfolioStorage(new AsyncStorageAdapter());

/**
 * ImportScreen - Mobile screen for importing portfolio data
 *
 * Features:
 * - Manual position entry via form
 * - CSV file import with preview
 * - Validation and error handling
 * - Success/error feedback
 * - Navigation back to dashboard
 */
export default function ImportScreen() {
  const router = useRouter();

  // State
  const [showForm, setShowForm] = useState(false);
  const [previewData, setPreviewData] = useState<{
    positions: Position[];
    fileName: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  /**
   * Handles manual position submission
   */
  const handleAddPosition = async (position: Position) => {
    setLoading(true);
    try {
      const success = await storage.addPosition(position);

      if (success) {
        setSnackbar({
          visible: true,
          message: `${position.symbol} added successfully!`,
          type: 'success',
        });
        setShowForm(false);

        // Navigate back to dashboard after a delay
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        throw new Error('Failed to save position');
      }
    } catch (error) {
      setSnackbar({
        visible: true,
        message: 'Failed to add position. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles CSV import
   */
  const handleCSVImport = (positions: Position[], fileName: string) => {
    setPreviewData({ positions, fileName });
  };

  /**
   * Handles CSV import error
   */
  const handleCSVError = (errors: string[]) => {
    Alert.alert(
      'Import Failed',
      errors.join('\n'),
      [{ text: 'OK' }]
    );
  };

  /**
   * Confirms and saves imported positions
   */
  const handleConfirmImport = async () => {
    if (!previewData) return;

    setLoading(true);
    try {
      const result = await storage.importPositions(previewData.positions);

      if (result.imported > 0) {
        setSnackbar({
          visible: true,
          message: `Imported ${result.imported} position${result.imported !== 1 ? 's' : ''} successfully!`,
          type: 'success',
        });
        setPreviewData(null);

        // Navigate back to dashboard after a delay
        setTimeout(() => {
          router.back();
        }, 1500);
      }

      if (result.errors.length > 0) {
        Alert.alert(
          'Partial Import',
          `${result.imported} positions imported. Errors:\n${result.errors.join('\n')}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      setSnackbar({
        visible: true,
        message: 'Failed to import positions. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancels import preview
   */
  const handleCancelImport = () => {
    setPreviewData(null);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Import Portfolio
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Add positions manually or import from CSV
          </Text>
        </View>

        {/* Preview Mode */}
        {previewData && (
          <ImportPreview
            positions={previewData.positions}
            fileName={previewData.fileName}
            onConfirm={handleConfirmImport}
            onCancel={handleCancelImport}
            loading={loading}
          />
        )}

        {/* Normal Mode */}
        {!previewData && (
          <>
            {/* CSV Import Section */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Import from CSV
              </Text>
              <Text variant="bodySmall" style={styles.sectionDescription}>
                Upload a CSV file with your portfolio positions
              </Text>
              <CSVImportButton
                onImport={handleCSVImport}
                onError={handleCSVError}
                loading={loading}
                showSampleDownload={true}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Manual Entry Section */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Add Manually
              </Text>
              <Text variant="bodySmall" style={styles.sectionDescription}>
                Enter position details one at a time
              </Text>

              {!showForm ? (
                <Button
                  mode="outlined"
                  onPress={() => setShowForm(true)}
                  icon="plus"
                  style={styles.showFormButton}
                >
                  Add Position
                </Button>
              ) : (
                <AddPositionForm
                  onSubmit={handleAddPosition}
                  onCancel={() => setShowForm(false)}
                  loading={loading}
                />
              )}
            </View>
          </>
        )}

        {/* Back Button */}
        {!previewData && !showForm && (
          <View style={styles.footer}>
            <Button
              mode="text"
              onPress={() => router.back()}
              icon="arrow-left"
            >
              Back to Dashboard
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Snackbar for feedback */}
      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbar({ ...snackbar, visible: false }),
        }}
        style={[
          snackbar.type === 'error' && styles.snackbarError,
          snackbar.type === 'success' && styles.snackbarSuccess,
        ]}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  sectionDescription: {
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  divider: {
    marginVertical: SPACING.xl,
  },
  showFormButton: {
    alignSelf: 'flex-start',
  },
  footer: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  snackbarError: {
    backgroundColor: COLORS.error,
  },
  snackbarSuccess: {
    backgroundColor: COLORS.success,
  },
});
