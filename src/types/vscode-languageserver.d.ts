declare module 'vscode-languageserver/node' {
  export function createConnection(features: any): any;
  export class TextDocuments<T> {
    constructor(factory: any);
    listen(connection: any): void;
    get(uri: string): T | undefined;
    syncKind: number;
    onDidChangeContent(callback: (change: { document: T }) => void): void;
  }
  export const ProposedFeatures: { all: any };
  export interface InitializeParams {
    [key: string]: any;
  }
  export interface TextDocumentPositionParams {
    textDocument: { uri: string };
    position: { line: number; character: number };
  }
  export interface CompletionItem {
    label: string;
    kind: number;
    data?: any;
    detail?: string;
    documentation?: string;
  }
  export const CompletionItemKind: {
    Text: number;
    Method: number;
    Function: number;
    Constructor: number;
    Field: number;
    Variable: number;
    Class: number;
    Interface: number;
    Module: number;
    Property: number;
    Unit: number;
    Value: number;
    Enum: number;
    Keyword: number;
    Snippet: number;
    Color: number;
    File: number;
    Reference: number;
    Folder: number;
    EnumMember: number;
    Constant: number;
    Struct: number;
    Event: number;
    Operator: number;
    TypeParameter: number;
  };
  export interface Diagnostic {
    range: { start: { line: number; character: number }; end: { line: number; character: number } };
    message: string;
    severity?: number;
    source?: string;
  }
  export const DiagnosticSeverity: {
    Error: number;
    Warning: number;
    Information: number;
    Hint: number;
  };
  export const TextDocumentSyncKind: {
    None: number;
    Full: number;
    Incremental: number;
  };
  export interface HoverParams {
    textDocument: { uri: string };
    position: { line: number; character: number };
  }
  export interface Hover {
    contents: { kind: string; value: string } | string;
  }
  export const MarkupKind: {
    PlainText: string;
    Markdown: string;
  };
  export const DidChangeConfigurationNotification: {
    type: string;
  };
}

declare module 'vscode-languageserver-textdocument' {
  export class TextDocument {
    constructor(uri: string, languageId: string, version: number, content: string);
    getText(): string;
    positionAt(offset: number): { line: number; character: number };
    offsetAt(position: { line: number; character: number }): number;
    uri: string;
    lineCount: number;
    version: number;
    languageId: string;
  }
} 