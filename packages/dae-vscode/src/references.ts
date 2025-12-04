/**
 * References provider for dae language
 *
 * Finds all references to a symbol (group, subscription, node, etc.)
 */

import type { DocumentParser } from './parser'
import * as vscode from 'vscode'
import {
  findAllReferences,
  findReferenceAtPosition,
  findSymbolAtPosition,
  findSymbolByName,
  toVSCodeRange,
} from './parser'

export class DaeReferenceProvider implements vscode.ReferenceProvider {
  constructor(private parser: DocumentParser) {}

  provideReferences(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.ReferenceContext,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Location[]> {
    const parseResult = this.parser.parse(document)
    const locations: vscode.Location[] = []

    let targetName: string | null = null

    // Check if we're on a symbol definition
    const symbol = findSymbolAtPosition(parseResult.symbols, position)
    if (symbol && symbol.kind !== 'section' && symbol.kind !== 'parameter') {
      targetName = symbol.name

      // Include the definition itself if requested
      if (context.includeDeclaration) {
        locations.push(new vscode.Location(document.uri, toVSCodeRange(symbol.nameRange)))
      }
    }

    // Check if we're on a reference
    if (!targetName) {
      const reference = findReferenceAtPosition(parseResult.references, position)
      if (reference) {
        targetName = reference.name

        // Find and include the definition if requested
        if (context.includeDeclaration) {
          const sym = findSymbolByName(parseResult.symbols, reference.name)
          if (sym) {
            locations.push(new vscode.Location(document.uri, toVSCodeRange(sym.nameRange)))
          }
        }
      }
    }

    // Check if we're on a word that might be a reference
    if (!targetName) {
      const wordRange = document.getWordRangeAtPosition(position, /[\w-]+/)
      if (wordRange) {
        const word = document.getText(wordRange)
        // Try to find a symbol with this name
        const sym = findSymbolByName(parseResult.symbols, word)
        if (sym) {
          targetName = word
          if (context.includeDeclaration) {
            locations.push(new vscode.Location(document.uri, toVSCodeRange(sym.nameRange)))
          }
        }
      }
    }

    if (!targetName) {
      return null
    }

    // Find all references
    const refs = findAllReferences(parseResult.references, targetName)
    for (const ref of refs) {
      locations.push(new vscode.Location(document.uri, toVSCodeRange(ref.range)))
    }

    return locations
  }
}
