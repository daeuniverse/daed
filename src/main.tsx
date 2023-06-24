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
        // set defaultToken as `invalid` to turn on debug mode
        // defaultToken: 'invalid',
        ignoreCase: false,
        keywords: [
          'dip',
          'direct',
          'domain',
          'dport',
          'fallback',
          'geoip',
          'geosite',
          'ipversion',
          'l4proto',
          'mac',
          'pname',
          'qname',
          'request',
          'response',
          'routing',
          'sip',
          'sport',
          'tcp',
          'udp',
          'upstream',
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

        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

        operators: ['->', '&&', '!', ':'],

        symbols: /[->&!:,]+/,

        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, { cases: { '@keywords': 'keyword', '@default': 'identifier' } }],
            { include: '@whitespace' },

            [/[{}()]/, '@brackets'],
            [/@symbols/, { cases: { '@operators': 'operator', '@default': '' } }],

            [/[,]/, 'delimiter'],

            [/\d+/, 'number'],

            [/"([^"\\]|\\.)*$/, 'string.invalid'],
            [/'([^'\\]|\\.)*$/, 'string.invalid'],
            [/"/, 'string', '@string_double'],
            [/'/, 'string', '@string_single'],
          ],

          string_double: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, 'string', '@pop'],
          ],

          string_single: [
            [/[^\\']+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/'/, 'string', '@pop'],
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
