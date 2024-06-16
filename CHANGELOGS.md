# Changelogs

Also seen in [GitHub Releases](https://github.com/daeuniverse/dae/releases)

HTML version available at https://dae.v2raya.org/docs/current/changelogs

## Query history releases

```bash
curl --silent "https://api.github.com/repos/daeuniverse/daed/releases" | jq -r '.[] | {tag_name,created_at,prerelease}'
```

## Releases

<!-- BEGIN NEW TOC ENTRY -->

- [v0.7.0rc1.1 (Pre-Latest)](#v070rc1.1-pre-release)
- [v0.6.0 (Latest)](#v060-latest)
- [v0.4.1](#v041)
- [v0.4.0rc1](#v040rc1)
- [v0.3.3.p1](#v033p1)
- [v0.3.3](#v033)
- [v0.3.2](#v032)
- [v0.3.1](#v031)
- [v0.3.0](#v030)
- [v0.2.0](#v020)
- [v0.1.1](#v011)
- [v0.1.0](#v010)
- [v0.1.0rc1](#v010rc1)
<!-- BEGIN NEW CHANGELOGS -->

### v0.7.0rc1 (Pre-release)

> Release date: 2024/06/16

#### Features

- feat: add configure hysteria2 modal [#440](https://github.com/daeuniverse/daed/pull/440) by (@wanlce)
- ci/feat: support customized git remote for Pick Build [#441](https://github.com/daeuniverse/daed/pull/441) by (@mzz2017)

#### Others

- chore(sync): keep upstream source up-to-date [#442](https://github.com/daeuniverse/daed/pull/442) by (@dae-prow[bot])
- ci(docker): update go version to 1.22 [#445](https://github.com/daeuniverse/daed/pull/445) by (@wanlce)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.6.0...v0.7.0rc1

### v0.6.0 (Latest)

> Release date: 2024/06/14

##### Significant Changes

The version of daed will follow dae

##### Others

- build(deps): bump braces from 3.0.2 to 3.0.3 [#438](https://github.com/daeuniverse/daed/pull/438) by (@dependabot[bot])
- build(deps): bump vite from 4.5.0 to 4.5.3 [#437](https://github.com/daeuniverse/daed/pull/437) by (@dependabot[bot])
- build(deps): bump jose from 4.14.4 to 4.15.5 [#436](https://github.com/daeuniverse/daed/pull/436) by (@dependabot[bot])
- build(deps): bump @mantine/form from 6.0.19 to 7.5.0 [#422](https://github.com/daeuniverse/daed/pull/422) by (@dependabot[bot])
- build(deps): bump react-router-dom from 6.17.0 to 6.21.3 [#419](https://github.com/daeuniverse/daed/pull/419) by (@dependabot[bot])
- build(deps): bump graphiql from 3.0.6 to 3.1.0 [#413](https://github.com/daeuniverse/daed/pull/413) by (@dependabot[bot])
- build(deps): bump eslint from 8.52.0 to 8.56.0 [#407](https://github.com/daeuniverse/daed/pull/407) by (@dependabot[bot])
- ci: update ci modules to the latest version [#432](https://github.com/daeuniverse/daed/pull/432) by (@MarksonHon)
- chore(sync): keep upstream source up-to-date [#435](https://github.com/daeuniverse/daed/pull/435) by (@dae-prow[bot])

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.4.1...v0.6.0

### v0.4.1

> Release date: 2024/04/22

##### Others

- chore(sync): keep upstream source up-to-date in [#428](https://github.com/daeuniverse/daed/pull/428) by (@dae-prow[bot])
- chore(sync): keep upstream source up-to-date in [#385](https://github.com/daeuniverse/daed/pull/385) by (@dae-prow[bot])
- ci: update Go version to 1.21 in [#423](https://github.com/daeuniverse/daed/pull/423) by (@wano)
- docs: update README.md by (@kunish)
- build(deps): bump @typescript-eslint/parser from 6.9.0 to 6.9.1 in [#371](https://github.com/daeuniverse/daed/pull/371) by (@dependabot[bot])
- build(deps): bump @types/node from 20.8.9 to 20.8.10 in [#370](https://github.com/daeuniverse/daed/pull/370) by (@dependabot[bot])
- build(deps): bump react-router from 6.17.0 to 6.18.0 in [#368](https://github.com/daeuniverse/daed/pull/368) by (@dependabot[bot])
- build(deps): bump @commitlint/cli from 17.7.1 to 18.2.0 in [#364](https://github.com/daeuniverse/daed/pull/364) by (@dependabot[bot])
- build(deps): bump @vitejs/plugin-react-swc from 3.4.0 to 3.4.1 in [#365](https://github.com/daeuniverse/daed/pull/365) by (@dependabot[bot])
- build(deps): bump @tiptap/extension-link from 2.1.7 to 2.1.12 in [#366](https://github.com/daeuniverse/daed/pull/366) by (@dependabot[bot])
- build(deps): bump @typescript-eslint/eslint-plugin from 6.9.0 to 6.9.1 in [#367](https://github.com/daeuniverse/daed/pull/367) by (@dependabot[bot])
- build(deps): bump @types/urijs from 1.19.20 to 1.19.22 in [#360](https://github.com/daeuniverse/daed/pull/360) by (@dependabot[bot])
- build(deps): bump mantine-datatable from 6.0.2 to 6.0.3 in [#361](https://github.com/daeuniverse/daed/pull/361) by (@dependabot[bot])
- build(deps): bump react-i18next from 13.3.0 to 13.3.1 in [#362](https://github.com/daeuniverse/daed/pull/362) by (@dependabot[bot])
- build(deps): bump @vitejs/plugin-react-swc from 3.3.2 to 3.4.0 in [#363](https://github.com/daeuniverse/daed/pull/363) by (@dependabot[bot])
- build(deps): bump @types/react-dom from 18.2.7 to 18.2.14 in [#357](https://github.com/daeuniverse/daed/pull/357) by (@dependabot[bot])
- build(deps): bump @types/node from 20.8.7 to 20.8.9 in [#356](https://github.com/daeuniverse/daed/pull/356) by (@dependabot[bot])
- build(deps): bump @faker-js/faker from 8.0.2 to 8.2.0 in [#355](https://github.com/daeuniverse/daed/pull/355) by (@dependabot[bot])
- build(deps): bump eslint-plugin-import from 2.28.1 to 2.29.0 in [#350](https://github.com/daeuniverse/daed/pull/350) by (@dependabot[bot])
- build(deps): bump @fontsource/fira-sans from 5.0.11 to 5.0.17 in [#351](https://github.com/daeuniverse/daed/pull/351) by (@dependabot[bot])
- build(deps): bump @commitlint/config-conventional from 18.0.0 to 18.1.0 in [#352](https://github.com/daeuniverse/daed/pull/352) by (@dependabot[bot])
- build(deps): bump simple-git from 3.19.1 to 3.20.0 in [#353](https://github.com/daeuniverse/daed/pull/353) by (@dependabot[bot])
- build(deps): bump @types/react from 18.2.21 to 18.2.33 in [#346](https://github.com/daeuniverse/daed/pull/346) by (@dependabot[bot])
- build(deps): bump immer from 10.0.2 to 10.0.3 in [#347](https://github.com/daeuniverse/daed/pull/347) by (@dependabot[bot])
- build(deps): bump @tabler/icons-react from 2.39.0 to 2.40.0 in [#348](https://github.com/daeuniverse/daed/pull/348) by (@dependabot[bot])
- build(deps): bump dayjs from 1.11.9 to 1.11.10 in [#349](https://github.com/daeuniverse/daed/pull/349) by (@dependabot[bot])
- build(deps): bump monaco-editor from 0.41.0 to 0.44.0 in [#342](https://github.com/daeuniverse/daed/pull/342) by (@dependabot[bot])
- build(deps): bump react-router from 6.15.0 to 6.17.0 in [#343](https://github.com/daeuniverse/daed/pull/343) by (@dependabot[bot])
- build(deps): bump @vitest/ui from 0.34.3 to 0.34.6 in [#344](https://github.com/daeuniverse/daed/pull/344) by (@dependabot[bot])
- build(deps): bump @types/uuid from 9.0.3 to 9.0.6 in [#345](https://github.com/daeuniverse/daed/pull/345) by (@dependabot[bot])
- build(deps): bump sort-package-json from 2.5.1 to 2.6.0 in [#338](https://github.com/daeuniverse/daed/pull/338) by (@dependabot[bot])
- build(deps): bump eslint-import-resolver-typescript from 3.6.0 to 3.6.1 in [#339](https://github.com/daeuniverse/daed/pull/339) by (@dependabot[bot])
- build(deps): bump graphiql from 3.0.5 to 3.0.6 in [#340](https://github.com/daeuniverse/daed/pull/340) by (@dependabot[bot])
- build(deps): bump @typescript-eslint/eslint-plugin from 6.5.0 to 6.9.0 in [#341](https://github.com/daeuniverse/daed/pull/341) by (@dependabot[bot])
- build(deps): bump @typescript-eslint/parser from 6.5.0 to 6.9.0 in [#336](https://github.com/daeuniverse/daed/pull/336) by (@dependabot[bot])
- build(deps): bump eslint-plugin-prettier from 5.0.0 to 5.0.1 in [#337](https://github.com/daeuniverse/daed/pull/337) by (@dependabot[bot])
- build(deps): bump i18next from 23.4.6 to 23.6.0 in [#334](https://github.com/daeuniverse/daed/pull/334) by (@dependabot[bot])
- build(deps): bump react-router-dom from 6.15.0 to 6.17.0 in [#335](https://github.com/daeuniverse/daed/pull/335) by (@dependabot[bot])
- build(deps): bump @tanstack/eslint-plugin-query from 4.34.1 to 5.0.5 in [#332](https://github.com/daeuniverse/daed/pull/332) by (@dependabot[bot])
- build(deps): bump vite from 4.4.9 to 4.5.0 in [#329](https://github.com/daeuniverse/daed/pull/329) by (@dependabot[bot])
- build(deps): bump @fontsource/source-code-pro from 5.0.8 to 5.0.15 in [#331](https://github.com/daeuniverse/daed/pull/331) by (@dependabot[bot])
- build(deps): bump zod from 3.22.3 to 3.22.4 in [#326](https://github.com/daeuniverse/daed/pull/326) by (@dependabot[bot])
- build(deps): bump @tabler/icons-react from 2.32.0 to 2.39.0 in [#330](https://github.com/daeuniverse/daed/pull/330) by (@dependabot[bot])
- build(deps): bump nanostores from 0.9.3 to 0.9.4 in [#327](https://github.com/daeuniverse/daed/pull/327) by (@dependabot[bot])
- build(deps): bump eslint from 8.48.0 to 8.52.0 in [#328](https://github.com/daeuniverse/daed/pull/328) by (@dependabot[bot])
- build(deps): bump vitest from 0.34.3 to 0.34.6 in [#324](https://github.com/daeuniverse/daed/pull/324) by (@dependabot[bot])
- build(deps): bump @monaco-editor/react from 4.5.2 to 4.6.0 in [#325](https://github.com/daeuniverse/daed/pull/325) by (@dependabot[bot])
- build(deps): bump @tiptap/react from 2.1.7 to 2.1.12 in [#319](https://github.com/daeuniverse/daed/pull/319) by (@dependabot[bot])
- build(deps): bump lint-staged from 14.0.1 to 15.0.2 in [#323](https://github.com/daeuniverse/daed/pull/323) by (@dependabot[bot])
- build(deps): bump @commitlint/config-conventional from 17.7.0 to 18.0.0 in [#322](https://github.com/daeuniverse/daed/pull/322) by (@dependabot[bot])
- build(deps): bump embla-carousel-react from 8.0.0-rc12 to 8.0.0-rc14 in [#321](https://github.com/daeuniverse/daed/pull/321) by (@dependabot[bot])
- build(deps): bump @types/react-copy-to-clipboard from 5.0.4 to 5.0.6 in [#320](https://github.com/daeuniverse/daed/pull/320) by (@dependabot[bot])
- chore(sync): keep upstream source up-to-date in [#318](https://github.com/daeuniverse/daed/pull/318) by (@dae-bot[bot])
- chore(sync): keep upstream source up-to-date in [#317](https://github.com/daeuniverse/daed/pull/317) by (@dae-bot[bot])
- ci(docker): rework workflow (3rd time) in [#289](https://github.com/daeuniverse/daed/pull/289) by (@hero-intelligent)
- build(deps): bump framer-motion from 10.16.2 to 10.16.4 in [#273](https://github.com/daeuniverse/daed/pull/273) by (@dependabot[bot])
- build(deps): bump @tiptap/starter-kit from 2.1.7 to 2.1.12 in [#306](https://github.com/daeuniverse/daed/pull/306) by (@dependabot[bot])
- build(deps): bump zod from 3.22.2 to 3.22.3 in [#316](https://github.com/daeuniverse/daed/pull/316) by (@dependabot[bot])
- build(deps): bump graphql from 16.8.0 to 16.8.1 in [#290](https://github.com/daeuniverse/daed/pull/290) by (@dependabot[bot])
- build(deps): bump postcss from 8.4.29 to 8.4.31 in [#302](https://github.com/daeuniverse/daed/pull/302) by (@dependabot[bot])
- build(deps): bump get-func-name from 2.0.0 to 2.0.2 in [#296](https://github.com/daeuniverse/daed/pull/296) by (@dependabot[bot])
- build(deps): bump react-i18next from 13.2.1 to 13.3.0 in [#309](https://github.com/daeuniverse/daed/pull/309) by (@dependabot[bot])
- build(deps): bump @types/node from 20.5.8 to 20.8.7 in [#312](https://github.com/daeuniverse/daed/pull/312) by (@dependabot[bot])
- build(deps): bump @babel/traverse from 7.22.11 to 7.23.2 in [#313](https://github.com/daeuniverse/daed/pull/313) by (@dependabot[bot])
- build(deps): bump mantine-datatable from 2.9.12 to 6.0.2 in [#315](https://github.com/daeuniverse/daed/pull/315) by (@dependabot[bot])
- chore(sync): keep upstream source up-to-date in [#314](https://github.com/daeuniverse/daed/pull/314) by (@dae-bot[bot])
- docs/getting-started.md: add archlinux installation guide in [#283](https://github.com/daeuniverse/daed/pull/283) by (@Integral)
- ci(generate-changelogs): update default assignees list in [#261](https://github.com/daeuniverse/daed/pull/261) by (@kev)
- ci(Dockerfile): Dockerfile working out of box in [#265](https://github.com/daeuniverse/daed/pull/265) by (@hero-intelligent)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.4.0rc1...v0.4.1

### v0.4.0rc1

> Release date: 2023/09/03

##### Features

- feat(routing): add dnsmasq to must_direct default routing in [#258](https://github.com/daeuniverse/daed/pull/258) by (@kunish)
- feat(config): add form field `soMarkFromDae` in [#251](https://github.com/daeuniverse/daed/pull/251) by (@kunish)

##### Others

- chore(sync): keep upstream source up-to-date in [#259](https://github.com/daeuniverse/daed/pull/259) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#257](https://github.com/daeuniverse/daed/pull/257) by (@daebot)
- ci(pick): fix build failure due to go mod not being updated in [#248](https://github.com/daeuniverse/daed/pull/248) by (@wanlce)
- docs(getting-started): make subtle changes in [#247](https://github.com/daeuniverse/daed/pull/247) by (@yqlbu)
- docs: Added Debian, RedHat, openSUSE, installation instructions in [#246](https://github.com/daeuniverse/daed/pull/246) by (@shenghuang147)
- chore(sync): keep upstream source up-to-date in [#245](https://github.com/daeuniverse/daed/pull/245) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#244](https://github.com/daeuniverse/daed/pull/244) by (@daebot)
- ci(release): draft release v0.3.3.p1 in [#243](https://github.com/daeuniverse/daed/pull/243) by (@daebot)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.3.3.p1...v0.4.0rc1

### v0.3.3.p1

> Release date: 2023/08/14

#### Others

- chore(sync): keep upstream source up-to-date in [#241](https://github.com/daeuniverse/daed/pull/241) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#240](https://github.com/daeuniverse/daed/pull/240) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#239](https://github.com/daeuniverse/daed/pull/239) by (@daebot)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.3.3...v0.3.3.p1

### v0.3.3

> Release date: 2023/08/13

#### Features

- feat: add desktop file and icons in [#221](https://github.com/daeuniverse/daed/pull/221) by (@shenghuang147)
- feat: add juicity pinned_certchain_sha256 config in [#219](https://github.com/daeuniverse/daed/pull/219) by (@bradfordzhang)
- feat: change editor font to `Source Code Pro` in [#218](https://github.com/daeuniverse/daed/pull/218) by (@kunish)

#### Bug Fixes

- fix: copy to clipboard not working when clipboard permissions not permitted in [#217](https://github.com/daeuniverse/daed/pull/217) by (@kunish)

#### Others

- chore(sync): keep upstream source up-to-date in [#236](https://github.com/daeuniverse/daed/pull/236) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#235](https://github.com/daeuniverse/daed/pull/235) by (@daebot)
- chore: remove BUILD_ARGS in workflows in [#234](https://github.com/daeuniverse/daed/pull/234) by (@mzz2017)
- chore(sync): keep upstream source up-to-date in [#233](https://github.com/daeuniverse/daed/pull/233) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#232](https://github.com/daeuniverse/daed/pull/232) by (@daebot)
- ci(pick): fix build error when daed is not main in [#231](https://github.com/daeuniverse/daed/pull/231) by (@wanlce)
- ci: add pick-build workflow in [#229](https://github.com/daeuniverse/daed/pull/229) by (@wanlce)
- chore(sync): keep upstream source up-to-date in [#228](https://github.com/daeuniverse/daed/pull/228) by (@daebot)
- chore: support build_mode=pie in [#227](https://github.com/daeuniverse/daed/pull/227) by (@mzz2017)
- chore(sync): keep upstream source up-to-date in [#226](https://github.com/daeuniverse/daed/pull/226) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#225](https://github.com/daeuniverse/daed/pull/225) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#224](https://github.com/daeuniverse/daed/pull/224) by (@daebot)
- chore(pr_template): update section headers in [#223](https://github.com/daeuniverse/daed/pull/223) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#222](https://github.com/daeuniverse/daed/pull/222) by (@daebot)
- chore/refactor: rework issue_templates in [#220](https://github.com/daeuniverse/daed/pull/220) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#216](https://github.com/daeuniverse/daed/pull/216) by (@daebot)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.3.2...v0.3.3

### New Contributors

- @bradfordzhang made their first contribution in https://github.com/daeuniverse/daed/pull/219
- @shenghuang147 made their first contribution in https://github.com/daeuniverse/daed/pull/221

### v0.3.2

> Release date: 2023/08/05

#### Features

- feat: disable rollbackError, fixes #207 in [#208](https://github.com/daeuniverse/daed/pull/208) by (@kunish)
- feat: set color scheme based on system preference in [#205](https://github.com/daeuniverse/daed/pull/205) by (@kunish)

#### Others

- chore(sync): keep upstream source up-to-date in [#210](https://github.com/daeuniverse/daed/pull/210) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#209](https://github.com/daeuniverse/daed/pull/209) by (@daebot)
- chore(pr_template): fix typo in [#206](https://github.com/daeuniverse/daed/pull/206) by (@yqlbu)
- chore(sync): manual sync upstream in [#204](https://github.com/daeuniverse/daed/pull/204) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#202](https://github.com/daeuniverse/daed/pull/202) by (@daebot)
- ci(release): draft release v0.3.1 in [#201](https://github.com/daeuniverse/daed/pull/201) by (@daebot)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.3.1...v0.3.2

### v0.3.1

> Release date: 2023/07/29

#### Others

- chore(sync): keep upstream source up-to-date in [#199](https://github.com/daeuniverse/daed/pull/199) by (@daebot)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.3.0...v0.3.1

### v0.3.0

> Release date: 2023/07/29

#### Features

- feat: add configure juicity modal in [#191](https://github.com/daeuniverse/daed/pull/191) by (@wanlce)

#### Bug Fixes

- fix: rename modal not closing after changing rule names in [#188](https://github.com/daeuniverse/daed/pull/188) by (@kunish)
- fix: reload icon not showing on small size screens in [#187](https://github.com/daeuniverse/daed/pull/187) by (@kunish)
- fix: avoid to install husky when not in a git repo in [#185](https://github.com/daeuniverse/daed/pull/185) by (@douglarek)

#### Others

- chore(sync): keep upstream source up-to-date in [#194](https://github.com/daeuniverse/daed/pull/194) by (@daebot)
- ci/fix(generate-changelogs): fix dry_run input description in [#193](https://github.com/daeuniverse/daed/pull/193) by (@yqlbu)
- chore/feat: add checkout.sh in [#192](https://github.com/daeuniverse/daed/pull/192) by (@mzz2017)
- ci/fix(pr-build,build): fix submodule path trigger in [#190](https://github.com/daeuniverse/daed/pull/190) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#189](https://github.com/daeuniverse/daed/pull/189) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#186](https://github.com/daeuniverse/daed/pull/186) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#184](https://github.com/daeuniverse/daed/pull/184) by (@daebot)
- ci(pr-build): update trigger paths in [#183](https://github.com/daeuniverse/daed/pull/183) by (@yqlbu)
- chore: update codeowners in [#182](https://github.com/daeuniverse/daed/pull/182) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#181](https://github.com/daeuniverse/daed/pull/181) by (@daebot)
- ci(pr-build): ONLY keep arm64, amd64 as build targets in [#180](https://github.com/daeuniverse/daed/pull/180) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#179](https://github.com/daeuniverse/daed/pull/179) by (@daebot)
- ci(release): checkout codebase based on ref in [#178](https://github.com/daeuniverse/daed/pull/178) by (@yqlbu)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.2.0...v0.3.0

### New Contributors

- @douglarek made their first contribution in #185
- @wanlce made their first contribution in #191

### v0.2.0

> Release date: 2023/07/17

#### Features

- feat: add configure tuic modal in [#157](https://github.com/daeuniverse/daed/pull/157) by (@kunish)
- feat: modal reworks in [#149](https://github.com/daeuniverse/daed/pull/149) by (@kunish)
- feat: change icons in [#147](https://github.com/daeuniverse/daed/pull/147) by (@kunish)

#### Bug Fixes

- fix: time parsing is wrong in [#171](https://github.com/daeuniverse/daed/pull/171) by (@kunish)
- fix(v2ray): add missing websocket path field in [#159](https://github.com/daeuniverse/daed/pull/159) by (@kunish)
- fix: wan interface should be optional in [#156](https://github.com/daeuniverse/daed/pull/156) by (@kunish)

#### Others

- ci(pr-build): add ready_for_review trigger in [#175](https://github.com/daeuniverse/daed/pull/175) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#174](https://github.com/daeuniverse/daed/pull/174) by (@daebot)
- chore: run unite tests before commiting in [#172](https://github.com/daeuniverse/daed/pull/172) by (@kunish)
- docs(readme): add build-status badge in [#170](https://github.com/daeuniverse/daed/pull/170) by (@yqlbu)
- chore: update packages in [#169](https://github.com/daeuniverse/daed/pull/169) by (@kunish)
- ci/fix(pr-build): skip check-run related actions based on condition in [#167](https://github.com/daeuniverse/daed/pull/167) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#165](https://github.com/daeuniverse/daed/pull/165) by (@daebot)
- chore(sync): keep upstream source up-to-date in [#164](https://github.com/daeuniverse/daed/pull/164) by (@daebot)
- ci/chore(pr-build): remove unnecessary lines in [#163](https://github.com/daeuniverse/daed/pull/163) by (@yqlbu)
- ci(pr-build): integrate check runs to report build status in [#162](https://github.com/daeuniverse/daed/pull/162) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#160](https://github.com/daeuniverse/daed/pull/160) by (@daebot)
- ci(build): rename Build (Stable) -> Build (Main) in [#158](https://github.com/daeuniverse/daed/pull/158) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#155](https://github.com/daeuniverse/daed/pull/155) by (@daebot)
- ci(sync-upstream): fix invalid downstream workflow ref in [#152](https://github.com/daeuniverse/daed/pull/152) by (@yqlbu)
- ci(sync-upstream) apply modularity support in [#151](https://github.com/daeuniverse/daed/pull/151) by (@yqlbu)
- chore(pr_template): add test result section in [#148](https://github.com/daeuniverse/daed/pull/148) by (@yqlbu)
- ci(generate-changelogs): set dry_run to true by default in [#146](https://github.com/daeuniverse/daed/pull/146) by (@yqlbu)
- ci(build.yml): fix armv7 packages' architecture in [#145](https://github.com/daeuniverse/daed/pull/145) by (@MarksonHon)

### v0.1.1

> Release date: 2023/07/09

#### Features

- feat(tuic): upgrade dae-wing to support tuic v5 in [#135](https://github.com/daeuniverse/daed/pull/135) by (@kunish)
- feat: wan interface auto detect in [#133](https://github.com/daeuniverse/daed/pull/133) by (@kunish)
- feat: display daed version in header in [#132](https://github.com/daeuniverse/daed/pull/132) by (@kunish)
- feat: add a configure node modal in [#125](https://github.com/daeuniverse/daed/pull/125) by (@kunish)
- feat: disable zooming and panning on mobile in [#113](https://github.com/daeuniverse/daed/pull/113) by (@kunish)

#### Bug Fixes

- fix: import missing packages and clean up unreference files in [#128](https://github.com/daeuniverse/daed/pull/128) by (@earrmouth)
- fix: try fixing caret misplacement in [#124](https://github.com/daeuniverse/daed/pull/124) by (@kunish)
- fix: footer is floating above modal overlay in [#121](https://github.com/daeuniverse/daed/pull/121) by (@kunish)

#### Others

- chore(sync): keep upstream source up-to-date in [#141](https://github.com/daeuniverse/daed/pull/141) by (@dae-bot[bot])
- ci: refine pr-build workflow in [#138](https://github.com/daeuniverse/daed/pull/138) by (@yqlbu)
- docs(readme): add release badge in [#136](https://github.com/daeuniverse/daed/pull/136) by (@yqlbu)
- chore: refine makefile in [#120](https://github.com/daeuniverse/daed/pull/120) by (@mzz2017)
- docs(readme): fix license badge issue and rework contributing section in [#107](https://github.com/daeuniverse/daed/pull/107) by (@yqlbu)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.1.0...v0.1.1

### New Contributors

- @earrmouth made their first contribution in [#128](https://github.com/daeuniverse/daed/pull/128)

### v0.1.0

> Release date: 2023/06/24

#### Features

- feat: responsive header in [#111](https://github.com/daeuniverse/daed/pull/111) by (@kunish)
- feat: support small screen devices in [#110](https://github.com/daeuniverse/daed/pull/110) by (@kunish)
- feat: make plaintext modal fullscreen in [#109](https://github.com/daeuniverse/daed/pull/109) by (@kunish)
- feat: add header icon link to github project, and a footer in [#108](https://github.com/daeuniverse/daed/pull/108) by (@kunish)
- feat(editor): render tags in [#106](https://github.com/daeuniverse/daed/pull/106) by (@kunish)
- feat(editor): add routingA code highlight in [#105](https://github.com/daeuniverse/daed/pull/105) by (@kunish)
- feat: use theme `github` as default monaco editor light theme in [#102](https://github.com/daeuniverse/daed/pull/102) by (@kunish)
- feat: use monaco editor for dns and routing in [#101](https://github.com/daeuniverse/daed/pull/101) by (@kunish)
- feat: render qrcode in canvas to allow user to save image in [#100](https://github.com/daeuniverse/daed/pull/100) by (@kunish)
- feat: add a modal to show node qrcode in [#99](https://github.com/daeuniverse/daed/pull/99) by (@kunish)
- feat: show node protocol in card title in [#98](https://github.com/daeuniverse/daed/pull/98) by (@kunish)
- feat: add tooltip for header actions in [#97](https://github.com/daeuniverse/daed/pull/97) by (@kunish)
- feat: restrict drag and drop area in [#80](https://github.com/daeuniverse/daed/pull/80) by (@kunish)
- feat: drag nodes and subscriptions between groups in [#79](https://github.com/daeuniverse/daed/pull/79) by (@kunish)
- feat(group): show subscription tag on node hover in [#77](https://github.com/daeuniverse/daed/pull/77) by (@kunish)
- feat(config): show interface ip addresses in interface select in [#72](https://github.com/daeuniverse/daed/pull/72) by (@kunish)
- feat: add description text for group policies in [#71](https://github.com/daeuniverse/daed/pull/71) by (@kunish)
- feat: add loading state indicators in [#70](https://github.com/daeuniverse/daed/pull/70) by (@kunish)

#### Bug Fixes

- fix(group): refresh after remove nodes/subs in [#96](https://github.com/daeuniverse/daed/pull/96) by (@kunish)
- fix: default googledns add tcp in [#92](https://github.com/daeuniverse/daed/pull/92) by (@kunish)
- fix: dragging not working properly in [#91](https://github.com/daeuniverse/daed/pull/91) by (@kunish)
- fix(subscription): loading indicator of update in [#78](https://github.com/daeuniverse/daed/pull/78) by (@kunish)
- fix(config): disable allow insecure by default in [#73](https://github.com/daeuniverse/daed/pull/73) by (@kunish)

### Other Changes

- ci: introduce generate-changelogs workflow in [#104](https://github.com/daeuniverse/daed/pull/104) by (@yqlbu)
- chore(sync): keep upstream source up-to-date in [#90](https://github.com/daeuniverse/daed/pull/90) by (@dae-bot[bot])
- chore(sync): keep upstream source up-to-date in [#86](https://github.com/daeuniverse/daed/pull/86) by (@dae-bot[bot])
- refactor: split orchestrate page into multiple components in [#81](https://github.com/daeuniverse/daed/pull/81) by (@kunish)
- ci: add sync-upstream workflow in [#76](https://github.com/daeuniverse/daed/pull/76) by (@yqlbu)
- ci(prerelease): include v*.*._rc_ (v0.1.1rc1) case in [#75](https://github.com/daeuniverse/daed/pull/75) by (@yqlbu)
- ci(release): retrieve release tag (version) from dispatch inputs in [#74](https://github.com/daeuniverse/daed/pull/74) by (@yqlbu)

**Full Changelog**: https://github.com/daeuniverse/daed/compare/v0.1.0rc...v0.1.0

### v0.1.0rc1

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
