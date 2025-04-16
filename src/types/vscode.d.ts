declare module 'vscode' {
  export = vscode;
}

declare module 'vscode-languageclient/node' {
  export interface ServerOptions {
    run: { module: string; transport: any };
    debug: { module: string; transport: any; options?: any };
  }

  export interface LanguageClientOptions {
    documentSelector: Array<{ scheme: string; language: string }>;
    synchronize: {
      fileEvents: any;
    };
  }

  export class LanguageClient {
    constructor(id: string, name: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
  }

  export const TransportKind: { ipc: any };
} 