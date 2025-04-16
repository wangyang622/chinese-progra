import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  TextDocumentPositionParams,
  CompletionItem,
  CompletionItemKind,
  TextDocumentSyncKind,
  DidChangeConfigurationNotification,
  HoverParams,
  Hover,
  MarkupKind
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { ChineseTranslator } from './translator';

// 创建连接
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
const translator = new ChineseTranslator();

// 定义设置接口
interface ServerSettings {
  maxNumberOfProblems: number;
  enableDiagnostics: boolean;
}

const defaultSettings: ServerSettings = { 
  maxNumberOfProblems: 1000,
  enableDiagnostics: true
};

// 全局设置是基于用户的配置
const globalSettings: ServerSettings = defaultSettings;

connection.onInitialize(() => {
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true,
        triggerCharacters: ['.']
      },
      hoverProvider: true,
      definitionProvider: true
    }
  };
});

// 文档变更时检查
documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

// 提供代码补全
connection.onCompletion((): CompletionItem[] => {
  // 返回中文关键字和函数补全列表
  return [
    {
      label: '如果',
      kind: CompletionItemKind.Keyword,
      data: 1,
      detail: '条件语句',
      documentation: '如果 (条件) { ... }'
    },
    {
      label: '否则',
      kind: CompletionItemKind.Keyword,
      data: 2,
      detail: '条件语句',
      documentation: '否则 { ... }'
    },
    {
      label: '否则如果',
      kind: CompletionItemKind.Keyword,
      data: 3,
      detail: '条件语句',
      documentation: '否则如果 (条件) { ... }'
    },
    {
      label: '函数',
      kind: CompletionItemKind.Keyword,
      data: 4,
      detail: '函数定义',
      documentation: '函数 名称(参数) { ... }'
    },
    {
      label: '变量',
      kind: CompletionItemKind.Keyword,
      data: 5,
      detail: '变量定义',
      documentation: '变量 名称 = 值;'
    },
    {
      label: '常量',
      kind: CompletionItemKind.Keyword,
      data: 6,
      detail: '常量定义',
      documentation: '常量 名称 = 值;'
    },
    {
      label: '循环',
      kind: CompletionItemKind.Keyword,
      data: 7,
      detail: '循环语句',
      documentation: '循环 (初始化; 条件; 增量) { ... }'
    },
    {
      label: '当',
      kind: CompletionItemKind.Keyword,
      data: 8,
      detail: '循环语句',
      documentation: '当 (条件) { ... }'
    },
    {
      label: '返回',
      kind: CompletionItemKind.Keyword,
      data: 9,
      detail: '返回语句',
      documentation: '返回 值;'
    },
    {
      label: '输出',
      kind: CompletionItemKind.Function,
      data: 10,
      detail: '控制台输出',
      documentation: '输出(内容);'
    }
  ];
});

// 提供悬停提示
connection.onHover((params: HoverParams): Hover | null => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);
  
  // 获取当前单词
  let start = offset;
  let end = offset;
  
  while (start > 0 && /[\u4e00-\u9fa5a-zA-Z0-9_]/.test(text.charAt(start - 1))) {
    start--;
  }
  
  while (end < text.length && /[\u4e00-\u9fa5a-zA-Z0-9_]/.test(text.charAt(end))) {
    end++;
  }
  
  const word = text.substring(start, end);
  
  // 检查是否是关键字或函数
  const keywordMap: {[key: string]: string} = {
    '如果': '条件语句，等同于JavaScript中的if',
    '否则': '条件语句，等同于JavaScript中的else',
    '否则如果': '条件语句，等同于JavaScript中的else if',
    '循环': '循环语句，等同于JavaScript中的for',
    '当': '循环语句，等同于JavaScript中的while',
    '函数': '函数定义，等同于JavaScript中的function',
    '返回': '返回语句，等同于JavaScript中的return',
    '变量': '变量定义，等同于JavaScript中的let',
    '常量': '常量定义，等同于JavaScript中的const',
    '输出': '输出函数，等同于JavaScript中的console.log'
  };
  
  if (word in keywordMap) {
    return {
      contents: {
        kind: MarkupKind.Markdown,
        value: `**${word}**\n\n${keywordMap[word]}`
      }
    };
  }
  
  return null;
});

// 解析文档
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const diagnostics: Diagnostic[] = [];
  
  try {
    // 尝试转译代码，检查语法错误
    translator.translate(textDocument.getText());
  } catch (e) {
    // 添加错误诊断
    if (e instanceof Error) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: textDocument.positionAt(0),
          end: textDocument.positionAt(textDocument.getText().length)
        },
        message: `转译错误: ${e.message}`,
        source: '中文编程'
      });
    }
  }
  
  // 发送诊断结果
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// 启动服务
documents.listen(connection);
connection.listen(); 