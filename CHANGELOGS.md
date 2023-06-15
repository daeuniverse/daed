
# Changelogs

Also seen in [GitHub Releases](https://github.com/daeuniverse/dae/releases)

HTML version available at https://dae.v2raya.org/docs/current/changelogs

## Query history releases

```bash
curl --silent "https://api.github.com/repos/daeuniverse/daed/releases" | jq -r '.[] | {tag_name,created_at,prerelease}'
```

## Releases

- [0.1.0rc1 (Pre-release)](#010-pre-release)

### 0.1.0rc1 (Pre-release)

> Release date: 2023/06/15

#### 功能变更

TBD.

#### Changes

## What's Changed

* feat: add switch language button by @kecrily in https://github.com/daeuniverse/daed/pull/1
* chore: add i18n Ally extension by @kecrily in https://github.com/daeuniverse/daed/pull/2
* feat: draggable config by @kunish in https://github.com/daeuniverse/daed/pull/3
* ci: add develop-preview pipeline by @yqlbu in https://github.com/daeuniverse/daed/pull/6
* chore: add codeowners by @yqlbu in https://github.com/daeuniverse/daed/pull/7
* chore: codeowner shift by @yqlbu in https://github.com/daeuniverse/daed/pull/8
* fix(config): change `DEFAULT_TCP_CHECK_HTTP_METHOD` by @kunish in https://github.com/daeuniverse/daed/pull/14
* doc: update readme by @yqlbu in https://github.com/daeuniverse/daed/pull/17
* chore: makefile and release actions by @mzz2017 in https://github.com/daeuniverse/daed/pull/20
* ci: build and publish daed docker image with geosite/geoip by @kunish in https://github.com/daeuniverse/daed/pull/19
* fix: /lib64/libc.so.6: version `GLIBC_2.32' not found by @kunish in https://github.com/daeuniverse/daed/pull/22
* chore: add issue,pull_request templates by @yqlbu in https://github.com/daeuniverse/daed/pull/26
* chore: add .editorconfig by @yqlbu in https://github.com/daeuniverse/daed/pull/29
* fix(config): add missing form modal fields and data inconsistency by @kunish in https://github.com/daeuniverse/daed/pull/13
* feat: set `DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER` to true by @kunish in https://github.com/daeuniverse/daed/pull/28
* feat: change the presentation form of certain details to `Drawer`s by @kunish in https://github.com/daeuniverse/daed/pull/24
* build.yml: add linux package builds by @MarksonHon in https://github.com/daeuniverse/daed/pull/30

## New Contributors

* @kecrily made their first contribution in https://github.com/daeuniverse/daed/pull/1
* @kunish made their first contribution in https://github.com/daeuniverse/daed/pull/3
* @yqlbu made their first contribution in https://github.com/daeuniverse/daed/pull/6
* @mzz2017 made their first contribution in https://github.com/daeuniverse/daed/pull/20
* @MarksonHon made their first contribution in https://github.com/daeuniverse/daed/pull/30
