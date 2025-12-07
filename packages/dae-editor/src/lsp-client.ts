/**
 * Lightweight Monaco LSP Client
 *
 * A simple LSP client that connects Monaco editor to an LSP server running in a Web Worker.
 * This is a lightweight alternative to monaco-languageclient for simple use cases.
 */

import type * as monaco from 'monaco-editor'

// LSP Message types (subset)
interface RequestMessage {
  jsonrpc: '2.0'
  id: number
  method: string
  params?: unknown
}

interface ResponseMessage {
  jsonrpc: '2.0'
  id: number
  result?: unknown
  error?: { code: number; message: string; data?: unknown }
}

interface NotificationMessage {
  jsonrpc: '2.0'
  method: string
  params?: unknown
}

type Message = RequestMessage | ResponseMessage | NotificationMessage

// LSP types (subset)
export interface Position {
  line: number
  character: number
}

export interface Range {
  start: Position
  end: Position
}

export interface TextDocumentIdentifier {
  uri: string
}

export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier {
  version: number
}

export interface TextDocumentContentChangeEvent {
  range?: Range
  rangeLength?: number
  text: string
}

export interface CompletionItem {
  label: string
  kind?: number
  detail?: string
  documentation?: string | { kind: 'markdown' | 'plaintext'; value: string }
  insertText?: string
  insertTextFormat?: number
  textEdit?: { range: Range; newText: string }
}

export interface CompletionList {
  isIncomplete: boolean
  items: CompletionItem[]
}

export interface Hover {
  contents:
    | string
    | { kind: 'markdown' | 'plaintext'; value: string }
    | Array<string | { kind: 'markdown' | 'plaintext'; value: string }>
  range?: Range
}

export interface Diagnostic {
  range: Range
  message: string
  severity?: number
  code?: number | string
  source?: string
}

export interface TextEdit {
  range: Range
  newText: string
}

export interface Location {
  uri: string
  range: Range
}

// LSP Completion Item kinds
export const CompletionItemKind = {
  Text: 1,
  Method: 2,
  Function: 3,
  Constructor: 4,
  Field: 5,
  Variable: 6,
  Class: 7,
  Interface: 8,
  Module: 9,
  Property: 10,
  Unit: 11,
  Value: 12,
  Enum: 13,
  Keyword: 14,
  Snippet: 15,
  Color: 16,
  File: 17,
  Reference: 18,
  Folder: 19,
  EnumMember: 20,
  Constant: 21,
  Struct: 22,
  Event: 23,
  Operator: 24,
  TypeParameter: 25,
} as const

// Insert text format
export const InsertTextFormat = {
  PlainText: 1,
  Snippet: 2,
} as const

// Diagnostic severity
export const DiagnosticSeverity = {
  Error: 1,
  Warning: 2,
  Information: 3,
  Hint: 4,
} as const

/**
 * LSP Client for Monaco Editor
 */
/**
 * Config type context for filtering completions
 */
export type ConfigContext = 'routing' | 'dns' | null

/**
 * LSP Client for Monaco Editor
 */
export class MonacoLspClient {
  private worker: Worker
  private messageId = 0
  private pendingRequests = new Map<number, { resolve: (value: unknown) => void; reject: (reason: unknown) => void }>()
  private documentVersions = new Map<string, number>()
  private monacoInstance: typeof monaco | null = null
  private disposables: monaco.IDisposable[] = []
  private diagnosticsListeners: Array<(uri: string, diagnostics: Diagnostic[]) => void> = []
  private initialized = false
  private disposed = false
  private dynamicCompletionItems: CompletionItem[] = []
  private configContext: ConfigContext = null

  constructor(workerOrUrl: Worker | string | URL) {
    if (workerOrUrl instanceof Worker) {
      this.worker = workerOrUrl
    } else {
      this.worker = new Worker(workerOrUrl, { type: 'module' })
    }
    this.worker.onmessage = this.handleMessage.bind(this)
    this.worker.onerror = (error) => {
      console.error('LSP Worker error:', error)
    }
  }

