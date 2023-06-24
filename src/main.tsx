/* eslint-disable import/default */

import '~/index.css'

import { loader } from '@monaco-editor/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import * as monaco from 'monaco-editor'
import { editor } from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import ReactDOM from 'react-dom/client'

import { App } from '~/App'
import { i18nInit } from '~/i18n'

import { EDITOR_THEME_LIGHT } from './constants'

dayjs.extend(duration)

const loadMonaco = () =>
  new Promise<void>((res) => {
    loader.config({ monaco })

    self.MonacoEnvironment = {
      createTrustedTypesPolicy() {
        return undefined
      },
      getWorker(_, label) {
        if (label === 'json') {
          return new jsonWorker()
        }

        if (label === 'css' || label === 'scss' || label === 'less') {
          return new cssWorker()
        }

        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new htmlWorker()
        }

        if (label === 'typescript' || label === 'javascript') {
          return new tsWorker()
        }

        return new editorWorker()
      },
    }

    loader.init().then((monaco) => {
      monaco.languages.register({ id: 'routingA', extensions: ['dae'] })

      monaco.languages.setMonarchTokensProvider('routingA', {
        defaultToken: 'invalid',
        ignoreCase: false,
        keywords: [
          // routing
          'geoip',
          'geosite',
          'pname',
          'dip',
          'sip',
          'dport',
          'sport',
          'l4proto',
          'ipversion',
          'mac',
          'domain',
          'fallback',
          'upstream',
          // dns
          'routing',
          'qname',
          'request',
          'response',
        ],
        brackets: [
          {
            open: '{',
            close: '}',
            token: 'delimiter.brackets',
          },
          {
            open: '(',
            close: ')',
            token: 'delimiter.parenthesis',
          },
        ],

        operators: ['->', '&&', '!', ':'],

        symbols: /[->&!:,.]+/,

        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
            { include: '@whitespace' },

            [/[{}()]/, '@brackets'],
            [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],

            [/[,]/, 'delimiter'],

            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

            [/'[^\\']'/, 'string'],
            [/'/, 'string.invalid'],
          ],

          string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }],
          ],

          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/#.*$/, 'comment'],
          ],
        },
      })

      import('monaco-themes/themes/GitHub.json').then((data) => {
        monaco.editor.defineTheme(EDITOR_THEME_LIGHT, data as editor.IStandaloneThemeData)

        res()
      })
    })
  })

Promise.all([i18nInit(), loadMonaco()]).then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
})
