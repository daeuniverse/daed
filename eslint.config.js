import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: true,
  yaml: false,
  ignores: ['src/schemas/**'],
})
