import eslint from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import globals from 'globals'
import { dirname } from 'path'
import tseslint from 'typescript-eslint'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    ...reactRecommended,
    prettierConfig,
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        globals: {
          ...globals.serviceworker,
          ...globals.browser,
        },
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
)
