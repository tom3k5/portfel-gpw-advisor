'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AddPositionForm,
  CSVImportButton,
  ImportPreview,
} from '@portfel/ui';
import { colors, spacing } from '@portfel/ui';
import type { Position } from '@portfel/logic';
import { portfolioStorage } from '@portfel/logic';

/**
 * ImportPage - Web page for importing portfolio data
 *
 * Features:
 * - Manual position entry via form
 * - CSV file import with preview
 * - Validation and error handling
 * - Success/error feedback
 * - Navigation back to dashboard
 */
export default function ImportPage() {
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
      const success = await portfolioStorage.addPosition(position);

      if (success) {
        setSnackbar({
          visible: true,
          message: `${position.symbol} added successfully!`,
          type: 'success',
        });
        setShowForm(false);

        // Navigate back to dashboard after a delay
        setTimeout(() => {
          router.push('/');
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
    alert(`Import Failed:\n\n${errors.join('\n')}`);
  };

  /**
   * Confirms and saves imported positions
   */
  const handleConfirmImport = async () => {
    if (!previewData) return;

    setLoading(true);
    try {
      const result = await portfolioStorage.importPositions(previewData.positions);

      if (result.imported > 0) {
        setSnackbar({
          visible: true,
          message: `Imported ${result.imported} position${result.imported !== 1 ? 's' : ''} successfully!`,
          type: 'success',
        });
        setPreviewData(null);

        // Navigate back to dashboard after a delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }

      if (result.errors.length > 0) {
        alert(
          `Partial Import:\n${result.imported} positions imported.\n\nErrors:\n${result.errors.join('\n')}`
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
    <div style={{ minHeight: '100vh', backgroundColor: colors.backgroundSecondary }}>
      <main style={styles.main}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>
              Import Portfolio
            </h1>
            <p style={styles.subtitle}>
              Add positions manually or import from CSV
            </p>
          </div>

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
            <div>
              {/* CSV Import Section */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Import from CSV
                </h2>
                <p style={styles.sectionDescription}>
                  Upload a CSV file with your portfolio positions
                </p>
                <CSVImportButton
                  onImport={handleCSVImport}
                  onError={handleCSVError}
                  loading={loading}
                  showSampleDownload={true}
                />
              </div>

              <hr style={styles.divider} />

              {/* Manual Entry Section */}
              <div style={styles.section}>
                <h2 style={styles.sectionTitle}>
                  Add Manually
                </h2>
                <p style={styles.sectionDescription}>
                  Enter position details one at a time
                </p>

                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    style={styles.showFormButton}
                  >
                    + Add Position
                  </button>
                ) : (
                  <AddPositionForm
                    onSubmit={handleAddPosition}
                    onCancel={() => setShowForm(false)}
                    loading={loading}
                  />
                )}
              </div>

              {/* Back Button */}
              <div style={styles.footer}>
                <button
                  onClick={() => router.push('/')}
                  style={styles.backButton}
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Snackbar for feedback */}
        {snackbar.visible && (
          <div
            style={{
              ...styles.snackbar,
              ...(snackbar.type === 'error' ? styles.snackbarError : styles.snackbarSuccess),
            }}
          >
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar({ ...snackbar, visible: false })}
              style={styles.snackbarButton}
            >
              OK
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    fontSize: 28,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    fontSize: 20,
  },
  sectionDescription: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  divider: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    border: 'none',
    borderTop: `1px solid ${colors.border}`,
  },
  showFormButton: {
    backgroundColor: colors.primary,
    color: 'white',
    padding: '12px 24px',
    borderRadius: 8,
    border: 'none',
    fontSize: 16,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: colors.primary,
    padding: '8px 16px',
    borderRadius: 8,
    border: `1px solid ${colors.primary}`,
    fontSize: 14,
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  footer: {
    marginTop: spacing.xl,
    display: 'flex',
    justifyContent: 'center',
  },
  snackbar: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '16px 24px',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
  },
  snackbarError: {
    backgroundColor: colors.error,
  },
  snackbarSuccess: {
    backgroundColor: colors.success,
  },
  snackbarButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    fontSize: 14,
    fontWeight: '700',
    cursor: 'pointer',
    padding: '4px 8px',
  },
};
