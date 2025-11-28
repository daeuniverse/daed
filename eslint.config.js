// @ts-check

import eslint from '@eslint/js'
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  // Global ignores (replaces .eslintignore)
  {
    ignores: ['src/schemas/**'],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint recommended rules
  tseslint.configs.recommended,

  // Main configuration
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@tanstack/query': tanstackQueryPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Prettier
      ...prettierConfig.rules,
      'prettier/prettier': 'error',

      // React
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/display-name': 'off',
      'react/self-closing-comp': 'error',

      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,

      // TanStack Query
      ...tanstackQueryPlugin.configs.recommended.rules,

      // TypeScript
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Import
      'import/newline-after-import': 'error',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: ['builtin', 'type', 'external', 'internal', 'sibling', 'index', 'parent'],
        },
      ],

      // Padding lines
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
        { blankLine: 'always', prev: '*', next: 'switch' },
        { blankLine: 'always', prev: 'switch', next: '*' },
      ],
    },
  },
)