  /**
   * Initialize the LSP connection
   */
  async initialize(): Promise<void> {
    if (this.initialized) return

    const result = await this.sendRequest('initialize', {
      processId: null,
      rootUri: null,
      capabilities: {
        textDocument: {
          completion: {
            completionItem: {
              snippetSupport: true,
              documentationFormat: ['markdown', 'plaintext'],
            },
          },
          hover: {
            contentFormat: ['markdown', 'plaintext'],
          },
          definition: {},
          references: {},
          rename: {
            prepareSupport: true,
          },
          formatting: {},
          publishDiagnostics: {},
          semanticTokens: {
            requests: { full: true },
            tokenTypes: [],
            tokenModifiers: [],
            formats: ['relative'],
          },
        },
      },
    })

    // Send initialized notification
    this.sendNotification('initialized', {})
    this.initialized = true

    return result as Promise<void>
  }

  /**
   * Register Monaco language providers
   */
  registerProviders(monacoInstance: typeof monaco, languageId: string): void {
    this.monacoInstance = monacoInstance

    // Completion provider
    this.disposables.push(
      monacoInstance.languages.registerCompletionItemProvider(languageId, {
        triggerCharacters: [':', '(', ','],
        provideCompletionItems: async (model, position) => {
          try {
            const uri = model.uri.toString()
            const result = await this.completion(uri, {
              line: position.lineNumber - 1,
              character: position.column - 1,
            })

            const items = result ? (Array.isArray(result) ? result : (result as CompletionList).items) : []

            // Get the current line text up to cursor for context-aware filtering
            const lineContent = model.getLineContent(position.lineNumber)
            const linePrefix = lineContent.substring(0, position.column - 1)

            // Filter suggestions based on config context and line context
            const filteredItems = this.filterCompletionsByContext(items, linePrefix)
            const suggestions = filteredItems.map((item) => this.convertCompletionItem(item, model, position))

            // Merge dynamic completion items (e.g., user-defined groups) only for routing context
            // Dynamic items are user-defined groups which are only relevant in routing configs
            if (this.configContext === 'routing' && this.dynamicCompletionItems.length > 0) {
              // Filter dynamic items based on context too
              const filteredDynamicItems = this.filterCompletionsByContext(this.dynamicCompletionItems, linePrefix)
              const dynamicSuggestions = filteredDynamicItems.map((item) =>
                this.convertCompletionItem(item, model, position),
              )
              return { suggestions: [...dynamicSuggestions, ...suggestions] }
            }

            return { suggestions }
          } catch {
            // Silently ignore canceled requests
            return { suggestions: [] }
          }
        },
      }),
    )

    // Hover provider
    this.disposables.push(
      monacoInstance.languages.registerHoverProvider(languageId, {
        provideHover: async (model, position) => {
          try {
            const uri = model.uri.toString()
            const result = await this.hover(uri, {
              line: position.lineNumber - 1,
              character: position.column - 1,
            })

            if (!result) return null

            return this.convertHover(result)
          } catch {
            // Silently ignore canceled requests
            return null
          }
        },
      }),
    )

    // Definition provider
    this.disposables.push(
      monacoInstance.languages.registerDefinitionProvider(languageId, {
        provideDefinition: async (model, position) => {
          try {
            const uri = model.uri.toString()
            const result = await this.definition(uri, {
              line: position.lineNumber - 1,
              character: position.column - 1,
            })

            if (!result) return null

            return this.convertLocation(result)
          } catch {
            // Silently ignore canceled requests
            return null
          }
        },
      }),
    )

    // References provider
    this.disposables.push(
      monacoInstance.languages.registerReferenceProvider(languageId, {
        provideReferences: async (model, position, context) => {
          try {
            const uri = model.uri.toString()
            const result = await this.references(
              uri,
              {
                line: position.lineNumber - 1,
                character: position.column - 1,
              },
              { includeDeclaration: context.includeDeclaration },
            )

            if (!result) return null

            return result.map((loc) => this.convertLocation(loc) as monaco.languages.Location)
          } catch {
            // Silently ignore canceled requests
            return null
          }
        },
      }),
    )

    // Rename provider
    this.disposables.push(
      monacoInstance.languages.registerRenameProvider(languageId, {
        provideRenameEdits: async (model, position, newName) => {
          try {
            const uri = model.uri.toString()
            const result = await this.rename(
              uri,
              {
                line: position.lineNumber - 1,
                character: position.column - 1,
              },
              newName,
            )

            if (!result) return null

            return this.convertWorkspaceEdit(result)
          } catch {
            // Silently ignore canceled requests
            return null
          }
        },
      }),
    )

    // Formatting provider
    this.disposables.push(
      monacoInstance.languages.registerDocumentFormattingEditProvider(languageId, {
        provideDocumentFormattingEdits: async (model, options) => {
          try {
            const uri = model.uri.toString()
            const result = await this.formatting(uri, {
              tabSize: options.tabSize,
              insertSpaces: options.insertSpaces,
            })

            if (!result) return null

            return result.map((edit) => this.convertTextEdit(edit))
          } catch {
            // Silently ignore canceled requests
            return null
          }
        },
      }),
    )
  }

