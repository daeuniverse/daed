# daed

## What this project is for

A Web Dashboard For [dae](https://github.com/v2raya/dae)

Project Goals:

- Easy to use, with keyboard shortcuts builtin
- Beautiful and intuitive UI
- Dark mode
- Mobile friendly

## Status

This project is currently under heavy development

## Contribute to daed

### How to run and build this project

Install dependencies

```sh
pnpm i
```

First and foremost, we need to generate graphql type definitions and api bindings

Use environment variable `SCHEMA_PATH` to customize your schema endpoint, it can be a url starts with http(s) points to graphql endpoint or a local file path points to graphql schema

By default, if you dont specify `SCHEMA_PATH`, fallback to `schema.graphql`

```sh
# SCHEMA_PATH=http(s)://SCHEMA_PATH pnpm codegen

SCHEMA_PATH=/path/to/SCHEMA_PATH pnpm codegen
```

Optionally, you can watch any schema changes by append `-w` or `--watch` to the end of the codegen command like so

```sh
pnpm codegen -w
```

Then start dev server

```sh
pnpm dev
```

If everything goes well, open your browser and navigate to http://localhost:5173

Happy Hacking!

### What you need to know

- [Chakra](https://chakra-ui.com)
- [React](https://reactjs.org)
- [Graphql](https://graphql.org)
