module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-base',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-vars': 'error',
    'no-unused-vars': 'warn',
    'comma-dangle': ['error', 'always-multiline'],
    'linebreak-style': 'off',
    'react/prop-types': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
        jsxSingleQuote: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
