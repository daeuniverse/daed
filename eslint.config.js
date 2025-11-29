import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  yaml: false,
  ignores: ['src/schemas/**'],
  rules: {
    // Allow exporting variants alongside components (shadcn pattern)
    'react-refresh/only-export-components': 'off',
    // Allow array index as key when items have no stable ID
    'react/no-array-index-key': 'off',
    // Allow dangerouslySetInnerHTML for trusted content (chart tooltips)
    'react-dom/no-dangerously-set-innerhtml': 'off',
    // Allow direct setState in useEffect for sync patterns
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
  },
})
