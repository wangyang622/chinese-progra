import vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ChineseTranslator } from './translator';
import { ChineseFormatter } from './formatter';

export function activate(context: vscode.ExtensionContext) {
  console.log('Chinese Code Runner activated');
  
  // 创建转译器实例
  const translator = new ChineseTranslator();
  
  // 创建格式化器实例
  const formatter = new ChineseFormatter();
  
  // 创建输出通道
  const outputChannel = vscode.window.createOutputChannel('Chinese Code Runner');
  
  // 注册运行命令
  const runCommand = vscode.commands.registerCommand('chineseprog.runCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No file is open');
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
      exec(`node "${outputJsFile}"`, (error: any, stdout: any, stderr: any) => {
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
    } catch (error) {
      if (error instanceof Error) {
        vscode.window.showErrorMessage(`Translation error: ${error.message}`);
      } else {
        vscode.window.showErrorMessage(`Translation error: ${String(error)}`);
      }
    }
  });
  
  // 注册格式化命令
  const formatCommand = vscode.commands.registerCommand('chineseprog.formatCode', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'chineseprog') {
      return;
    }
    
    try {
      // 通过VSCode API执行格式化操作
      await vscode.commands.executeCommand('editor.action.formatDocument');
      vscode.window.showInformationMessage('代码格式化成功');
    } catch (error) {
      vscode.window.showErrorMessage(`格式化错误: ${error}`);
    }
  });
  
  // 注册文档格式化提供程序
  const docFormattingProvider = vscode.languages.registerDocumentFormattingEditProvider(
    'chineseprog',
    {
      provideDocumentFormattingEdits: (document: vscode.TextDocument, options: vscode.FormattingOptions) => {
        return formatter.provideDocumentFormattingEdits(document, options);
      }
    }
  );
  
  // 注册区域格式化提供程序
  const rangeFormattingProvider = vscode.languages.registerDocumentRangeFormattingEditProvider(
    'chineseprog',
    {
      provideDocumentRangeFormattingEdits: (document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions) => {
        return formatter.provideDocumentRangeFormattingEdits(document, range, options);
      }
    }
  );
  
  // 监听保存前事件，实现保存时自动格式化
  const onWillSaveTextDocument = vscode.workspace.onWillSaveTextDocument((event: vscode.TextDocumentWillSaveEvent) => {
    // 检查是否是中文编程文件
    if (event.document.languageId === 'chineseprog') {
      // 获取是否开启保存时自动格式化
      const config = vscode.workspace.getConfiguration('chineseprog');
      const formatOnSave = config.get('formatOnSave', true);
      
      if (formatOnSave) {
        // 添加格式化操作到保存操作中
        const formattingEdit = vscode.commands.executeCommand('editor.action.formatDocument');
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

export function deactivate() {}