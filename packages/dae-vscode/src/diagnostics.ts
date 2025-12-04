/**
 * Diagnostics provider for dae language
 *
 * Provides real-time syntax error checking and warnings
 */

import type { DocumentParser } from './parser'
import * as vscode from 'vscode'
import { toVSCodeRange } from './parser'

export class DaeDiagnosticsProvider {
  private diagnosticCollection: vscode.DiagnosticCollection

  constructor(private parser: DocumentParser) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('dae')
  }

  /**
   * Update diagnostics for a document
   */
  update(document: vscode.TextDocument): void {
    if (document.languageId !== 'dae') {
      return
    }

    const parseResult = this.parser.parse(document)
    const diagnostics: vscode.Diagnostic[] = []

    for (const info of parseResult.diagnostics) {
      const severity = this.getSeverity(info.severity)
      const diagnostic = new vscode.Diagnostic(toVSCodeRange(info.range), info.message, severity)
      diagnostic.source = 'dae'
      diagnostics.push(diagnostic)
    }

    // Additional validation
    this.validateDocument(document, diagnostics)

    this.diagnosticCollection.set(document.uri, diagnostics)
  }

  /**
   * Clear diagnostics for a document
   */
  clear(uri: vscode.Uri): void {
    this.diagnosticCollection.delete(uri)
  }

  /**
   * Dispose the diagnostic collection
   */
  dispose(): void {
    this.diagnosticCollection.dispose()
  }

  /**
   * Get VS Code severity from string
   */
  private getSeverity(severity: 'error' | 'warning' | 'info'): vscode.DiagnosticSeverity {
    switch (severity) {
      case 'error':
        return vscode.DiagnosticSeverity.Error
      case 'warning':
        return vscode.DiagnosticSeverity.Warning
      case 'info':
        return vscode.DiagnosticSeverity.Information
      default:
        return vscode.DiagnosticSeverity.Warning
    }
  }

  /**
   * Additional document validation
   */
  private validateDocument(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]): void {
    const text = document.getText()
    const lines = text.split('\n')

    let braceCount = 0
    let inString: string | null = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        const prevChar = j > 0 ? line[j - 1] : ''

        // Skip escaped characters
        if (prevChar === '\\') continue

        // Track string state
        if (!inString && (char === "'" || char === '"')) {
          inString = char
        } else if (inString === char) {
          inString = null
        }

        // Skip content inside strings
        if (inString) continue

        // Skip content after comment
        if (char === '#') break

        // Track braces
        if (char === '{') {
          braceCount++
        } else if (char === '}') {
          braceCount--
          if (braceCount < 0) {
            diagnostics.push(
              new vscode.Diagnostic(
                new vscode.Range(i, j, i, j + 1),
                'Unexpected closing brace',
                vscode.DiagnosticSeverity.Error,
              ),
            )
            braceCount = 0
          }
        }
      }

      // Check for unclosed string at end of line
      if (inString) {
        // Strings can span multiple lines in some cases, but typically shouldn't
        // Reset for next line
        inString = null
      }
    }

    // Check for unclosed braces at end of file
    if (braceCount > 0) {
      diagnostics.push(
        new vscode.Diagnostic(
          new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1].length),
          `${braceCount} unclosed brace(s)`,
          vscode.DiagnosticSeverity.Error,
        ),
      )
    }
  }
}

/**
 * Create a diagnostics manager that updates on document changes
 */
export function createDiagnosticsManager(parser: DocumentParser): {
  provider: DaeDiagnosticsProvider
  disposables: vscode.Disposable[]
} {
  const provider = new DaeDiagnosticsProvider(parser)
  const disposables: vscode.Disposable[] = []

  // Update diagnostics when document changes
  disposables.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      provider.update(event.document)
    }),
  )

  // Update diagnostics when document opens
  disposables.push(
    vscode.workspace.onDidOpenTextDocument((document) => {
      provider.update(document)
    }),
  )

  // Clear diagnostics when document closes
  disposables.push(
    vscode.workspace.onDidCloseTextDocument((document) => {
      provider.clear(document.uri)
    }),
  )

  // Update all open dae documents
  for (const document of vscode.workspace.textDocuments) {
    if (document.languageId === 'dae') {
      provider.update(document)
    }
  }

  return { provider, disposables }
}
