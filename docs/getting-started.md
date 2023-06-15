# Quick Start Guide

## How to run and build this project

> **Note**: `daed` (UI component) is bundled with [dae-wing](https://github.com/daeuniverse/dae-wing) (backend API server) and [dae](https://github.com/daeuniverse/dae) (core).

### Bootstrap

The following command will deploy the stack (`daed`, `dae-wing`, and `dae`) altogether.

```bash
make
```

### Advanced use case (Dev ONLY)

> **Warning**: If you do NOT plan to use custom `Graphql` schema, please ignore this part.

> **Note**: By default, Graphql type definitions and api bindings are generated automatically on the fly.
> However, if you would like to configure new `schema` for Graphql, use environment variable `SCHEMA_PATH` to specify your schema endpoint
> It can be a `url` starts with http(s) pointing to graphql endpoint or a static graphql schema file
> Optionally, append `-w` or `--watch` at the end of the command to watch upcoming changes

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
