import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsparser,
    },
    env: {
      node: true, // Fixes "process is not defined", "console is not defined"
      es2021: true,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'off', // Remove if you want to enforce typing
      'no-console': 'warn', // Changes `console` errors to warnings
      'no-undef': 'off', // Fixes "console is not defined"
    },
  },
  prettier,
]
