# dae-lsp

A Language Server Protocol (LSP) implementation for the DAE configuration language, built with Node.js.

## Features

- **Completion**: Auto-completion for sections, parameters, functions, and built-in values
- **Hover**: Documentation on hover for keywords, functions, and parameters
- **Go to Definition**: Navigate to symbol definitions
- **Find References**: Find all references to a symbol
- **Rename**: Rename symbols across the document
- **Diagnostics**: Real-time syntax validation
- **Semantic Tokens**: Rich syntax highlighting
- **Formatting**: Code formatting support

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v22+ installed
- [pnpm](https://pnpm.io/) v10+ installed

### Build from Source

```bash
# Clone the repository
git clone https://github.com/daeuniverse/daed.git
cd daed

# Install dependencies
pnpm install

# Build the LSP server
pnpm --filter @daeuniverse/dae-lsp build
```

## Usage

### Running the Server

```bash
# Build the package first
pnpm --filter @daeuniverse/dae-lsp build

# Run the server (after build)
node packages/dae-lsp/dist/server.cjs --stdio

# Or use the bin entry
npx dae-lsp --stdio
```

### Protocol

The server communicates via Language Server Protocol over stdio by default.

```bash
node dist/server.cjs --stdio
```

## Integration with Editors

### VS Code

Use with the `dae-vscode` extension from this repository. The extension will automatically connect to the LSP server if available.

### Neovim

Configure with `nvim-lspconfig`:

```lua
local lspconfig = require('lspconfig')
local configs = require('lspconfig.configs')

if not configs.dae_lsp then
  configs.dae_lsp = {
    default_config = {
      cmd = { 'node', '/path/to/dae-lsp/dist/server.cjs', '--stdio' },
      filetypes = { 'dae' },
      root_dir = lspconfig.util.root_pattern('.git', 'package.json'),
      settings = {},
    },
  }
end

lspconfig.dae_lsp.setup{}
```

### Other Editors

Configure your LSP client to start this server with stdio transport:

```bash
node /path/to/dae-lsp/dist/server.cjs --stdio
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm --filter @daeuniverse/dae-lsp build

# Type check
pnpm --filter @daeuniverse/dae-lsp typecheck
```

## Architecture

```
src/
├── core/           # Platform-agnostic core modules
│   ├── parser.ts   # DAE language parser
│   ├── docs.ts     # Documentation strings
│   ├── completions.ts # Completion items
│   └── mod.ts      # Core module exports
├── server.ts       # LSP server entry point
└── mod.ts          # Library exports
```

## API

The core parser can also be used as a library:

```typescript
import { findSymbolAtPosition, parseDocument } from '@daeuniverse/dae-lsp'

const result = parseDocument(daeConfigText)
console.log(result.symbols) // AST symbols
console.log(result.diagnostics) // Validation errors
```

## License

MIT License - see [LICENSE](./LICENSE) for details.
