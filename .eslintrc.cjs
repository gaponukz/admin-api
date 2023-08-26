module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    env: {
      node: true,
    },
    globals: {
      exports: 'readonly',
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      // Add any other rules or overrides as needed
    },
  };
  