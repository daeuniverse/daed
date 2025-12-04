/**
 * Definition provider for dae language
 *
 * Provides go-to-definition functionality for groups, subscriptions, nodes, etc.
 */

import type { DocumentParser } from './parser'
import * as vscode from 'vscode'
import { findReferenceAtPosition, findSymbolByName, toVSCodeRange } from './parser'

export class DaeDefinitionProvider implements vscode.DefinitionProvider {
  constructor(private parser: DocumentParser) {}

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
    const parseResult = this.parser.parse(document)

    // Check if we're on a reference
    const reference = findReferenceAtPosition(parseResult.references, position)
    if (reference) {
      // Map reference kind to symbol kind
      const kindMap: Record<string, string> = {
        group: 'group',
        subscription: 'subscription',
        node: 'node',
        upstream: 'upstream',
      }

      const symbol = findSymbolByName(
        parseResult.symbols,
        reference.name,
        kindMap[reference.kind] as 'group' | 'subscription' | 'node' | 'upstream',
      )
      if (symbol) {
        return new vscode.Location(document.uri, toVSCodeRange(symbol.nameRange))
      }
    }

    // Check if we're on a word that might be a group reference (e.g., after ->)
    const wordRange = document.getWordRangeAtPosition(position, /[\w-]+/)
    if (wordRange) {
      const word = document.getText(wordRange)
      const line = document.lineAt(position.line).text

      // Check if this is after an arrow (routing rule outbound)
      if (line.includes('->')) {
        const symbol = findSymbolByName(parseResult.symbols, word, 'group')
        if (symbol) {
          return new vscode.Location(document.uri, toVSCodeRange(symbol.nameRange))
        }
      }

      // Check if this is after fallback:
      if (line.includes('fallback:')) {
        // In DNS routing, fallback can be an upstream reference
        const symbol =
          findSymbolByName(parseResult.symbols, word, 'upstream') ||
          findSymbolByName(parseResult.symbols, word, 'group')
        if (symbol) {
          return new vscode.Location(document.uri, toVSCodeRange(symbol.nameRange))
        }
      }

      // Check if this is a DNS upstream reference (after -> in dns routing)
      // Look for pattern like: qname(...) -> upstreamName
      const arrowMatch = line.match(/->\s*(\w+)/)
      if (arrowMatch && word === arrowMatch[1]) {
        // Try upstream first (for DNS routing), then group (for traffic routing)
        const symbol =
          findSymbolByName(parseResult.symbols, word, 'upstream') ||
          findSymbolByName(parseResult.symbols, word, 'group')
        if (symbol) {
          return new vscode.Location(document.uri, toVSCodeRange(symbol.nameRange))
        }
      }

      // Check if this is inside upstream() function call - e.g., upstream(googledns)
      const upstreamFuncMatch = line.match(/upstream\(([\w,\s]+)\)/)
      if (upstreamFuncMatch) {
        const args = upstreamFuncMatch[1].split(',').map((a) => a.trim())
        if (args.includes(word)) {
          const symbol = findSymbolByName(parseResult.symbols, word, 'upstream')
          if (symbol) {
            return new vscode.Location(document.uri, toVSCodeRange(symbol.nameRange))
          }
        }
      }
    }

    return null
  }
}
