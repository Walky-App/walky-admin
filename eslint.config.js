import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'


export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Route all logging through src/lib/logger (DEV-gated) so we never leak
      // API payloads / PII into production browser consoles. logger.ts itself
      // opts out via an inline eslint-disable comment.
      'no-console': 'error',
      // Surface remaining `any` as warnings (non-blocking) so the type debt is
      // visible and no new `any` creeps into hand-written code. The generated
      // API client (src/API/**) is exempted below.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Generated API client — not hand-authored, regenerated from swagger.
    // Don't flag its `any` usages (they'd be noise we can't act on). This block
    // comes last so it overrides the global rule above for these files.
    files: ['src/API/WalkyAPI.ts', 'src/API/Api.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
)
