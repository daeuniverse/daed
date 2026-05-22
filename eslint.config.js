import antfu from '@antfu/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'

export default antfu(
  {
    // ESLint 10 currently rejects the react-dom plugin shape from
    // antfu/react/setup in this dependency set. Keep the React preset off
    // until @antfu/eslint-config ships an ESLint 10-compatible setup.
    react: false,
    typescript: true,
    yaml: false,
    stylistic: false,
    ignores: ['wing', 'apps/web/src/schemas/**'],
    rules: {
      'no-template-curly-in-string': 'off',
      // Allow exporting variants alongside components (shadcn pattern)
      'react-refresh/only-export-components': 'off',
      // Allow array index as key when items have no stable ID
      'react/no-array-index-key': 'off',
      // Allow dangerouslySetInnerHTML for trusted content (chart tooltips)
      'react-dom/no-dangerously-set-innerhtml': 'off',
      // Allow direct setState in useEffect for sync patterns
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
  {
    plugins: {
      'react-hooks': reactHooks,
    },
  },
  {
    files: ['apps/web/src/pages/Orchestrate/index.tsx'],
    rules: {
      'e18e/prefer-array-some': 'off',
      'no-empty': 'off',
      'no-useless-return': 'off',
      'perfectionist/sort-imports': 'off',
    },
  },
)
