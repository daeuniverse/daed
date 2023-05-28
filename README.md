# daed

<p align="center" width="100%">
  <img width="100" src="public/logo.svg" />
</p>

## What this project is for

A Web Dashboard For [dae](https://github.com/v2raya/dae)

![preview](public/preview.png)

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

We need to generate graphql type definitions and api bindings

Use environment variable `SCHEMA_PATH` to specify your schema endpoint

It can be a url starts with http(s) points to graphql endpoint or a static graphql schema file

Optionally, append `-w` or `--watch` at the end of the command to watch upcoming changes

```sh
# SCHEMA_PATH=http(s)://example.com/graphql pnpm codegen
# SCHEMA_PATH=http(s)://example.com/graphql.schema pnpm codegen

SCHEMA_PATH=/path/to/SCHEMA_PATH pnpm codegen -w
```

Start dev server

```sh
pnpm dev
```

If everything goes well, open your browser and navigate to http://localhost:5173

Happy Hacking!

### What you need to know

- [Chakra](https://mui.com)
- [React](https://reactjs.org)
- [Graphql](https://graphql.org)
