module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-native/all',
  ],
  plugins: ['react', 'react-native', '@typescript-eslint'],
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
    jest: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Console warnings
    'no-console': 'warn',

    // TypeScript any warnings
    '@typescript-eslint/no-explicit-any': 'warn',

    // React rules
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+

    // React Native specific
    'react-native/no-unused-styles': 'warn',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'off', // Allow color literals
    'react-native/split-platform-components': 'warn',

    // General code quality
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],

    // Allow require() for dynamic imports
    '@typescript-eslint/no-var-requires': 'off',
  },
  ignorePatterns: [
    'node_modules/',
    '.expo/',
    '.expo-shared/',
    'android/',
    'ios/',
    'web-build/',
    'dist/',
    'build/',
    '*.config.js',
    'babel.config.js',
    'metro.config.js',
  ],
};
