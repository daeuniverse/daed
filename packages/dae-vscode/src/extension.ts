/**
 * DAE Language Extension for VS Code
 *
 * This extension provides language support for DAE configuration files
 * by connecting to the dae-lsp language server.
 */

import type { LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node'
import * as path from 'node:path'
import * as vscode from 'vscode'
import { LanguageClient, TransportKind } from 'vscode-languageclient/node'

const LANGUAGE_ID = 'dae'
let client: LanguageClient | undefined

export async function activate(context: vscode.ExtensionContext) {
  const serverModule = path.join(context.extensionPath, 'dist', 'server', 'server.cjs')

  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc,
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: {
        execArgv: ['--nolazy', '--inspect=6009'],
      },
    },
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector: [
      { scheme: 'file', language: LANGUAGE_ID },
      { scheme: 'untitled', language: LANGUAGE_ID },
    ],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.dae'),
    },
  }

  client = new LanguageClient('dae-language-server', 'DAE Language Server', serverOptions, clientOptions)

  try {
    await client.start()
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to start DAE Language Server: ${error}`)
    return
  }

  context.subscriptions.push(client)

  // Register document formatting provider (required because LSP client doesn't auto-register it)
  const createFormattingProvider = (scheme: string) =>
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: LANGUAGE_ID, scheme },
      {
        async provideDocumentFormattingEdits(document, options) {
          if (!client) return []

          try {
            const result = await client.sendRequest('textDocument/formatting', {
              textDocument: { uri: document.uri.toString() },
              options: {
                tabSize: options.tabSize,
                insertSpaces: options.insertSpaces,
              },
            })

            if (Array.isArray(result)) {
              return result.map(
                (edit: {
                  range: { start: { line: number; character: number }; end: { line: number; character: number } }
                  newText: string
                }) =>
                  new vscode.TextEdit(
                    new vscode.Range(
                      edit.range.start.line,
                      edit.range.start.character,
                      edit.range.end.line,
                      edit.range.end.character,
                    ),
                    edit.newText,
                  ),
              )
            }
          } catch {
            // Formatting failed silently
          }
          return []
        },
      },
    )

  context.subscriptions.push(createFormattingProvider('file'), createFormattingProvider('untitled'))
}

export async function deactivate(): Promise<void> {
  if (client) {
    await client.stop()
  }
}
