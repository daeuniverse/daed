import * as vscode from 'vscode'

import { DaeCompletionProvider } from './completion'
import { DaeFormattingProvider } from './formatter'

const LANGUAGE_ID = 'dae'

export function activate(context: vscode.ExtensionContext) {
  // Register completion provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    LANGUAGE_ID,
    new DaeCompletionProvider(),
    '.', // Trigger on dot for type prefixes like geosite:
    ':', // Trigger on colon for type prefixes
  )

  // Register document formatting provider
  const formattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    LANGUAGE_ID,
    new DaeFormattingProvider(),
  )

  // Register range formatting provider
  const rangeFormattingProvider = vscode.languages.registerDocumentRangeFormattingEditProvider(
    LANGUAGE_ID,
    new DaeFormattingProvider(),
  )

  context.subscriptions.push(completionProvider, formattingProvider, rangeFormattingProvider)
}

export function deactivate() {
  // Cleanup if needed
}
