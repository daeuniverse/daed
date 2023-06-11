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

A Web Dashboard for [dae](https://github.com/v2raya/dae)

![preview](public/preview.png)

## Features

- [x] Easy to use, with keyboard navigation / shortcuts builtin
- [x] Beautiful and intuitive UI
- [x] Light / Dark mode
- [x] Mobile friendly

### How to run and build this project

> **Note**: This project is a standaone UI component that works together with [dae-wing](https://github.com/daeuniverse/dae-wing) (backend API server). This project cannot run alone without `dae-wing` since they are bundled as a software stack to interact with [dae](https://github.com/daeuniverse/dae) (core).

#### Get started with dae-wing 

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

#### Get started with daed

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


## Contribute to daed

Feel free to open issues or submit your PR, any feedbacks or help are greatly appreciated. Special thanks goes to all [contributors](https://github.com/daeuniverse/daed/graphs/contributors). If you would like to contribute, please see the [instructions](./CONTRIBUTING.md). Also, it is recommended following the [commit-msg-guide](./docs/commit-msg-guide.md).

## License

[MIT License (C) daeuniverse](https://github.com/daeuniverse/daed/blob/main/LICENSE)

### Dependencies used in this project

- [Graphql](https://graphql.org)
- [React](https://reactjs.org)
- [Mantine](https://mantine.dev)
- [dnd kit](https://dndkit.com)
