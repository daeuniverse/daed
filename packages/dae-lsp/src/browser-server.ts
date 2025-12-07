/**
 * DAE Language Server - Browser Entry Point
 *
 * This is the entry point for the browser/web worker version of the LSP server.
 * Uses a custom JSON-string based message protocol compatible with MonacoLspClient.
 */

import type {
  Disposable,
  Event,
  Message,
  MessageReader,
  MessageWriter,
  PartialMessageInfo,
} from 'vscode-languageserver/browser'
import { TextDocuments } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { createConnection, Emitter } from 'vscode-languageserver/browser'
import { initializeServer } from './server-core'

// @ts-expect-error - DedicatedWorkerGlobalScope is available in worker context
declare const self: DedicatedWorkerGlobalScope

/**
 * Custom MessageReader that reads JSON string messages from the main thread.
 * MonacoLspClient sends messages as JSON strings via postMessage.
 */
class JsonStringMessageReader implements MessageReader {
  private errorEmitter = new Emitter<Error>()
  private closeEmitter = new Emitter<void>()
  private messageEmitter = new Emitter<Message>()
  private partialMessageEmitter = new Emitter<PartialMessageInfo>()

  onError: Event<Error> = this.errorEmitter.event
  onClose: Event<void> = this.closeEmitter.event
  onPartialMessage: Event<PartialMessageInfo> = this.partialMessageEmitter.event

  private messageHandler = (event: MessageEvent): void => {
    try {
      const data = event.data
      // MonacoLspClient sends JSON strings
      const message = typeof data === 'string' ? JSON.parse(data) : data
      this.messageEmitter.fire(message)
    } catch (error) {
      console.error('[DAE LSP Worker] Error handling message:', error)
      this.errorEmitter.fire(error instanceof Error ? error : new Error(String(error)))
    }
  }

  constructor() {
    self.addEventListener('message', this.messageHandler)
  }

  listen(callback: (message: Message) => void): Disposable {
    return this.messageEmitter.event(callback)
  }

  dispose(): void {
    self.removeEventListener('message', this.messageHandler)
    this.errorEmitter.dispose()
    this.closeEmitter.dispose()
    this.messageEmitter.dispose()
    this.partialMessageEmitter.dispose()
  }
}

/**
 * Custom MessageWriter that sends JSON string messages to the main thread.
 * MonacoLspClient expects messages as JSON strings via postMessage.
 */
class JsonStringMessageWriter implements MessageWriter {
  private errorEmitter = new Emitter<[Error, Message | undefined, number | undefined]>()
  private closeEmitter = new Emitter<void>()

  onError: Event<[Error, Message | undefined, number | undefined]> = this.errorEmitter.event
  onClose: Event<void> = this.closeEmitter.event

  async write(msg: Message): Promise<void> {
    try {
      // Send as JSON string to match MonacoLspClient's expected format
      self.postMessage(JSON.stringify(msg))
    } catch (error) {
      this.errorEmitter.fire([error instanceof Error ? error : new Error(String(error)), msg, undefined])
    }
  }

  end(): void {
    this.closeEmitter.fire()
  }

  dispose(): void {
    this.errorEmitter.dispose()
    this.closeEmitter.dispose()
  }
}

// Create custom JSON-string based message reader/writer
const messageReader = new JsonStringMessageReader()
const messageWriter = new JsonStringMessageWriter()

// Create connection
const connection = createConnection(messageReader, messageWriter)

// Create document manager
const documents = new TextDocuments(TextDocument)

// Initialize the server
initializeServer(connection, documents)
