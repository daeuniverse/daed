# Quick Start Guide

## How to run and build this project

> **Note**: This project is a standaone UI component that works together with [dae-wing](https://github.com/daeuniverse/dae-wing) (backend API server). This project cannot run alone without `dae-wing` since they are bundled as a software stack to interact with [dae](https://github.com/daeuniverse/dae) (core).

### Get started with dae-wing

Clone `dae-wing` to a remote or local linux environment

```bash
git clone https://github.com/daeuniverse/dae-wing.git

cd dae-wing
```

Run the make script which will clone the dae repo to a specific folder relative to the working directory

```bash
make deps
```

Build the `dae-wing` binary using go build

```bash
go build .
```

Run the `dae-wing` binary we just built w/o `api-only` mode enabled

```bash
# ./dae-wing -c ./ --api-only
./dae-wing -c ./
```

### Get started with daed

Clone this project to your development directory

```sh
git clone https://github.com/daeuniverse/daed.git

cd daed
```

Install package dependencies using `pnpm`

```sh
pnpm install
```

> **Note**: We need to generate graphql type definitions and api bindings
> Use environment variable `SCHEMA_PATH` to specify your schema endpoint
> It can be a url starts with http(s) points to graphql endpoint or a static graphql schema file

> **Important**: Optionally, append `-w` or `--watch` at the end of the command to watch upcoming changes

```sh
# SCHEMA_PATH=http(s)://example.com/graphql pnpm codegen
# SCHEMA_PATH=http(s)://example.com/graphql.schema pnpm codegen

SCHEMA_PATH=/path/to/SCHEMA_PATH pnpm codegen --watch
```

Start dev server

```sh
pnpm dev
```

If everything goes well, open your browser and navigate to http://localhost:5173

Happy Hacking!
