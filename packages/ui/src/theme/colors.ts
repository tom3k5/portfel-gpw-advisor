export const colors = {
  // Primary colors - Based on GPW branding
  primary: '#1E40AF', // Blue
  primaryDark: '#1E3A8A',
  primaryLight: '#3B82F6',

  // Secondary colors
  secondary: '#10B981', // Green for positive values
  secondaryDark: '#059669',
  secondaryLight: '#34D399',

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Market colors
  positive: '#10B981', // Green for gains
  negative: '#EF4444', // Red for losses
  neutral: '#6B7280', // Gray for neutral

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',

  // Text colors
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverted: '#FFFFFF',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Chart colors
  chart: {
    line: '#3B82F6',
    area: 'rgba(59, 130, 246, 0.1)',
    grid: '#E5E7EB',
    positive: '#10B981',
    negative: '#EF4444',
  },
} as const;

export type Colors = typeof colors;
