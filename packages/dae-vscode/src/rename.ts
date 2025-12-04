/**
 * Rename provider for dae language
 *
 * Renames symbols and updates all references
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

export class DaeRenameProvider implements vscode.RenameProvider {
  constructor(private parser: DocumentParser) {}

  prepareRename(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Range | { range: vscode.Range; placeholder: string }> {
    const parseResult = this.parser.parse(document)

    // Check if we're on a symbol definition
    const symbol = findSymbolAtPosition(parseResult.symbols, position)
    if (symbol && symbol.kind !== 'section' && symbol.kind !== 'parameter') {
      return {
        range: toVSCodeRange(symbol.nameRange),
        placeholder: symbol.name,
      }
    }

    // Check if we're on a reference
    const reference = findReferenceAtPosition(parseResult.references, position)
    if (reference) {
      return {
        range: toVSCodeRange(reference.range),
        placeholder: reference.name,
      }
    }

    // Check if we're on a word that might be a symbol
    const wordRange = document.getWordRangeAtPosition(position, /[\w-]+/)
    if (wordRange) {
      const word = document.getText(wordRange)
      const sym = findSymbolByName(parseResult.symbols, word)
      if (sym && sym.kind !== 'section' && sym.kind !== 'parameter') {
        return {
          range: wordRange,
          placeholder: word,
        }
      }
    }

    throw new Error('Cannot rename this element')
  }

  provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
    _token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.WorkspaceEdit> {
    const parseResult = this.parser.parse(document)
    const edit = new vscode.WorkspaceEdit()

    let targetName: string | null = null

    // Check if we're on a symbol definition
    const symbol = findSymbolAtPosition(parseResult.symbols, position)
    if (symbol && symbol.kind !== 'section' && symbol.kind !== 'parameter') {
      targetName = symbol.name
      // Rename the definition
      edit.replace(document.uri, toVSCodeRange(symbol.nameRange), newName)
    }

    // Check if we're on a reference
    if (!targetName) {
      const reference = findReferenceAtPosition(parseResult.references, position)
      if (reference) {
        targetName = reference.name
        // Find and rename the definition
        const sym = findSymbolByName(parseResult.symbols, reference.name)
        if (sym) {
          edit.replace(document.uri, toVSCodeRange(sym.nameRange), newName)
        }
      }
    }

    // Check if we're on a word that might be a symbol
    if (!targetName) {
      const wordRange = document.getWordRangeAtPosition(position, /[\w-]+/)
      if (wordRange) {
        const word = document.getText(wordRange)
        const sym = findSymbolByName(parseResult.symbols, word)
        if (sym && sym.kind !== 'section' && sym.kind !== 'parameter') {
          targetName = word
          edit.replace(document.uri, toVSCodeRange(sym.nameRange), newName)
        }
      }
    }

    if (!targetName) {
      return null
    }

    // Rename all references
    const refs = findAllReferences(parseResult.references, targetName)
    for (const ref of refs) {
      edit.replace(document.uri, toVSCodeRange(ref.range), newName)
    }

    return edit
  }
}
