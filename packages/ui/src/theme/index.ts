export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export type { Colors } from './colors';
export type { Typography } from './typography';
export type { Spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
} as const;

export type Theme = typeof theme;
