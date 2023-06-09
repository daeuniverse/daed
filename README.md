# daed

<p align="center" width="100%">
  <img width="100" src="public/logo.svg" />
</p>

<p align="center">
  <img src="https://custom-icon-badges.herokuapp.com/github/license/daeuniverse/daed?logo=law&color=orange" alt="license" />
  <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fdaeuniverse%2Fdaed&count_bg=%235C3DC8&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false" alt="hits" />
  <img src="https://custom-icon-badges.herokuapp.com/github/issues-pr-closed/daeuniverse/daed?color=purple&logo=git-pull-request&logoColor=white" alt="pr/issue" />
  <img src="https://custom-icon-badges.herokuapp.com/github/last-commit/daeuniverse/daed?logo=history&logoColor=white" alt="lastcommit" />
</p>

## What this project is for

A Web Dashboard For [dae](https://github.com/v2raya/dae)

![preview](public/preview.png)

## Our Goals:

- Easy to use, with keyboard navigation / shortcuts builtin
- Beautiful and intuitive UI
- Light / Dark mode
- Mobile friendly

## Contribute to daed

Feel free to open issues or submit your PR, any feedback or help will be welcome and greatly appreciated

### How to run and build this project

#### First, we need to get [dae-wing](https://github.com/daeuniverse/dae-wing) up and running, which you can think it as a API center companion of dae

Clone `dae-wing` to a remote or local linux environment

```sh
git clone https://github.com/daeuniverse/dae-wing.git

cd dae-wing
```

Run the make script which will clone the dae repo to a specific folder relative to the working directory

```sh
make deps
```

Build the `dae-wing` binary using go build

```sh
go build .
```

Run the `dae-wing` binary we just built w/o `api-only` mode enabled

```sh
# ./dae-wing -c ./ --api-only

./dae-wing -c ./
```

#### Then, run daed on your local machine

Clone this project to your development directory

```sh
git clone https://github.com/daeuniverse/daed.git

cd daed
```

Install package dependencies using `pnpm`

```sh
pnpm install
```

We need to generate graphql type definitions and api bindings

Use environment variable `SCHEMA_PATH` to specify your schema endpoint

It can be a url starts with http(s) points to graphql endpoint or a static graphql schema file

Optionally, append `-w` or `--watch` at the end of the command to watch upcoming changes

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

### What you need to know

- [Graphql](https://graphql.org)
- [React](https://reactjs.org)
- [Mantine](https://mantine.dev)
- [dnd kit](https://dndkit.com)
