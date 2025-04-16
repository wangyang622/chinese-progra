import vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { ChineseTranslator } from './translator';

export function activate(context: vscode.ExtensionContext) {
  console.log('Chinese Code Runner activated');
  
  // 创建转译器实例
  const translator = new ChineseTranslator();
  
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
  
  // 添加到订阅列表
  context.subscriptions.push(runCommand);
}

export function deactivate() {}