"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = __importDefault(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const translator_1 = require("./translator");
const node_1 = require("vscode-languageclient/node");
let client;
function activate(context) {
    console.log('中文编程语言扩展已激活');
    // 创建转译器实例
    const translator = new translator_1.ChineseTranslator();
    // 注册转译并运行命令
    const runCommand = vscode_1.default.commands.registerCommand('chineseprog.runCode', async () => {
        const editor = vscode_1.default.window.activeTextEditor;
        if (!editor) {
            vscode_1.default.window.showErrorMessage('没有打开的文件');
            return;
        }
        if (editor.document.languageId !== 'chineseprog') {
            vscode_1.default.window.showErrorMessage('当前文件不是中文编程文件');
            return;
        }
        const sourceCode = editor.document.getText();
        try {
            // 创建输出窗口（提前创建，以便显示调试信息）
            const outputChannel = vscode_1.default.window.createOutputChannel('中文编程');
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
            exec(`node "${tempFile}"`, (error, stdout, stderr) => {
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
        }
        catch (error) {
            if (error instanceof Error) {
                vscode_1.default.window.showErrorMessage(`转译错误: ${error.message}`);
            }
            else {
                vscode_1.default.window.showErrorMessage(`转译错误: ${String(error)}`);
            }
        }
    });
    // 注册代码提示功能
    const completionProvider = vscode_1.default.languages.registerCompletionItemProvider('chineseprog', {
        provideCompletionItems() {
            const completionItems = [
                new vscode_1.default.CompletionItem('如果', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('否则', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('否则如果', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('循环', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('当', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('函数', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('返回', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('变量', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('常量', vscode_1.default.CompletionItemKind.Keyword),
                new vscode_1.default.CompletionItem('输出', vscode_1.default.CompletionItemKind.Function),
                new vscode_1.default.CompletionItem('警告', vscode_1.default.CompletionItemKind.Function),
                new vscode_1.default.CompletionItem('错误', vscode_1.default.CompletionItemKind.Function),
                new vscode_1.default.CompletionItem('信息', vscode_1.default.CompletionItemKind.Function),
            ];
            return completionItems;
        }
    });
    // 注册命令到VSCode命令面板
    context.subscriptions.push(runCommand, completionProvider, 
    // 添加运行按钮到编辑器右上角
    vscode_1.default.window.registerWebviewViewProvider('chineseprog.runView', {
        resolveWebviewView(webviewView) {
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
            webviewView.webview.onDidReceiveMessage((message) => {
                if (message.command === 'run') {
                    vscode_1.default.commands.executeCommand('chineseprog.runCode');
                }
            });
        }
    }));
    try {
        // 启动语言服务器
        const serverModule = context.asAbsolutePath(path.join('out', 'server.js'));
        const serverOptions = {
            run: { module: serverModule, transport: node_1.TransportKind.ipc },
            debug: {
                module: serverModule,
                transport: node_1.TransportKind.ipc,
                options: { execArgv: ['--nolazy', '--inspect=6009'] }
            }
        };
        const clientOptions = {
            documentSelector: [{ scheme: 'file', language: 'chineseprog' }],
            synchronize: {
                fileEvents: vscode_1.default.workspace.createFileSystemWatcher('**/.clientrc')
            }
        };
        client = new node_1.LanguageClient('chineseLanguageServer', '中文编程语言服务器', serverOptions, clientOptions);
        client.start();
    }
    catch (error) {
        console.error('语言服务器启动失败:', error);
    }
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map