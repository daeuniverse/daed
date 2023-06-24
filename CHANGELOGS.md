# Changelogs

Also seen in [GitHub Releases](https://github.com/daeuniverse/dae/releases)

HTML version available at https://dae.v2raya.org/docs/current/changelogs

## Query history releases

```bash
curl --silent "https://api.github.com/repos/daeuniverse/daed/releases" | jq -r '.[] | {tag_name,created_at,prerelease}'
```

## Releases

<!-- BEGIN NEW TOC ENTRY -->
- [v0.1.0rc1 (Pre-release)](#v010rc1-pre-release)
<!-- BEGIN NEW CHANGELOGS -->

### v0.1.0rc1 (Pre-release)

> Release date: 2023/06/19

#### Features

- feat(rules): hide remove button if selected by @kunish in https://github.com/daeuniverse/daed/pull/39
- feat: add switch language button by @kecrily in https://github.com/daeuniverse/daed/pull/1
- feat: change the presentation form of certain details to `Drawer`s by @kunish in https://github.com/daeuniverse/daed/pull/24
- feat: draggable config by @kunish in https://github.com/daeuniverse/daed/pull/3
- feat: make rules card clickable area larger by @kunish in https://github.com/daeuniverse/daed/pull/37
- feat: rename default config (global) and group (proxy) by @kunish in https://github.com/daeuniverse/daed/pull/38
- feat: set `DEFAULT_AUTO_CONFIG_KERNEL_PARAMETER` to true by @kunish in https://github.com/daeuniverse/daed/pull/28

#### Bug Fixes

- fix bunch of issues, add bunch of missing functionalities, collected from our community by @kunish in https://github.com/daeuniverse/daed/pull/58
- fix(config): add missing form modal fields and data inconsistency by @kunish in https://github.com/daeuniverse/daed/pull/13
- fix(config): change `DEFAULT_TCP_CHECK_HTTP_METHOD` by @kunish in https://github.com/daeuniverse/daed/pull/14
- fix(sync-upstream-docs): do not use ref in checkout action by @yqlbu in https://github.com/daeuniverse/daed/pull/48
- fix: /lib64/libc.so.6: version `GLIBC_2.32` not found by @kunish in https://github.com/daeuniverse/daed/pull/22
- fix: limit the tproxy port input range, add descriptive help texts by @kunish in https://github.com/daeuniverse/daed/pull/27
- fix: systemd service file description and service start command by @kunish in https://github.com/daeuniverse/daed/pull/64

#### Other Changes

- Add a new `develop` branch, publish a `prerelease` Github Release by @kunish in https://github.com/daeuniverse/daed/pull/31
- build.yml: Fix upload zip files to release by @MarksonHon in https://github.com/daeuniverse/daed/pull/52
- build.yml: add linux package builds by @MarksonHon in https://github.com/daeuniverse/daed/pull/30
- build: set independent app name by @kunish in https://github.com/daeuniverse/daed/pull/34
- chore(sync): upgrade dae-wing by @daebot in https://github.com/daeuniverse/daed/pull/49
- chore: add .editorconfig by @yqlbu in https://github.com/daeuniverse/daed/pull/29
- chore: add codeowners by @yqlbu in https://github.com/daeuniverse/daed/pull/7
- chore: add i18n Ally extension by @kecrily in https://github.com/daeuniverse/daed/pull/2
- chore: add issue,pull_request templates by @yqlbu in https://github.com/daeuniverse/daed/pull/26
- chore: codeowner shift by @yqlbu in https://github.com/daeuniverse/daed/pull/8
- chore: makefile and release actions by @mzz2017 in https://github.com/daeuniverse/daed/pull/20
- chore: refine license by @mzz2017 in https://github.com/daeuniverse/daed/pull/63
- chore: upgrade dae-wing by @daebot in https://github.com/daeuniverse/daed/pull/61
- chore: upgrade dae-wing by @mzz2017 in https://github.com/daeuniverse/daed/pull/41
- chore: use go mod cache instead of go mod vendor by @mzz2017 in https://github.com/daeuniverse/daed/pull/42
- ci(build): fix missing dependant job by @yqlbu in https://github.com/daeuniverse/daed/pull/57
- ci(build-nightly): demise develop branch trigger; use hotfix and test instead by @yqlbu in https://github.com/daeuniverse/daed/pull/55
- ci(build.yml): Remove redundant paths for zip archives by @MarksonHon in https://github.com/daeuniverse/daed/pull/62
- ci(build.yml): add Linux package hooks by @MarksonHon in https://github.com/daeuniverse/daed/pull/40
- ci(release-v0.1.0rc): add release changelogs by @yqlbu in https://github.com/daeuniverse/daed/pull/32
- ci(sync): sync create pull request by @kunish in https://github.com/daeuniverse/daed/pull/44
- ci(sync-upstream): general patches by @yqlbu in https://github.com/daeuniverse/daed/pull/46
- ci: add a workflow to synchronize upstream repositories by @kunish in https://github.com/daeuniverse/daed/pull/43
- ci: add develop-preview pipeline by @yqlbu in https://github.com/daeuniverse/daed/pull/6
- ci: build and publish daed docker image with geosite/geoip by @kunish in https://github.com/daeuniverse/daed/pull/19
- ci: build-nightly workflow by @yqlbu in https://github.com/daeuniverse/daed/pull/35
- ci: fix sync upstream by @yqlbu in https://github.com/daeuniverse/daed/pull/59
- ci: ignore `*.md` to trigger build by @yqlbu in https://github.com/daeuniverse/daed/pull/51
- ci: separate release build from main_stream build by @yqlbu in https://github.com/daeuniverse/daed/pull/65
- doc: update readme by @yqlbu in https://github.com/daeuniverse/daed/pull/17
- docs(getting-started.md): correct a tiny typo by @yqlbu in https://github.com/daeuniverse/daed/pull/50
- docs: include a short notes for nightly builds by @yqlbu in https://github.com/daeuniverse/daed/pull/36
- docs: migrate getting-started guide to /docs by @yqlbu in https://github.com/daeuniverse/daed/pull/33

#### New Contributors

> [daed](https://github.com/daeuniverse/daed) is mature enough to fly! Thanks to the following contributors.

- @kecrily made their first contribution in https://github.com/daeuniverse/daed/pull/1
- @kunish made their first contribution in https://github.com/daeuniverse/daed/pull/3
- @yqlbu made their first contribution in https://github.com/daeuniverse/daed/pull/6
- @mzz2017 made their first contribution in https://github.com/daeuniverse/daed/pull/20
- @MarksonHon made their first contribution in https://github.com/daeuniverse/daed/pull/30
- @daebot made their first contribution in https://github.com/daeuniverse/daed/pull/49
