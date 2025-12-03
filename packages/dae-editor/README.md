# @daeuniverse/dae-editor

Monaco editor configuration and RoutingA language support for dae.

## Installation

```bash
# Using npm with GitHub Packages
npm install @daeuniverse/dae-editor --registry=https://npm.pkg.github.com

# Using pnpm
pnpm add @daeuniverse/dae-editor --registry=https://npm.pkg.github.com
```

## Setup for GitHub Packages

Create or update `.npmrc` in your project root:

```
@daeuniverse:registry=https://npm.pkg.github.com
```

## Usage

```tsx
import {
  applyShikiThemes,
  EDITOR_OPTIONS,
  EDITOR_THEME_DARK,
  EDITOR_THEME_LIGHT,
  handleEditorBeforeMount,
  isShikiReady,
} from '@daeuniverse/dae-editor'
import { Editor } from '@monaco-editor/react'

function MyEditor() {
  const [theme, setTheme] = useState(EDITOR_THEME_DARK)

  const handleMount = async (editor, monaco) => {
    await applyShikiThemes(monaco)
    // Now you can use Shiki themes
  }

  return (
    <Editor
      language="routingA"
      theme={isShikiReady() ? theme : 'vs-dark'}
      options={EDITOR_OPTIONS}
      beforeMount={handleEditorBeforeMount}
      onMount={handleMount}
    />
  )
}
```

## Features

- **RoutingA Language Support**: Syntax highlighting and autocomplete for dae routing configuration
- **Shiki Integration**: Beautiful syntax highlighting with Vitesse and GitHub themes
- **Monaco Configuration**: Pre-configured editor options optimized for dae configs

## API

### Constants

- `EDITOR_OPTIONS` - Default Monaco editor options
- `EDITOR_THEME_DARK` / `EDITOR_THEME_LIGHT` - Shiki theme names
- `EDITOR_THEME_DARK_FALLBACK` / `EDITOR_THEME_LIGHT_FALLBACK` - Fallback themes before Shiki loads
- `EDITOR_LANGUAGE_ROUTINGA` - Monarch language definition for routingA
- `ROUTINGA_COMPLETION_ITEMS` - Autocomplete items for routingA

### Functions

- `handleEditorBeforeMount(monaco)` - Setup function for Monaco's `beforeMount` prop
- `applyShikiThemes(monaco)` - Apply Shiki themes after editor mounts
- `initShikiHighlighter()` - Initialize the Shiki highlighter
- `isShikiReady()` - Check if Shiki themes are loaded

## License

MIT
