module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': [
      'warn',
      { allowExpressions: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
};
