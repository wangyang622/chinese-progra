import vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ChineseTranslator } from './translator';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: vscode.ExtensionContext) {
  console.log('中文编程语言扩展已激活');
  
  // 创建转译器实例
  const translator = new ChineseTranslator();
  
  // 注册转译并运行命令
  const runCommand = vscode.commands.registerCommand('chineseprog.runCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('没有打开的文件');
      return;
    }
    
    if (editor.document.languageId !== 'chineseprog') {
      vscode.window.showErrorMessage('当前文件不是中文编程文件');
      return;
    }
    
    const sourceCode = editor.document.getText();
    
    try {
      // 创建输出窗口（提前创建，以便显示调试信息）
      const outputChannel = vscode.window.createOutputChannel('中文编程');
      outputChannel.show();
      outputChannel.appendLine('开始转译中文程序...');
      outputChannel.appendLine('源代码:');
      outputChannel.appendLine('-----------------------------------');
      outputChannel.appendLine(sourceCode);
      outputChannel.appendLine('-----------------------------------');
      
      // 转译中文代码到JavaScript
      const translatedCode = translator.translate(sourceCode);
      
      outputChannel.appendLine('转译后代码:');
      outputChannel.appendLine('-----------------------------------');
      outputChannel.appendLine(translatedCode);
      outputChannel.appendLine('-----------------------------------');
      
      // 创建临时JS文件
      const tempDir = path.join(context.extensionPath, 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      const tempFile = path.join(tempDir, 'translated.js');
      fs.writeFileSync(tempFile, translatedCode);
      
      outputChannel.appendLine('临时文件路径: ' + tempFile);
      outputChannel.appendLine('运行中文程序...');
      
      // 使用Node.js运行转译后的代码
      const { exec } = require('child_process');
      exec(`node "${tempFile}"`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          outputChannel.appendLine(`错误: ${error.message}`);
          return;
        }
        if (stderr) {
          outputChannel.appendLine(`stderr: ${stderr}`);
          return;
        }
        outputChannel.appendLine(`输出:\n${stdout}`);
      });
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`转译错误: ${error.message}`);
      } else {
        vscode.window.showErrorMessage(`转译错误: ${String(error)}`);
      }
    }
  });
  
  // 注册代码提示功能
  const completionProvider = vscode.languages.registerCompletionItemProvider('chineseprog', {
    provideCompletionItems() {
      const completionItems = [
        new vscode.CompletionItem('如果', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('否则', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('否则如果', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('循环', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('当', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('函数', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('返回', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('变量', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('常量', vscode.CompletionItemKind.Keyword),
        new vscode.CompletionItem('输出', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('警告', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('错误', vscode.CompletionItemKind.Function),
        new vscode.CompletionItem('信息', vscode.CompletionItemKind.Function),
      ];
      return completionItems;
    }
  });
  
  // 注册命令到VSCode命令面板
  context.subscriptions.push(
    runCommand,
    completionProvider,
    // 添加运行按钮到编辑器右上角
    vscode.window.registerWebviewViewProvider('chineseprog.runView', {
      resolveWebviewView(webviewView: vscode.WebviewView) {
        webviewView.webview.options = {
          enableScripts: true
        };
        webviewView.webview.html = `
          <html>
            <body>
              <button id="runBtn" style="padding: 8px 12px; background-color: #0078D7; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%; margin-top: 10px;">运行中文代码</button>
              <script>
                const vscode = acquireVsCodeApi();
                document.getElementById('runBtn').addEventListener('click', () => {
                  vscode.postMessage({ command: 'run' });
                });
                window.addEventListener('message', event => {
                  const message = event.data;
                });
              </script>
            </body>
          </html>
        `;
        webviewView.webview.onDidReceiveMessage((message: { command: string }) => {
          if (message.command === 'run') {
            vscode.commands.executeCommand('chineseprog.runCode');
          }
        });
      }
    })
  );
  
  try {
    // 启动语言服务器
    const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));
    const serverOptions: ServerOptions = {
      run: { module: serverModule, transport: TransportKind.ipc },
      debug: {
        module: serverModule,
        transport: TransportKind.ipc,
        options: { execArgv: ['--nolazy', '--inspect=6009'] }
      }
    };
    
    const clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: 'file', language: 'chineseprog' }],
      synchronize: {
        fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
      }
    };
    
    client = new LanguageClient(
      'chineseLanguageServer',
      '中文编程语言服务器',
      serverOptions,
      clientOptions
    );
    
    client.start();
  } catch (error) {
    console.error('语言服务器启动失败:', error);
  }
}

export function deactivate() {
  if (!client) {
    return undefined;
  }
  return client.stop();
} 