import { colors as colorsImport } from './colors';
import { typography as typographyImport } from './typography';
import { spacing as spacingImport } from './spacing';

export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing } from './spacing';

export const theme = {
  colors: colorsImport,
  typography: typographyImport,
  spacing: spacingImport,
} as const;

export type Theme = typeof theme;
