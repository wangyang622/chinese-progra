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
const formatter_1 = require("./formatter");
function activate(context) {
    console.log('Chinese Code Runner activated');
    // 创建转译器实例
    const translator = new translator_1.ChineseTranslator();
    // 创建格式化器实例
    const formatter = new formatter_1.ChineseFormatter();
    // 创建输出通道
    const outputChannel = vscode_1.default.window.createOutputChannel('Chinese Code Runner');
    // 注册运行命令
    const runCommand = vscode_1.default.commands.registerCommand('chineseprog.runCode', async () => {
        const editor = vscode_1.default.window.activeTextEditor;
        if (!editor) {
            vscode_1.default.window.showErrorMessage('No file is open');
            return;
        }
        // 获取文件内容和路径
        const sourceCode = editor.document.getText();
        const sourceFilePath = editor.document.uri.fsPath;
        const sourceFileDir = path.dirname(sourceFilePath);
        const sourceFileName = path.basename(sourceFilePath, path.extname(sourceFilePath));
        const outputJsFile = path.join(sourceFileDir, sourceFileName + '.js');
        try {
            // 显示输出窗口
            outputChannel.clear();
            outputChannel.show();
            outputChannel.appendLine('Starting translation...');
            outputChannel.appendLine('Source code:');
            outputChannel.appendLine('-----------------------------------');
            outputChannel.appendLine(sourceCode);
            outputChannel.appendLine('-----------------------------------');
            // 转译中文代码到JavaScript
            const translatedCode = translator.translate(sourceCode);
            outputChannel.appendLine('Translated code:');
            outputChannel.appendLine('-----------------------------------');
            outputChannel.appendLine(translatedCode);
            outputChannel.appendLine('-----------------------------------');
            // 创建JS文件在同一目录
            fs.writeFileSync(outputJsFile, translatedCode);
            outputChannel.appendLine('Generated JavaScript file: ' + outputJsFile);
            outputChannel.appendLine('Running code...');
            // 使用Node.js运行转译后的代码
            const { exec } = require('child_process');
            exec(`node "${outputJsFile}"`, (error, stdout, stderr) => {
                if (error) {
                    outputChannel.appendLine(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    outputChannel.appendLine(`Stderr: ${stderr}`);
                    return;
                }
                outputChannel.appendLine(`Output:\n${stdout}`);
            });
        }
        catch (error) {
            if (error instanceof Error) {
                vscode_1.default.window.showErrorMessage(`Translation error: ${error.message}`);
            }
            else {
                vscode_1.default.window.showErrorMessage(`Translation error: ${String(error)}`);
            }
        }
    });
    // 注册格式化命令
    const formatCommand = vscode_1.default.commands.registerCommand('chineseprog.formatCode', async () => {
        const editor = vscode_1.default.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'chineseprog') {
            return;
        }
        try {
            // 通过VSCode API执行格式化操作
            await vscode_1.default.commands.executeCommand('editor.action.formatDocument');
            vscode_1.default.window.showInformationMessage('代码格式化成功');
        }
        catch (error) {
            vscode_1.default.window.showErrorMessage(`格式化错误: ${error}`);
        }
    });
    // 注册文档格式化提供程序
    const docFormattingProvider = vscode_1.default.languages.registerDocumentFormattingEditProvider('chineseprog', {
        provideDocumentFormattingEdits: (document, options) => {
            return formatter.provideDocumentFormattingEdits(document, options);
        }
    });
    // 注册区域格式化提供程序
    const rangeFormattingProvider = vscode_1.default.languages.registerDocumentRangeFormattingEditProvider('chineseprog', {
        provideDocumentRangeFormattingEdits: (document, range, options) => {
            return formatter.provideDocumentRangeFormattingEdits(document, range, options);
        }
    });
    // 监听保存前事件，实现保存时自动格式化
    const onWillSaveTextDocument = vscode_1.default.workspace.onWillSaveTextDocument((event) => {
        // 检查是否是中文编程文件
        if (event.document.languageId === 'chineseprog') {
            // 获取是否开启保存时自动格式化
            const config = vscode_1.default.workspace.getConfiguration('chineseprog');
            const formatOnSave = config.get('formatOnSave', true);
            if (formatOnSave) {
                // 添加格式化操作到保存操作中
                const formattingEdit = vscode_1.default.commands.executeCommand('editor.action.formatDocument');
                if (formattingEdit instanceof Promise) {
                    event.waitUntil(formattingEdit.then(() => []));
                }
            }
        }
    });
    // 添加到订阅列表
    context.subscriptions.push(runCommand);
    context.subscriptions.push(formatCommand);
    context.subscriptions.push(docFormattingProvider);
    context.subscriptions.push(rangeFormattingProvider);
    context.subscriptions.push(onWillSaveTextDocument);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map