# Quick Start Guide

## How to run and build this project

> **Note**: `daed` (UI component) is bundled with [dae-wing](https://github.com/daeuniverse/dae-wing) (backend API server) and [dae](https://github.com/daeuniverse/dae) (core).

### Bootstrap

> **Note**: The following command will deploy the stack (`daed`, `dae-wing`, and `dae`) altogether.

```bash
make
```

> **Note**: We need to generate graphql type definitions and api bindings
> Use environment variable `SCHEMA_PATH` to specify your schema endpoint
> It can be a url starts with http(s) points to graphql endpoint or a static graphql schema file

> **Important**: (Dev ONLY) Optionally, append `-w` or `--watch` at the end of the command to watch upcoming changes

```bash
# e.g.
# SCHEMA_PATH=http(s)://example.com/graphql pnpm codegen
# SCHEMA_PATH=http(s)://example.com/graphql.schema pnpm codegen

SCHEMA_PATH=/path/to/SCHEMA_PATH pnpm codegen --watch
```

### Run

Start `dev` server

```sh
pnpm dev
```

If everything goes well, open your browser and navigate to `http://localhost:5173`

Happy Hacking!