  /**
   * Open a document
   */
  async didOpen(uri: string, languageId: string, version: number, text: string): Promise<void> {
    this.documentVersions.set(uri, version)
    this.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri,
        languageId,
        version,
        text,
      },
    })
  }

  /**
   * Update document content
   */
  async didChange(uri: string, changes: TextDocumentContentChangeEvent[]): Promise<void> {
    const version = (this.documentVersions.get(uri) || 0) + 1
    this.documentVersions.set(uri, version)

    this.sendNotification('textDocument/didChange', {
      textDocument: { uri, version },
      contentChanges: changes,
    })
  }

  /**
   * Close a document
   */
  async didClose(uri: string): Promise<void> {
    if (this.disposed) return
    this.documentVersions.delete(uri)
    this.sendNotification('textDocument/didClose', {
      textDocument: { uri },
    })
  }

  /**
   * Request completion
   */
  async completion(uri: string, position: Position): Promise<CompletionItem[] | CompletionList | null> {
    return this.sendRequest('textDocument/completion', {
      textDocument: { uri },
      position,
    }) as Promise<CompletionItem[] | CompletionList | null>
  }

  /**
   * Request hover
   */
  async hover(uri: string, position: Position): Promise<Hover | null> {
    return this.sendRequest('textDocument/hover', {
      textDocument: { uri },
      position,
    }) as Promise<Hover | null>
  }

  /**
   * Request definition
   */
  async definition(uri: string, position: Position): Promise<Location | Location[] | null> {
    return this.sendRequest('textDocument/definition', {
      textDocument: { uri },
      position,
    }) as Promise<Location | Location[] | null>
  }

  /**
   * Request references
   */
  async references(
    uri: string,
    position: Position,
    context: { includeDeclaration: boolean },
  ): Promise<Location[] | null> {
    return this.sendRequest('textDocument/references', {
      textDocument: { uri },
      position,
      context,
    }) as Promise<Location[] | null>
  }

  /**
   * Request rename
   */
  async rename(
    uri: string,
    position: Position,
    newName: string,
  ): Promise<{ changes?: Record<string, TextEdit[]> } | null> {
    return this.sendRequest('textDocument/rename', {
      textDocument: { uri },
      position,
      newName,
    }) as Promise<{ changes?: Record<string, TextEdit[]> } | null>
  }

  /**
   * Request formatting
   */
  async formatting(uri: string, options: { tabSize: number; insertSpaces: boolean }): Promise<TextEdit[] | null> {
    return this.sendRequest('textDocument/formatting', {
      textDocument: { uri },
      options,
    }) as Promise<TextEdit[] | null>
  }

  /**
   * Add diagnostics listener
   */
  onDiagnostics(listener: (uri: string, diagnostics: Diagnostic[]) => void): void {
    this.diagnosticsListeners.push(listener)
  }

  /**
   * Set dynamic completion items that will be merged with LSP completions
   * Use this to add user-defined items like group names
   */
  setDynamicCompletionItems(items: CompletionItem[]): void {
    this.dynamicCompletionItems = items
  }

  /**
   * Set config context for filtering completions
   * @param context - 'routing' for routing config, 'dns' for DNS config
   */
  setConfigContext(context: ConfigContext): void {
    this.configContext = context
  }

  /**
   * Get current config context
   */
  getConfigContext(): ConfigContext {
    return this.configContext
  }

  // ========== Routing context whitelist ==========
  // Functions allowed in routing context
  private static readonly ROUTING_FUNCTIONS = new Set([
    'domain',
    'ip',
    'dip',
    'sip',
    'dport',
    'sport',
    'port',
    'sourcePort',
    'l4proto',
    'ipversion',
    'mac',
    'pname',
    'qname', // qname can be used in routing rules too
    'network',
    'dscp',
    'source',
    'inboundTag',
    'protocol',
    'user',
  ])

  // Match types allowed in routing context
  private static readonly ROUTING_MATCH_TYPES = new Set(['full', 'contains', 'regexp', 'geosite', 'geoip', 'ext'])

  // Outbound keywords allowed in routing context
  private static readonly ROUTING_OUTBOUNDS = new Set(['proxy', 'block', 'direct', 'must_direct', 'must_proxy'])

  // Keywords allowed in routing context
  private static readonly ROUTING_KEYWORDS = new Set(['fallback', 'must_rules', 'Fallback', 'Must Rules'])

  // ========== DNS context whitelist ==========
  // Functions allowed in DNS context
  private static readonly DNS_FUNCTIONS = new Set(['qname', 'qtype'])

  // Keywords allowed in DNS context
  private static readonly DNS_KEYWORDS = new Set([
    'upstream',
    'request',
    'response',
    'fallback',
    'Upstream',
    'Request',
    'Response',
    'Fallback',
    'Request Section',
    'Response Section',
    'Fallback Upstream',
  ])

  // DNS also uses outbounds for routing responses
  private static readonly DNS_OUTBOUNDS = new Set(['reject', 'accept'])

  /**
   * Filter completion items based on current config context and line context
   * Uses whitelist approach for precise filtering
   * @param items - Completion items from LSP
   * @param linePrefix - The text before cursor on current line (for context-aware filtering)
   */
  private filterCompletionsByContext(items: CompletionItem[], linePrefix: string = ''): CompletionItem[] {
    if (!this.configContext) {
      // No context set - return all items
      return items
    }

    // Check if we're after a colon (e.g., "fallback:", "geosite:")
    const isAfterColon = linePrefix.endsWith(':') || /:\s*\w*$/.test(linePrefix)
    const colonMatch = linePrefix.match(/(\w+)\s*:\s*\w*$/)
    const keyBeforeColon = colonMatch ? colonMatch[1].toLowerCase() : ''

    // Check if we're inside a function call (e.g., "qname(" or "domain(")
    // Match pattern like "functionName(" with optional content but no closing paren
    const funcCallMatch = linePrefix.match(/(\w+)\s*\([^)]*$/)
    const insideFunctionCall = funcCallMatch ? funcCallMatch[1].toLowerCase() : ''

    // Check if we're after "->" (outbound position)
    const isAfterArrow = /->\s*\w*$/.test(linePrefix)

    return items.filter((item) => {
      const label = typeof item.label === 'string' ? item.label : item.label
      const detail = item.detail || ''

      if (this.configContext === 'routing') {
        // After "->", show outbounds and user groups
        if (isAfterArrow) {
          if (MonacoLspClient.ROUTING_OUTBOUNDS.has(label)) {
            return true
          }
          if (detail.includes('group') || detail.includes('Group')) {
            return true
          }
          return false
        }

        // After "fallback:", only show outbounds and user groups
        if (keyBeforeColon === 'fallback') {
          if (MonacoLspClient.ROUTING_OUTBOUNDS.has(label)) {
            return true
          }
          if (detail.includes('group') || detail.includes('Group')) {
            return true
          }
          return false
        }

        // After match type prefix (geosite:, geoip:, etc.), don't show completions
        // User should type the tag manually
        if (MonacoLspClient.ROUTING_MATCH_TYPES.has(keyBeforeColon)) {
          return false
        }

        // Inside function call like qname(), domain(), etc. - show match types primarily
        if (insideFunctionCall && MonacoLspClient.ROUTING_FUNCTIONS.has(insideFunctionCall)) {
          // Inside function args - primarily show match types
          if (MonacoLspClient.ROUTING_MATCH_TYPES.has(label)) {
            return true
          }
          // Don't show functions inside function args
          return false
        }

        // Allow routing functions
        if (MonacoLspClient.ROUTING_FUNCTIONS.has(label)) {
          return true
        }
        // Allow match types
        if (MonacoLspClient.ROUTING_MATCH_TYPES.has(label)) {
          return true
        }
        // Allow outbounds
        if (MonacoLspClient.ROUTING_OUTBOUNDS.has(label)) {
          return true
        }
        // Allow routing keywords
        if (MonacoLspClient.ROUTING_KEYWORDS.has(label) || MonacoLspClient.ROUTING_KEYWORDS.has(detail)) {
          return true
        }
        // Allow user-defined groups (detail contains 'Proxy group' or 'User group')
        if (detail.includes('group') || detail.includes('Group')) {
          return true
        }
        // Reject everything else
        return false
      }

      if (this.configContext === 'dns') {
        // After "fallback:", only show user-defined upstreams
        if (keyBeforeColon === 'fallback') {
          if (detail.includes('upstream') || detail.includes('Upstream') || detail === 'DNS upstream') {
            return true
          }
          return false
        }

        // Inside function call like qname() - show match types
        if (insideFunctionCall && MonacoLspClient.DNS_FUNCTIONS.has(insideFunctionCall)) {
          // Inside function args - show match types (geosite, etc.)
          if (MonacoLspClient.ROUTING_MATCH_TYPES.has(label)) {
            return true
          }
          // Don't show other items inside function args
          return false
        }

        // At line start or after keywords, show DNS functions and keywords
        // Allow DNS functions
        if (MonacoLspClient.DNS_FUNCTIONS.has(label)) {
          return true
        }
        // Allow DNS keywords only at line start (not after colon)
        if (!isAfterColon) {
          if (MonacoLspClient.DNS_KEYWORDS.has(label) || MonacoLspClient.DNS_KEYWORDS.has(detail)) {
            return true
          }
        }
        // Allow DNS outbounds
        if (MonacoLspClient.DNS_OUTBOUNDS.has(label)) {
          return true
        }
        // Allow user-defined upstreams (detail contains 'upstream' or 'Upstream')
        if (detail.includes('upstream') || detail.includes('Upstream') || detail === 'DNS upstream') {
          return true
        }
        // Reject everything else
        return false
      }

      return true
    })
  }

  /**
   * Dispose the client
   */
  dispose(): void {
    if (this.disposed) return
    this.disposed = true

    this.sendNotification('shutdown', {})
    this.sendNotification('exit', {})

    for (const disposable of this.disposables) {
      disposable.dispose()
    }
    this.disposables = []

    // Reject all pending requests with a canceled error
    for (const [, pending] of this.pendingRequests) {
      const error = new Error('Canceled')
      ;(error as any).code = -32800
      pending.reject(error)
    }
    this.pendingRequests.clear()

    this.worker.terminate()
    this.documentVersions.clear()
    this.diagnosticsListeners = []
  }

  // Private methods

  private sendRequest(method: string, params?: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      if (this.disposed) {
        const error = new Error('Canceled')
        ;(error as any).code = -32800
        reject(error)
        return
      }

      const id = ++this.messageId
      this.pendingRequests.set(id, { resolve, reject })

      const message: RequestMessage = {
        jsonrpc: '2.0',
        id,
        method,
        params,
      }

      try {
        this.worker.postMessage(JSON.stringify(message))
      } catch {
        this.pendingRequests.delete(id)
        const error = new Error('Canceled')
        ;(error as any).code = -32800
        reject(error)
      }
    })
  }

  private sendNotification(method: string, params?: unknown): void {
    const message: NotificationMessage = {
      jsonrpc: '2.0',
      method,
      params,
    }

    this.worker.postMessage(JSON.stringify(message))
  }

  private handleMessage(event: MessageEvent): void {
    const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
    const message = data as Message

    if ('id' in message && message.id !== undefined) {
      // Response message
      const pending = this.pendingRequests.get(message.id)
      if (pending) {
        this.pendingRequests.delete(message.id)
        if ('error' in message && message.error) {
          pending.reject(message.error)
        } else {
          pending.resolve((message as ResponseMessage).result)
        }
      }
    } else if ('method' in message) {
      // Notification message
      this.handleNotification(message as NotificationMessage)
    }
  }

  private handleNotification(message: NotificationMessage): void {
    if (message.method === 'textDocument/publishDiagnostics') {
      const params = message.params as { uri: string; diagnostics: Diagnostic[] }
      for (const listener of this.diagnosticsListeners) {
        listener(params.uri, params.diagnostics)
      }
    }
  }

  private convertCompletionItem(
    item: CompletionItem,
    model: monaco.editor.ITextModel,
    position: monaco.Position,
  ): monaco.languages.CompletionItem {
    const word = model.getWordUntilPosition(position)
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    }

    return {
      label: item.label,
      kind: this.convertCompletionItemKind(item.kind),
      detail: item.detail,
      documentation: this.convertMarkupContent(item.documentation),
      insertText: item.insertText || item.label,
      insertTextRules:
        item.insertTextFormat === InsertTextFormat.Snippet
          ? this.monacoInstance!.languages.CompletionItemInsertTextRule.InsertAsSnippet
          : undefined,
      range,
    }
  }

  private convertCompletionItemKind(kind?: number): monaco.languages.CompletionItemKind {
    if (!this.monacoInstance) return 0

    const map: Record<number, monaco.languages.CompletionItemKind> = {
      [CompletionItemKind.Text]: this.monacoInstance.languages.CompletionItemKind.Text,
      [CompletionItemKind.Method]: this.monacoInstance.languages.CompletionItemKind.Method,
      [CompletionItemKind.Function]: this.monacoInstance.languages.CompletionItemKind.Function,
      [CompletionItemKind.Constructor]: this.monacoInstance.languages.CompletionItemKind.Constructor,
      [CompletionItemKind.Field]: this.monacoInstance.languages.CompletionItemKind.Field,
      [CompletionItemKind.Variable]: this.monacoInstance.languages.CompletionItemKind.Variable,
      [CompletionItemKind.Class]: this.monacoInstance.languages.CompletionItemKind.Class,
      [CompletionItemKind.Interface]: this.monacoInstance.languages.CompletionItemKind.Interface,
      [CompletionItemKind.Module]: this.monacoInstance.languages.CompletionItemKind.Module,
      [CompletionItemKind.Property]: this.monacoInstance.languages.CompletionItemKind.Property,
      [CompletionItemKind.Unit]: this.monacoInstance.languages.CompletionItemKind.Unit,
      [CompletionItemKind.Value]: this.monacoInstance.languages.CompletionItemKind.Value,
      [CompletionItemKind.Enum]: this.monacoInstance.languages.CompletionItemKind.Enum,
      [CompletionItemKind.Keyword]: this.monacoInstance.languages.CompletionItemKind.Keyword,
      [CompletionItemKind.Snippet]: this.monacoInstance.languages.CompletionItemKind.Snippet,
      [CompletionItemKind.Color]: this.monacoInstance.languages.CompletionItemKind.Color,
      [CompletionItemKind.File]: this.monacoInstance.languages.CompletionItemKind.File,
      [CompletionItemKind.Reference]: this.monacoInstance.languages.CompletionItemKind.Reference,
      [CompletionItemKind.Folder]: this.monacoInstance.languages.CompletionItemKind.Folder,
      [CompletionItemKind.EnumMember]: this.monacoInstance.languages.CompletionItemKind.EnumMember,
      [CompletionItemKind.Constant]: this.monacoInstance.languages.CompletionItemKind.Constant,
      [CompletionItemKind.Struct]: this.monacoInstance.languages.CompletionItemKind.Struct,
      [CompletionItemKind.Event]: this.monacoInstance.languages.CompletionItemKind.Event,
      [CompletionItemKind.Operator]: this.monacoInstance.languages.CompletionItemKind.Operator,
      [CompletionItemKind.TypeParameter]: this.monacoInstance.languages.CompletionItemKind.TypeParameter,
    }

    return map[kind || 0] || this.monacoInstance.languages.CompletionItemKind.Text
  }

  private convertMarkupContent(
    content?: string | { kind: string; value: string },
  ): string | monaco.IMarkdownString | undefined {
    if (!content) return undefined
    if (typeof content === 'string') return content
    if (content.kind === 'markdown') {
      return { value: content.value }
    }
    return content.value
  }

  private convertHover(hover: Hover): monaco.languages.Hover {
    let contents: monaco.IMarkdownString[]

    if (typeof hover.contents === 'string') {
      contents = [{ value: hover.contents }]
    } else if (Array.isArray(hover.contents)) {
      contents = hover.contents.map((c) => {
        if (typeof c === 'string') return { value: c }
        return { value: c.value }
      })
    } else {
      contents = [{ value: hover.contents.value }]
    }

    return {
      contents,
      range: hover.range ? this.convertRange(hover.range) : undefined,
    }
  }

  private convertRange(range: Range): monaco.IRange {
    return {
      startLineNumber: range.start.line + 1,
      startColumn: range.start.character + 1,
      endLineNumber: range.end.line + 1,
      endColumn: range.end.character + 1,
    }
  }

  private convertLocation(location: Location | Location[]): monaco.languages.Location | monaco.languages.Location[] {
    if (Array.isArray(location)) {
      return location.map((loc) => ({
        uri: this.monacoInstance!.Uri.parse(loc.uri),
        range: this.convertRange(loc.range),
      }))
    }

    return {
      uri: this.monacoInstance!.Uri.parse(location.uri),
      range: this.convertRange(location.range),
    }
  }

  private convertTextEdit(edit: TextEdit): monaco.languages.TextEdit {
    return {
      range: this.convertRange(edit.range),
      text: edit.newText,
    }
  }

  private convertWorkspaceEdit(edit: { changes?: Record<string, TextEdit[]> }): monaco.languages.WorkspaceEdit {
    const edits: monaco.languages.IWorkspaceTextEdit[] = []

    if (edit.changes) {
      for (const [uri, textEdits] of Object.entries(edit.changes)) {
        for (const textEdit of textEdits) {
          edits.push({
            resource: this.monacoInstance!.Uri.parse(uri),
            textEdit: this.convertTextEdit(textEdit),
            versionId: undefined,
          })
        }
      }
    }

    return { edits }
  }
}
