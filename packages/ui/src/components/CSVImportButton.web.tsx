import React, { useRef } from 'react';
import type { Position } from '@portfel/logic';
import { parseCSV, generateSampleCSV } from '@portfel/logic';
import { colors, spacing } from '../theme';

interface CSVImportButtonProps {
  onImport: (positions: Position[], fileName: string) => void;
  onError: (errors: string[]) => void;
  loading?: boolean;
  showSampleDownload?: boolean;
}

/**
 * CSVImportButton - Web version for CSV file import
 */
export const CSVImportButton: React.FC<CSVImportButtonProps> = ({
  onImport,
  onError,
  loading = false,
  showSampleDownload = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = parseCSV(text);

      if (result.errors.length > 0) {
        onError(result.errors);
        return;
      }

      if (result.positions.length === 0) {
        onError(['No valid positions found in CSV file']);
        return;
      }

      onImport(result.positions, file.name);
    } catch (error) {
      onError(['Failed to read CSV file. Please try again.']);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-portfolio.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
        disabled={loading}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        style={styles.uploadButton}
        disabled={loading}
      >
        {loading ? 'Importing...' : '📁 Choose CSV File'}
      </button>

      {showSampleDownload && (
        <button
          onClick={handleDownloadSample}
          style={styles.sampleButton}
          disabled={loading}
        >
          ⬇️ Download Sample CSV
        </button>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  hiddenInput: {
    display: 'none',
  },
  uploadButton: {
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
  sampleButton: {
    padding: '10px 20px',
    fontSize: 13,
    fontWeight: '500',
    border: `1px solid ${colors.border}`,
    borderRadius: 6,
    backgroundColor: 'white',
    color: colors.text,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
