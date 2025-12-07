/**
 * DAE Language Server - Node.js Entry Point
 *
 * This is the entry point for the Node.js version of the LSP server.
 * It uses vscode-languageserver/node for stdio/IPC communication.
 */

import { TextDocument } from 'vscode-languageserver-textdocument'
import { createConnection, ProposedFeatures, TextDocuments } from 'vscode-languageserver/node'
import { initializeServer } from './server-core'

// Create a connection for the server using stdio
const connection = createConnection(ProposedFeatures.all)

// Create document manager
const documents = new TextDocuments(TextDocument)

// Initialize the server
initializeServer(connection, documents)
