import stylistic from '@stylistic/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import onlyWarn from 'eslint-plugin-only-warn';

export default [
  { ignores: ['public/'] },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // browser
        window: 'readonly', document: 'readonly', navigator: 'readonly',
        console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
        setInterval: 'readonly', clearInterval: 'readonly', fetch: 'readonly',
        alert: 'readonly', confirm: 'readonly', HTMLElement: 'readonly',
        // node
        process: 'readonly', __dirname: 'readonly', __filename: 'readonly',
        require: 'readonly', module: 'readonly', exports: 'readonly',
        Buffer: 'readonly', global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      '@stylistic': stylistic,
      'import': importPlugin,
      'only-warn': onlyWarn,
    },
    rules: {
      'no-spaced-func': 'warn',
      'prefer-const': 'warn',
      'no-trailing-spaces': ['warn', { 'ignoreComments': true }],
      'no-multi-spaces': ['warn', { 'ignoreEOLComments': true }],
      'prefer-object-spread': 'warn',
      'prefer-spread': 'warn',
      'prefer-exponentiation-operator': 'warn',
      'no-useless-return': 'warn',
      'no-var': 'error',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxEOF': 0 }],

      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/no-extra-semi': 'warn',
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/space-before-blocks': ['warn', 'always'],
      '@stylistic/indent': ['warn', 2, { 'MemberExpression': 'off' }],
      '@stylistic/keyword-spacing': ['warn', { 'before': true, 'after': true }],
      '@stylistic/comma-spacing': ['warn', { 'before': false, 'after': true }],
      '@stylistic/space-before-function-paren': ['warn', { 'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always' }],
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/type-annotation-spacing': 'warn',
      '@stylistic/space-infix-ops': ['warn', { 'int32Hint': false }],
      '@stylistic/semi-spacing': ['warn', { 'before': false, 'after': true }],
      '@stylistic/key-spacing': ['warn', { 'beforeColon': false, 'afterColon': true }],
      '@stylistic/space-unary-ops': ['warn', { 'words': true, 'nonwords': false }],
      '@stylistic/arrow-spacing': ['warn', { 'before': true, 'after': true }],
      '@stylistic/member-delimiter-style': ['error', {
        'multiline': { 'delimiter': 'semi', 'requireLast': true },
        'singleline': { 'delimiter': 'comma', 'requireLast': false },
      }],

      '@typescript-eslint/no-unused-vars': ['error', { 'args': 'none' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
      '@typescript-eslint/no-empty-function': 'off',

      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
      }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json', 'src/tsconfig.json'],
          noWarnOnMultipleProjects: true,
        },
      },
    },
  },
];
