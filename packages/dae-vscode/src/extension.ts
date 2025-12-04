import * as vscode from 'vscode'

import { DaeCompletionProvider } from './completion'
import { DaeDefinitionProvider } from './definition'
import { createDiagnosticsManager } from './diagnostics'
import { DaeFormattingProvider } from './formatter'
import { DaeHoverProvider } from './hover'
import { DocumentParser } from './parser'
import { DaeReferenceProvider } from './references'
import { DaeRenameProvider } from './rename'
import { DaeSemanticTokensProvider, SEMANTIC_TOKENS_LEGEND } from './semanticTokens'

const LANGUAGE_ID = 'dae'

export function activate(context: vscode.ExtensionContext) {
  // Create shared parser instance
  const parser = new DocumentParser()

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

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider(LANGUAGE_ID, new DaeHoverProvider(parser))

  // Register definition provider
  const definitionProvider = vscode.languages.registerDefinitionProvider(LANGUAGE_ID, new DaeDefinitionProvider(parser))

  // Register reference provider
  const referenceProvider = vscode.languages.registerReferenceProvider(LANGUAGE_ID, new DaeReferenceProvider(parser))

  // Register rename provider
  const renameProvider = vscode.languages.registerRenameProvider(LANGUAGE_ID, new DaeRenameProvider(parser))

  // Register semantic tokens provider
  const semanticTokensProvider = vscode.languages.registerDocumentSemanticTokensProvider(
    LANGUAGE_ID,
    new DaeSemanticTokensProvider(parser),
    SEMANTIC_TOKENS_LEGEND,
  )

  // Setup diagnostics
  const { provider: diagnosticsProvider, disposables: diagnosticsDisposables } = createDiagnosticsManager(parser)

  context.subscriptions.push(
    completionProvider,
    formattingProvider,
    rangeFormattingProvider,
    hoverProvider,
    definitionProvider,
    referenceProvider,
    renameProvider,
    semanticTokensProvider,
    ...diagnosticsDisposables,
    { dispose: () => diagnosticsProvider.dispose() },
  )
}

export function deactivate() {
  // Cleanup if needed
}
